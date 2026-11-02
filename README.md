# Pousada Brisa do Rio

Landing page mobile first da Pousada Brisa do Rio, em Jucás, Ceará.
HTML, CSS e JavaScript puros, sem dependências ou etapa de build.

**Site:** https://jobvictorfern-cmd.github.io/pousada-brisa-do-rio/

## Desenvolvimento local

```sh
python -m http.server 4173
```

Abra http://localhost:4173 no navegador.

## Publicação

O GitHub Pages publica a raiz da branch `main`. Alterações enviadas para essa
branch atualizam o site automaticamente. O arquivo `.nojekyll` mantém a
publicação como arquivos estáticos.

## Arquivos

- `index.html`: conteúdo, links e metadados.
- `styles.css`: identidade visual, responsividade e animações.
- `script.js`: consulta pelo WhatsApp, menu móvel e galeria.
- `assets/`: fotos, logo e fonte local.

## Manutenção

O formulário prepara uma consulta pelo WhatsApp; a equipe da pousada confirma
valores e disponibilidade. O visitante envia a mensagem no WhatsApp.
Para mudar o telefone, atualize a constante `WHATSAPP` em `script.js` e os links
e dados estruturados em `index.html`.

As avaliações são trechos estáticos conferidos em 02/11/2026, sem sincronização
automática com o Google. Ao mudar o domínio, atualize o canonical, Open Graph
e a imagem dos dados estruturados em `index.html`.

## Créditos

Fotografias: [Turismo Jucás](https://www.turismojucas.com.br/servicos/pousada-brisa-do-rio)
e acervo fornecido para o projeto. As fotos do rio, café da manhã e gato
receberam restauração com IA, indicada na galeria.
Logo original da pousada. Fonte Montserrat, com licença SIL Open Font License
em `assets/montserrat-LICENSE.txt`.
