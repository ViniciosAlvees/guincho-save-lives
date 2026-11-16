# Integração Java / Render

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

## Bloqueio observado no serviço publicado

Em **15/11/2026, aproximadamente 21h30 (America/Sao_Paulo)**, consultas diretas à Render retornaram:

| Rota | Resultado |
|---|---|
| `GET /guincheiros` | `HTTP 500`, JSON com `error: Internal Server Error` |
| `GET /solicitacoes` | `HTTP 500`, JSON com `error: Internal Server Error` |

Ambas responderam com `access-control-allow-origin: http://localhost:5173` ao receber esse Origin. Portanto, nessas consultas o serviço estava alcançável e o CORS aceitou a origem, mas a execução dos endpoints falhou. Sem logs da Render não é possível afirmar a causa interna.

Próximo passo no backend: consultar os logs dessas chamadas, verificar acesso ao Oracle, configuração da conexão, tabelas `T_GSL_GUINCHEIRO` / `T_GSL_SOLICITACAO` e sequences `SQ_GSL_GUINCHEIRO` / `SQ_GSL_SOLICITACAO`. Corrigir o erro identificado e repetir GET e POST. As tabelas e sequences são utilizadas pelos DAOs do commit conferido; não são um diagnóstico confirmado do HTTP 500.

Não foi possível comprovar persistência ponta a ponta com a Render nessa condição. Os testes automatizados do frontend usam respostas controladas do contrato Java. Nenhum cadastro de teste foi enviado à produção durante a verificação.

Validação local: TypeScript, ESLint, 29 testes automatizados (19 de integração do cliente com respostas controladas) e build de produção aprovados. A ferramenta de navegador desta sessão estava indisponível (`Computer Use native pipe is unavailable`), portanto não houve validação visual ou interação de formulário em navegador.

## Recursos que ainda exigem backend

- Autenticação e autorização de clientes, guincheiros e funcionários.
- Upload privado, análise e aprovação de documentos.
- Propostas, contrapropostas, mudanças de status, disponibilidade e avaliações.
- Chat, notificações, geocodificação, rotas e estimativas de chegada.
- Retornar o ID persistido nos POSTs. No registro de solicitação, tratar falhas posteriores à persistência sem induzir duplicidade (o serviço gera um relatório após salvar).

Essas rotas não existem nos controllers atuais. As telas de acesso informam a limitação; o modo API não simula autenticação nem usa as operações provisórias de `platformService.ts`.

## Publicação do frontend

O build usa `.env.production` com o modo API e a URL da Render. Se o provedor já tiver variáveis definidas, alinhe `VITE_APP_MODE=api` e `VITE_API_BASE_URL=https://guincho-save-lives-backend.onrender.com` e gere um novo build. Variáveis `VITE_` são incorporadas ao JavaScript público; não coloque segredos nelas.

O `vercel.json` mantém fallback das rotas SPA. Publicação do frontend, vídeo, confirmação das funções dos integrantes e contato oficial continuam a cargo da equipe.
