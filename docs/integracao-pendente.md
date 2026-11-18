# Integração Java / Render

**Atualização de publicação em 18/11/2026:** frontend e proxy Python publicados na Vercel com status READY e estimativas públicas verificadas. Veja o [registro do deploy](deploy-python-vercel-2026-11-18.md). Referências abaixo à publicação Python pendente são históricas; o diagnóstico Java/Oracle permanece separado.

Frontend configurado para `https://guincho-save-lives-backend.onrender.com` por padrão. Contrato conferido no commit `c3d9505ae37bd37d5d2d087867576e2f59e73a8f` do [backend](https://github.com/velascoguzmanvictorhugo-ui/guincho-save-lives-backend).

## Implementado no frontend

- Busca por região/cidade e perfil usando `GET /guincheiros`.
- Cadastro simplificado do profissional em `/cadastro/guincheiro` usando `POST /guincheiros`.
- Pedido em `/solicitar-guincho` usando `POST /solicitacoes`, com nome do cliente e CEP opcional.
- Cliente de `GET /solicitacoes` disponível em `apiService.getRequests()`, sem expor a lista pública de nomes e endereços na interface.
- Fetch sem cookies, compatível com `allowCredentials(false)` do Java. GET sem Content-Type desnecessário; POST com JSON. Timeout de 90 segundos para inicialização da Render.
- Validação dos dados recebidos e mensagens de carregamento, erro, lista vazia e sucesso, sem fallback para mocks.
- Nenhuma disponibilidade, coordenada, avaliação, data ou status de atendimento é inventado quando ausente no Java.
- POST com resposta válida e `id: null` é tratado como registro recebido, sem inventar protocolo. O DAO gera o ID no Oracle, mas não atribui esse ID ao objeto devolvido pelo controller.
- Não há reenvio automático de POST. Falhas de conexão, HTTP 5xx e respostas inválidas bloqueiam novo envio no mesmo formulário, pois o Java pode ter persistido antes da falha.
- Modo demo continua disponível explicitamente em `.env.local` com `VITE_APP_MODE=demo`; dados locais não são carregados nem gravados pelo Context no modo API.

## Atualização em 18/11/2026

**Revisão posterior:** guincheiro fictício criado via Python e recuperado no Java com ID `11`. A escrita de solicitação revelou `ORA-00904: "NOME_CLIENTE": invalid identifier`; o SQL do Java precisa ser alinhado ao schema Oracle. A Vercel ainda entrega HTML na rota do proxy Python e seu bundle não contém a nova integração. Veja o [relatório completo](verificacao-apis-2026-11-18.md), com testes de CORS, cálculo, escrita e limites da validação.

Integração Python adicionada à calculadora `/estimar-guincho`, com proxy Vite/Vercel para resolver a ausência de CORS para a origem de produção. O fluxo HTTP local até o Python retornou HTTP 200 e a estimativa esperada. A consulta Java `/guincheiros` agora respondeu HTTP 200 com lista vazia; `/solicitacoes` continua com HTTP 500. Não houve POST de teste. Passaram 47 testes, lint e build; a verificação visual no Chrome foi interrompida pela ferramenta. Detalhes e configuração estão no [contrato Python](contrato-api-python.md). O registro abaixo preserva o diagnóstico anterior.

## Bloqueio observado no serviço publicado em 15/11/2026

Em **15/11/2026, aproximadamente 21h30 (America/Sao_Paulo)**, consultas diretas à Render retornaram:

| Rota | Resultado |
|---|---|
| `GET /guincheiros` | `HTTP 500`, JSON com `error: Internal Server Error` |
| `GET /solicitacoes` | `HTTP 500`, JSON com `error: Internal Server Error` |

Ambas responderam com `access-control-allow-origin: http://localhost:5173` ao receber esse Origin. Portanto, nessas consultas o serviço estava alcançável e o CORS aceitou a origem, mas a execução dos endpoints falhou. Sem logs da Render não é possível afirmar a causa interna.

Próximo passo do integrante responsável pelo backend: consultar os logs dessas chamadas, verificar acesso ao Oracle, configuração da conexão, tabelas `T_GSL_GUINCHEIRO` / `T_GSL_SOLICITACAO` e sequences `SQ_GSL_GUINCHEIRO` / `SQ_GSL_SOLICITACAO`. Corrigir o erro identificado e repetir GET e POST. As tabelas e sequences são utilizadas pelos DAOs do commit conferido; não são um diagnóstico confirmado do HTTP 500. O escopo deste repositório é frontend e integração HTTP; não inclui modificações Java.

Não foi possível comprovar persistência ponta a ponta com a Render nessa condição. Os testes automatizados do frontend usam respostas controladas do contrato Java. Nenhum cadastro de teste foi enviado à produção durante a verificação.

Validação local: TypeScript, ESLint, 29 testes automatizados (19 de integração do cliente com respostas controladas) e build de produção aprovados. A ferramenta integrada de navegador estava indisponível na verificação inicial. Na auditoria posterior de 15/11/2026, Chrome headless verificou nove páginas publicadas nas três resoluções oficiais, menu mobile/tablet e bloqueio de formulários vazios. O erro HTTP 500 da API foi observado na interface; persistência real ainda não foi validada. Consulte [a auditoria atual](revisao-frontend.md).

## Recursos que ainda exigem backend

- Autenticação e autorização de clientes, guincheiros e funcionários.
- Upload privado, análise e aprovação de documentos.
- Propostas, contrapropostas, mudanças de status, disponibilidade e avaliações.
- Chat, notificações, geocodificação, rotas e estimativas de chegada.
- Retornar o ID persistido nos POSTs. No registro de solicitação, tratar falhas posteriores à persistência sem induzir duplicidade (o serviço gera um relatório após salvar).

Essas rotas não existem nos controllers atuais. As telas de acesso informam a limitação; o modo API não simula autenticação nem usa as operações provisórias de `platformService.ts`.

## Publicação do frontend

O build usa `.env.production` com o modo API e a URL da Render. Se o provedor já tiver variáveis definidas, alinhe `VITE_APP_MODE=api` e `VITE_API_BASE_URL=https://guincho-save-lives-backend.onrender.com` e gere um novo build. Variáveis `VITE_` são incorporadas ao JavaScript público; não coloque segredos nelas.

O `vercel.json` mantém fallback das rotas SPA. A [Vercel pública](https://gincho-save-lives.vercel.app/) foi verificada em 15/11/2026, com produção READY no commit `11984ee`. Vídeo e confirmação das funções dos integrantes ainda dependem da equipe. O contato público agora é o GitHub Issues, indicado no README e na página Contato.

O comando `npm run check:api` consulta as duas rotas por Fetch, verifica HTTP/array/CORS e retorna código de saída 1 em caso de falha, sem exibir dados dos registros. Executado nesta correção de frontend, confirmou HTTP 500 em ambos os GETs e CORS aceitando a Vercel. Não realiza POST nem substitui a validação de persistência depois da correção do servidor.
