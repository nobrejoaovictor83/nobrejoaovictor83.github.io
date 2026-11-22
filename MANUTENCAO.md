# Guia de manutenção do site

Passo a passo para as tarefas do dia a dia. Toda alteração segue o mesmo ciclo:

**editar o arquivo → conferir no navegador → salvar no git → enviar para o GitHub**

---

## 0. Antes de começar

**Editor de texto:** qualquer um serve (até o Bloco de Notas), mas o **VS Code** (grátis: https://code.visualstudio.com) é bem melhor: ele colore o código e avisa quando falta uma vírgula ou aspa.

**Abrir o terminal na pasta do site** (PowerShell):

```powershell
cd C:\Projetos\portfolio_site
```

**Ver o site no seu computador:**

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Abra http://localhost:8000 no navegador. Deixe esse terminal aberto enquanto edita.
Para ver uma alteração, recarregue a página com **Ctrl + Shift + R** (recarrega sem cache).
Para parar o servidor: **Ctrl + C** no terminal.

---

## 1. Adicionar um post do LinkedIn

Arquivo: `assets/data/linkedin.js`

**1.1 Copie o link do post.** No LinkedIn, abra o post → clique nos **"…"** → **Copiar link da publicação**.
Apague tudo do `?` em diante (é só rastreamento). Exemplo:

- Copiado: `https://www.linkedin.com/feed/update/urn:li:activity:7522006256178348032/?utm_source=share...`
- Use: `https://www.linkedin.com/feed/update/urn:li:activity:7522006256178348032/`

**1.2 Acrescente um bloco no arquivo.** Logo abaixo da linha `window.LINKEDIN_POSTS = [`, cole:

```js
  {
    data: "2026-11-25",
    titulo: "Título curto do post, em uma linha",
    resumo: "Uma ou duas frases dizendo do que o post trata.",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:0000000000000000000/"
  },
```

Regras para não quebrar:
- `data` no formato **ano-mês-dia**, entre aspas. A ordem dos blocos não importa: o site mostra o mais novo primeiro.
- Todo texto fica **entre aspas duplas** `"..."`. Se o texto tiver aspas, troque por aspas simples ou `“ ”`.
- Cada bloco termina com `},` (chave e vírgula).

**1.3 Avise o navegador que mudou.** No final do `index.html`, aumente o número da versão:

```html
<script src="assets/data/linkedin.js?v=2" defer></script>   →   ?v=3
```

**1.4 Confira** em http://localhost:8000, na seção Publicações.
Se a seção **sumiu**, há um erro de digitação no arquivo (quase sempre vírgula ou aspa faltando). Aperte **F12** no navegador → aba **Console**: a mensagem em vermelho diz a linha do erro.

**Para remover um post:** apague o bloco inteiro, de `{` até `},`.

---

## 2. Adicionar um projeto do GitHub

Não precisa mexer no site. Crie o repositório como **público** e preencha a **descrição** (campo "About" na página do repositório). Ele aparece sozinho na seção "No GitHub" (pode levar até 1 hora, por causa do cache).

Opcional: para mostrar um nome mais bonito que o nome do repositório, acrescente uma linha em `GITHUB_NOMES` no arquivo `assets/js/site.js`:

```js
  var GITHUB_NOMES = {
    "projeto-pipeline-atlas": "Pipeline de vendas de Cursos Livres",
    "alerta-vagas": "Alerta de vagas",
    "nome-do-repositorio": "Nome bonito"
  };
```

Repositórios **fork**, **arquivados** ou **sem descrição** não aparecem.

---

## 3. Adicionar um dashboard com print

**3.1 Salve o print** em `assets/img/projetos/`, com nome sem espaços e sem acento (ex.: `estoque.jpg`).
Confira antes: **nada de dados reais da empresa** (valores, fornecedores, CNPJs, nomes de pessoas).

**3.2 Copie um card existente** no `index.html` (procure por `<article class="card">` na seção "Dashboards e design" ou "Estudos") e troque:

```html
<article class="card">
  <button class="foto" type="button" data-titulo="Estoque" data-fotos="assets/img/projetos/estoque.jpg">
    <img src="assets/img/projetos/estoque.jpg" alt="Painel de Estoque em Power BI" loading="lazy">
  </button>
  <h4>Estoque</h4>
  <p>O que o painel mostra, em uma ou duas frases.</p>
  <ul class="tags mini"><li>Power BI</li><li>Estudo</li></ul>
</article>
```

Com **várias telas**, liste as imagens separadas por vírgula em `data-fotos` (a primeira é a capa) e acrescente `<span class="qtd">3 telas</span>` logo depois do `<img ...>`.

Se o painel tiver **link público** ("Publicar na Web" do Power BI, endereço com `app.powerbi.com/view?r=`), acrescente antes de `</article>`:

```html
  <a class="link" href="COLE_O_LINK_AQUI" target="_blank" rel="noopener noreferrer">Abrir painel interativo</a>
```

Links com `app.powerbi.com/groups/me/...` **não servem**: só abrem para quem está logado na sua conta.

---

## 4. Mudar textos, preço, contato

Tudo fica no `index.html`. Use **Ctrl + F** no editor para achar o texto que quer mudar (ex.: procure `27` para o preço, `Sobre` para a bio) e edite só o texto entre as tags, sem apagar `<` e `>`.

**Cores:** no começo de `assets/css/site.css`. `--acento` é o verde principal; `--ouro` é a cor dos números de destaque. Depois de mudar o CSS, aumente o `?v=` de `site.css` no topo do `index.html`.

---

## 5. Salvar no git e publicar

Depois de conferir no navegador:

```powershell
git status
```
Mostra o que mudou (em vermelho = ainda não preparado).

```powershell
git add -A
```
Prepara todas as alterações.

```powershell
git commit -m "Adiciona post sobre Kanban"
```
Salva uma "foto" do projeto com uma mensagem curta dizendo o que mudou.

```powershell
git push
```
Envia para o GitHub. Em cerca de 1 minuto o site no ar se atualiza. (Só depois que o site estiver publicado no GitHub Pages.)

---

## 6. Deu errado? Como desfazer

Desfazer alterações **ainda não salvas** em um arquivo (volta para o último commit):

```powershell
git restore assets/data/linkedin.js
```

Ver o histórico de commits:

```powershell
git log --oneline
```

Na dúvida, não force nada (`--force`, `reset --hard`): peça ajuda ao Claude.

---

## 7. Pedindo ajuda ao Claude

Você também pode só pedir, por exemplo:
- "Adicione este post ao site: <link>, tema: <uma frase>"
- "Coloquei o print `estoque.jpg` em assets/img/projetos, crie o card nos Estudos"
- "Mude o preço da planilha para R$ 37"

O Claude edita, confere no navegador e faz o commit; o `git push` só com o seu OK.
