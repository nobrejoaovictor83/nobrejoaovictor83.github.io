# Portfólio

Site pessoal para divulgar meus projetos e meus infoprodutos.

Site estático: HTML, CSS e JavaScript puros, sem build. Hospedagem prevista: GitHub Pages (gratuito).

## Estrutura

- `index.html`: página principal.
- `assets/css/`: estilos.
- `assets/js/`: comportamento (JavaScript).
- `assets/img/`: imagens.

## Como ver o site no computador

No terminal, dentro desta pasta:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Depois abra http://localhost:8000 no navegador. Para parar o servidor: `Ctrl + C` no terminal.

## Manutenção

| O que mudar | Arquivo |
|---|---|
| Novo post do LinkedIn | `assets/data/linkedin.js` (copiar um bloco e trocar os textos) |
| Textos, projetos, produto, contato | `index.html` |
| Cores e visual | `assets/css/site.css` (variáveis no topo) |
| Nome amigável de repositório do GitHub | `assets/js/site.js` (`GITHUB_NOMES`) |

Repositórios públicos novos no GitHub (com descrição) aparecem sozinhos na seção "No GitHub".

Depois de mudar `linkedin.js` ou `site.js`, aumente o número `?v=` desse arquivo no final do `index.html`, para o navegador dos visitantes baixar a versão nova.

Fluxo de cada alteração: editar → conferir em http://localhost:8000 → `git add` → `git commit` → `git push` (quando o site estiver no GitHub Pages).

## Cuidados

- Não versionar chaves, senhas, tokens ou arquivos `.env`.
- A pasta `projeto_referencia/` é só consulta e fica fora do git (veja `.gitignore`).
