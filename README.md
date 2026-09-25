# Desafio VTEX

Projeto do desafio VTEX do curso da Econverse (Variações 1, 2 e 3).

## Variação 1 — Leads e Master Data

- Entidade `LD` no Master Data pra guardar leads (`firstName`, `lastName`, `email`, `interestCategory`, `optIn`).
- Bloco `LeadForm` (React) com formulário, validação e envio direto pro Master Data.
- Bloco registrado em `interfaces.json` e `blocks.json`, adicionado na home.
- Layout com abas (`tab-layout`) com 3 vitrines: mais vendidos, promoções e novidades.

## Variação 2 — ProductNameSimple

`ProductNameSimple.tsx`: pega o nome do produto e os preços De/Por do `ProductContext` e mostra numa barra fixa embaixo da tela.

## Variação 3 — Selo de Promoção

`PromotionBadge.tsx`: mostra um selo de "Promoção" quando o produto tem desconto (list price maior que o preço de venda).

## Estrutura

```
manifest.json
react/
  LeadForm.tsx
  ProductNameSimple.tsx
  PromotionBadge.tsx
store/
  interfaces.json
  blocks.json
masterdata/
  leads-schema.json   -> schema da entidade LD (campos e tipos)
```

## Rodando

```bash
vtex login econverse
vtex use <seu-workspace>
vtex link
```

## Observação

O `masterdata/leads-schema.json` tem a config de `v-security` com os campos liberados pra escrita pública (assim o form consegue gravar sem precisar de autenticação/backend). Isso precisa ser aplicado na entidade por alguém com permissão de admin no Master Data — ainda não foi aplicado nessa conta.
