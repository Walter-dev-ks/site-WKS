# Direção visual — WKS Systems

Referência consultada visualmente, do cabeçalho ao rodapé: https://getsquire.com/, em 13/11/2026. Esta análise se refere à homepage, não à totalidade das páginas internas.

## O que orientou a nova versão

1. Abertura preta, centralizada, com título branco condensado em caixa alta e parágrafo curto.
2. Azul vivo nos botões e pequenos indicadores; poucas cores competindo pelo foco.
3. Produto como elemento principal: telas grandes em sobreposição, fotografia editorial e uma área amarela de contraste no hero.
4. Faixa branca de confiança depois da abertura.
5. Seções de benefício em fundo claro, com texto e produto alternando de lado. Listas com divisórias finas e marcadores azuis.
6. Bloco de diferenciação seguido de fechamento comercial com grande área azul.
7. Rodapé preto, navegação objetiva e CTA repetido em pontos de decisão.

## Paleta implementada

| Uso | Cor |
| --- | --- |
| Abertura e rodapé | `#050505` |
| Títulos claros | `#ffffff` |
| Botões e marcadores | `#3384ff` |
| Fundo de benefícios | `#f4f3ef` |
| Títulos escuros | `#191b1c` |
| Texto secundário claro | `#777a7c` |
| Bloco final | `#087bff` |
| Contraste editorial do hero | `#f7c970` |

A paleta foi recriada a partir da referência visual; não é uma extração certificada dos tokens internos da SQUIRE.

## Adaptação à WKS

- A logo oficial enviada foi recuperada e usada como imagem, sem redesenho ou alteração das cores. Seu fundo branco foi mantido em uma área branca, com enquadramento em CSS para reduzir as margens do arquivo.
- Inter permanece no corpo. Barlow Condensed 800 foi acrescentada aos títulos para reproduzir o caráter editorial condensado da referência.
- Não foram copiados depoimentos, estatísticas, telas, fotografias ou promessas da SQUIRE. Os recursos da WKS foram limitados ao que foi verificado no código do CRM.
- A faixa de confiança informa fatos fornecidos: sistema pronto, uma barbearia ativa e personalização de identidade.
- As telas de agenda, clientes e financeiro são conceituais e identificadas como tal. Capturas reais podem ser configuradas em `src/config.js`.
- O white-label mantém funcionalidades e layout; a simulação demonstra apenas nome e cor. A logo do cliente é apresentada como parte da personalização comercial, sem um upload fictício que simule alteração no produto real.

## Verificação

Build de produção concluído. Página inspecionada em desktop e viewport de 390 × 844. Verificados: ausência de rolagem horizontal no celular, carregamento da logo e foto principal, âncoras, alternância de prévias, nome e cor no simulador, menu mobile, FAQ e resposta do formulário enquanto o WhatsApp está sem configuração. Nenhuma mensagem externa foi enviada.


## Revisão de legibilidade e movimento

Textos principais ampliados: 19 px no hero desktop, benefícios de 15 px no desktop e 16 px no celular, FAQ e formulário com escala maior. A logo usa o arquivo oficial com filtro SVG de apresentação para tornar os brancos transparentes, sobre uma caixa de vidro branco com blur e brilho difuso. O PNG original permanece intacto. Foram adicionados reveal por IntersectionObserver, flutuação suave, entradas do hero e respostas de hover, com fallback para prefers-reduced-motion. Verificação em desktop e celular: sem rolagem horizontal, textos mobile e inputs em 16 px, entrada de seção observada.
