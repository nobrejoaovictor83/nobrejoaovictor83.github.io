// Comportamento do site: tema, menu no celular, publicações do LinkedIn e repositórios do GitHub.
(function () {
  "use strict";

  var GITHUB_USUARIO = "nobrejoaovictor83";
  // Repositórios que não devem aparecer na lista (ex.: o próprio site)
  var GITHUB_OCULTOS = ["portfolio_site", "portfolio-site", GITHUB_USUARIO + ".github.io"];
  var GITHUB_CACHE_MIN = 60; // guarda a resposta por 60 min (a API grátis aceita 60 consultas/hora)
  // Nomes amigáveis (opcional). Repositório fora desta lista usa o próprio nome.
  var GITHUB_NOMES = {
    "projeto-pipeline-atlas": "Pipeline de vendas de Cursos Livres",
    "alerta-vagas": "Alerta de vagas"
  };

  // Cria um elemento com texto (nunca usa innerHTML com dados de fora: mais seguro)
  function el(tag, classe, texto) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto != null) e.textContent = texto;
    return e;
  }

  function linkExterno(href, texto) {
    var a = el("a", "link", texto);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }

  function dataBR(iso) {
    var p = String(iso).slice(0, 10).split("-");
    var meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    return p.length === 3 ? Number(p[2]) + " " + meses[Number(p[1]) - 1] + " " + p[0] : "";
  }

  // Ano no rodapé
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // Botão de tema
  var raiz = document.documentElement;
  var temaBtn = document.getElementById("temaBtn");
  if (temaBtn) {
    temaBtn.addEventListener("click", function () {
      var novo = raiz.getAttribute("data-tema-atual") === "escuro" ? "claro" : "escuro";
      raiz.setAttribute("data-tema", novo);
      raiz.setAttribute("data-tema-atual", novo);
      try { localStorage.setItem("tema", novo); } catch (e) {}
    });
  }

  // Menu no celular
  var menuBtn = document.getElementById("menuBtn");
  var menu = document.getElementById("menu");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      var aberto = menu.classList.toggle("aberto");
      menuBtn.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
    menu.addEventListener("click", function (ev) {
      if (ev.target.tagName === "A") {
        menu.classList.remove("aberto");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Publicações do LinkedIn (vêm de assets/data/linkedin.js)
  var listaPosts = document.getElementById("linkedinPosts");
  var posts = (window.LINKEDIN_POSTS || []).slice().sort(function (a, b) {
    return String(b.data).localeCompare(String(a.data));
  });
  if (listaPosts) {
    if (!posts.length) {
      document.getElementById("linkedin").hidden = true;
    } else {
      posts.forEach(function (p) {
        var li = el("li");
        var t = el("time", null, dataBR(p.data));
        t.dateTime = p.data;
        li.appendChild(t);
        li.appendChild(el("h4", null, p.titulo));
        if (p.resumo) li.appendChild(el("p", null, p.resumo));
        if (p.link) li.appendChild(linkExterno(p.link, "Ler no LinkedIn"));
        listaPosts.appendChild(li);
      });
    }
  }

  // Repositórios do GitHub: substitui a lista fixa do HTML se a API responder
  var caixaRepos = document.getElementById("githubRepos");

  function nomeBonito(nome) {
    if (GITHUB_NOMES[nome]) return GITHUB_NOMES[nome];
    var s = nome.replace(/[-_]+/g, " ").trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function mostrarRepos(repos) {
    if (!repos.length) return; // mantém a lista fixa
    caixaRepos.textContent = "";
    repos.forEach(function (r) {
      var card = el("article", "card");
      card.appendChild(el("h4", null, nomeBonito(r.nome)));
      card.appendChild(el("p", null, r.descricao));
      var tags = el("ul", "tags mini");
      r.tags.forEach(function (t) { tags.appendChild(el("li", null, t)); });
      if (r.tags.length) card.appendChild(tags);
      card.appendChild(linkExterno(r.url, "Ver no GitHub"));
      caixaRepos.appendChild(card);
    });
  }

  function lerCache() {
    try {
      var c = JSON.parse(localStorage.getItem("github-repos"));
      if (c && Date.now() - c.quando < GITHUB_CACHE_MIN * 60000) return c.repos;
    } catch (e) {}
    return null;
  }

  if (caixaRepos && window.fetch) {
    var cache = lerCache();
    if (cache) {
      mostrarRepos(cache);
    } else {
      fetch("https://api.github.com/users/" + GITHUB_USUARIO + "/repos?per_page=100&sort=pushed", {
        headers: { Accept: "application/vnd.github+json" }
      })
        .then(function (resp) { if (!resp.ok) throw new Error("GitHub " + resp.status); return resp.json(); })
        .then(function (dados) {
          var repos = dados
            .filter(function (r) {
              return !r.fork && !r.archived && r.description && GITHUB_OCULTOS.indexOf(r.name) === -1;
            })
            .map(function (r) {
              var tags = [];
              if (r.language) tags.push(r.language);
              (r.topics || []).slice(0, 4).forEach(function (t) { tags.push(t); });
              return { nome: r.name, descricao: r.description, url: r.html_url, tags: tags };
            });
          try { localStorage.setItem("github-repos", JSON.stringify({ quando: Date.now(), repos: repos })); } catch (e) {}
          mostrarRepos(repos);
        })
        .catch(function () { /* sem internet ou limite da API: fica a lista fixa do HTML */ });
    }
  }
})();
