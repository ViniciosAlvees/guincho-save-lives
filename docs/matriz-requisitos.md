# Matriz de requisitos — auditoria de 15/11/2026

| Critério | Peso oficial | Evidência atual | Situação |
|---|---:|---|---|
| React, Vite e TypeScript | 10 | Build, lint, 29 testes e instalação/execução a partir de ZIP extraído | Comprovado |
| Componentes, páginas e rotas | 10 | Cinco institucionais, páginas da solução, reutilização e parâmetro; renderização pública | Comprovado no alcance testado; dados do perfil dependem da API |
| Tailwind e responsividade | 8 | Nove páginas em 390×844, 768×1024 e 1440×900; sem rolagem horizontal | Ajuste de sobreposição decorativa no tablet feito localmente; publicar |
| API Java | 18 | Serviços Fetch, tipos e estados; CORS aceita a Vercel | **Pendente:** GET retorna 500 e persistência não comprovada |
| Formulários e UX | 7 | Campos, validação de envio vazio, estados e mensagens | Parcial: sucesso com API real ainda não comprovado |
| Vercel | 7 | https://gincho-save-lives.vercel.app/ pública, produção READY em `11984ee` | Publicada; integração falha no backend; correções locais ainda não publicadas |
| GitHub, README e vídeo | 10 | Repositório público, README e canal de contato no GitHub atualizados | **Pendente:** `main` com 12 commits de um único autor; colegas aplicarão contribuições e vídeo ainda será produzido |
| Apresentação presencial | 30 | Deve ser realizada de 23 a 27/11 | Pendente; todos devem participar e explicar o código |
| **Total da rubrica** | **100** | Não equivale a uma nota atribuída nesta auditoria | |

Exigência Git: mínimo de 15 commits no total e cinco por integrante. Com cinco integrantes, pelo menos 25 commits autênticos são necessários. Não contar checkpoints auxiliares como participação do grupo.

ZIP de conferência do commit `a09aff1`: 3.733.807 bytes, sem `node_modules` e `.git`, com identificação, assets, fontes e configurações; instalação, build e início do servidor aprovados após extração. Essa amostra não comprova o ZIP final nem a submissão.

Entrega: um ZIP de até 50 MB, com `identificacao.txt`, anexado pelo representante no Portal do Aluno até **19/11/2026, 23h55**. O cadastro do grupo deveria ter ocorrido até 13/11; conferir comprovante.

Veja [a auditoria completa, com todos os itens de penalidade](revisao-frontend.md).

Correções possíveis no frontend já aplicadas localmente: Sobre com CitizenTech, metas ODS e indicadores; Home coerente com o modo API; canal de contato real; layout de tablet; diagnóstico GET e empacotador verificado. Alterações Java ficam com o responsável pelo backend, conforme orientação do usuário. Nenhum vídeo, commit de colega ou resultado de impacto foi fabricado.
