# WKS Systems — landing page

Landing page em português, React 18, CSS responsivo e build com esbuild. O resultado é estático: não exige servidor Node em produção. A implementação evita dependências de animação e carrega fonte e fotografia localmente.

## Executar

```sh
npm install
npm run build
npm run dev
```

Abra http://127.0.0.1:5174. Para produção, publique o conteúdo de `dist/` em uma hospedagem estática.

O arquivo `WKS-Preview.html` incluído no pacote é uma prévia autocontida: abra diretamente no navegador, sem instalar dependências. Ele é gerado a partir do mesmo build. Alterações no código exigem uma nova compilação.

## Ativar o WhatsApp

Edite `src/config.js`, preenchendo `sales.whatsapp` com país, DDD e número, somente dígitos. Nenhum número fictício foi ativado. Enquanto não configurado, o formulário exibe uma mensagem clara e não envia dados.

O formulário utiliza validação nativa, monta uma mensagem com nome e barbearia e abre o WhatsApp. Não armazena leads nem confirma agendamentos. O interessado revisa a mensagem e envia no próprio WhatsApp. Não há integração com calendário.

## Inserir screenshots e GIFs reais

Coloque arquivos aprovados em `public/media/`. Em `src/config.js`, preencha `media.agenda`, `media.clientes`, `media.financeiro` e `media.identity` com caminhos como `/media/agenda.gif`. Os arquivos substituem as ilustrações das abas. Os mesmos caminhos de mídia são usados no hero e nas seções correspondentes.

As telas atuais usam dados fictícios e estão identificadas como ilustrações. Não são capturas do produto. Evite dados pessoais em materiais comerciais.

## Conteúdo e marca

Funcionalidades verificadas nos arquivos públicos de `Walter-dev-ks/Bahianus-Barber`, branch `main`, em 13/11/2026: agenda, visão diária, clientes, funcionários e comissões, serviços, produtos, planos, financeiro e relatórios. Foram consultadas as rotas e o menu do aplicativo; não houve acesso à operação do cliente nem ao banco de dados. Repositório do cliente não foi modificado.

White-label: apenas nome, cores e logo; mesmas funções e layout, conforme orientação comercial. Nenhum depoimento, resultado percentual, preço ou prazo de implantação foi inventado.

A logo oficial enviada está em `public/media/wks-logo.png` e é usada no cabeçalho e no rodapé. O arquivo original foi preservado, com enquadramento em CSS para reduzir as margens brancas. A fonte de títulos Barlow Condensed complementa a Inter do corpo. Consulte `DESIGN.md` para a análise da referência e as decisões de composição.

Referência de composição: https://getsquire.com/ — sem copiar textos, screenshots ou identidade da SQUIRE.

Fotografia editorial: Unsplash, https://images.unsplash.com/photo-1503951914875-452162b0f3f1 . Fonte: Inter, Google Fonts (SIL Open Font License). Títulos: Barlow Condensed, Google Fonts (SIL Open Font License).

## Estrutura

- `src/App.jsx`: componentes, seções e interações.
- `src/ui.jsx`: ícones e prévia de clientes.
- `src/design.css`: tokens, tipografia, responsividade e estados de foco.
- `src/config.js`: destino comercial e mídia real.
- `scripts/build.mjs`: build de produção.
- `scripts/serve.mjs`: servidor de prévia local, restrito a loopback.
- `public/media`: fotografia e Inter locais.

## Validação e pendências

Build de produção concluído. Inspeção visual realizada em desktop e celular. Verificados menu, FAQ, prévias de produto, simulador de nome e cor, âncoras e formulário sem envio externo.

Antes de campanhas: informar WhatsApp comercial, inserir screenshots aprovados e revisar oferta/condições com o responsável comercial.
