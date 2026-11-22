// Roda antes da página aparecer, para não "piscar" no tema errado.
// "data-tema" guarda a escolha da pessoa (claro/escuro); sem escolha, segue o sistema.
// "data-tema-atual" diz qual tema está valendo agora (usado no ícone do botão).
(function () {
  var raiz = document.documentElement;
  var escolha = null;
  try { escolha = localStorage.getItem("tema"); } catch (e) {}
  if (escolha === "claro" || escolha === "escuro") raiz.setAttribute("data-tema", escolha);
  var escuroSistema = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
  raiz.setAttribute("data-tema-atual", escolha || (escuroSistema ? "escuro" : "claro"));
})();
