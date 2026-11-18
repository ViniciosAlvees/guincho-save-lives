# Revisão das APIs — 18/11/2026

**Atualização posterior:** a integração Python foi publicada na Vercel e validada pelo domínio público. Veja o [registro da publicação](deploy-python-vercel-2026-11-18.md). As observações sobre versão antiga da Vercel abaixo descrevem o estado anterior ao deploy.

Verificação realizada aproximadamente entre **10h30 e 10h34, America/Sao_Paulo**. Resultado: **as APIs funcionam parcialmente; solicitações estão com erro no Java/Oracle e a integração Python ainda não está publicada no frontend Vercel**.

## Serviços e testes remotos

| Serviço / operação | Resultado observado | Avaliação |
|---|---|---|
| Java `GET /guincheiros` | HTTP 200; inicialmente lista vazia; após teste, um guincheiro | Consulta e persistência do registro de teste confirmadas |
| Java `GET /clientes` | HTTP 200, lista vazia | Consulta funciona; não comprova cadastro, edição ou exclusão |
| Java `GET /solicitacoes` | HTTP 500 | Consulta quebrada no backend |
| Java `POST /solicitacoes` | HTTP 500, `ORA-00904: "NOME_CLIENTE": invalid identifier` | Criação quebrada por incompatibilidade SQL/Oracle |
| Python `GET /` | HTTP 200, contrato de status válido | Serviço acessível; isoladamente não comprova o banco |
| Python `GET /openapi.json` | HTTP 200, versão 1.1.0 | Rotas publicadas conferidas |
| Python `GET /estimativa` | HTTP 200, valores esperados para os três veículos, diurno e noturno | Cálculo funciona |
| Python `GET /clientes` e `/guincheiros` | HTTP 200, listas JSON | Encaminhamento de leitura ao Java funciona |
| Python `POST /guincheiros` | HTTP 201; registro recuperado no Java com ID `11` | Encaminhamento e gravação confirmados |
| Python `GET /solicitacoes` | HTTP 502, `status_java: 500` | Falha do Java propagada pelo Python |
| Vite local `/api/python/estimativa` | HTTP 200, JSON com valor 225 e moeda BRL | Proxy local funciona |
| Vercel publicada `/api/python/estimativa` | HTTP 200, **HTML** da SPA em vez de JSON | Proxy Python ainda não publicado |
| Bundle JavaScript da Vercel publicada | Sem `/estimar-guincho` e sem `/api/python` | Produção ainda está na versão anterior à integração |
| ViaCEP público `/ws/01001000/json/` | HTTP 200, contrato de CEP válido | Serviço externo acessível; não comprova execução a partir do Java |
| Tile público OpenStreetMap `/0/0/0.png` | HTTP 200, `image/png` | Dependência do mapa demo acessível |

### Estimativas conferidas

Preço base de R$ 180 e percurso de 10 km em todos os casos. Resultados comparados à função `estimar_preco` do Python:

| Veículo | Diurno | Noturno |
|---|---:|---:|
| Carro | R$ 225,00 | R$ 270,00 |
| Moto | R$ 191,25 | R$ 229,50 |
| Utilitário | R$ 303,75 | R$ 364,50 |

Entradas com base de 19, distância zero ou veículo `caminhao` foram corretamente recusadas com HTTP 422 e erros de validação JSON. Esse status nesses casos é o comportamento esperado.

### CORS

- Java: preflight OPTIONS para POST JSON em `/clientes`, `/guincheiros` e `/solicitacoes` aceitou `https://gincho-save-lives.vercel.app`, método POST e cabeçalho Content-Type.
- Python: preflight aceitou `http://localhost:5173`, mas respondeu HTTP 400 para a origem Vercel, sem autorizá-la no CORS.
- A configuração local usa `/api/python` na mesma origem do frontend e resolve essa restrição por proxy. A mesma regra existe no `vercel.json` local, mas ainda não consta no site publicado, conforme a resposta HTML da rota da API e a ausência das strings da integração no bundle.
- Preflight aprovado comprova permissão de CORS; não comprova que a gravação ou o banco funcionem.

## Testes de escrita autorizados

O usuário autorizou criar um guincheiro e uma solicitação com dados fictícios, ciente de que essas rotas não oferecem exclusão. Foram realizados **exatamente dois POSTs**, sem repetição automática:

1. `POST https://python-guincho-save.onrender.com/guincheiros`, usando os campos do frontend. Nome **`GSL TESTE API 20261118133346`**, região `TESTE INTEGRACAO`, cidade `Cidade Ficticia`, guincho Plataforma e preço 180. Retornou HTTP 201 e ID nulo. A consulta Java confirmou exatamente um registro com esse nome e **ID `11`**. Esse cadastro permanece no banco e é fictício.
2. `POST https://guincho-save-lives-backend.onrender.com/solicitacoes`, usando o mesmo marcador como nome do cliente, origem/destino fictícios, veículo Carro, problema `TESTE TECNICO SEM ATENDIMENTO REAL` e CEP nulo. Retornou HTTP 500 com erro Oracle de coluna inválida. Não houve confirmação de persistência, e o envio não foi repetido.

A resposta de guincheiro com ID nulo confirma o limite já tratado pelo frontend: o DAO insere o registro com sequence, mas não atribui o ID gerado ao objeto retornado. O ID foi obtido pela leitura posterior, sem inventar protocolo.

## Causa identificada e correções necessárias

O [`SolicitacaoDAO.java`](https://github.com/velascoguzmanvictorhugo-ui/guincho-save-lives-backend/blob/dde8c4766553e2b379285adff5b3e529d54062df/src/main/java/br/com/fiap/guincho/infra/dao/SolicitacaoDAO.java) usa `nome_cliente` tanto no INSERT quanto no SELECT de `tb_solicitacao`. O POST real retornou **`ORA-00904: "NOME_CLIENTE": invalid identifier`**. Isso identifica uma incompatibilidade entre o SQL executado e o schema Oracle acessado pelo serviço.

O responsável pelo Java/banco deve conferir a estrutura real de `tb_solicitacao` e alinhar o INSERT, o SELECT e o mapeamento do domínio. Não há evidência suficiente para escolher entre renomear a coluna, acrescentá-la ou obter o nome via relacionamento com `tb_cliente`. O SELECT também contém `cliente_id`; sua compatibilidade deve ser conferida junto com os demais campos. Não foi executada nenhuma migração de banco.

Depois da correção, validar uma criação e uma leitura de solicitação, incluindo o ID persistido. Não basta o Python responder online: ele usa o mesmo Java para essas operações.

Para a integração Python aparecer no site público, publicar o frontend e o `vercel.json` atuais, com `VITE_PYTHON_API_BASE_URL=/api/python`. O endpoint público da Vercel deve então responder JSON BRL em `/api/python/estimativa?...`, em vez de HTML. Se optar por chamadas diretas à Render Python, configurar `CORS_ORIGINS` para incluir a origem Vercel. Nenhuma configuração remota, commit, push ou deploy foi alterado nesta revisão.

## Código local e limites da revisão

- `npm run test`: **47 testes aprovados**, incluindo 19 do contrato Java e 18 do Python, com respostas controladas.
- `npm run lint`: aprovado.
- `npm run build`: TypeScript e build Vite aprovados.
- `git diff --check`: sem erros de whitespace.
- Conferidos os endpoints usados por `apiService` e `pythonService`, a separação entre modo API e demo e a regra de proxy antes do fallback da SPA.
- O CRUD de clientes existe na fonte Java e no OpenAPI Python, mas o frontend atual não oferece esse fluxo integrado. Apenas a listagem foi testada. POST/PUT/DELETE de clientes e GET de cliente por ID não foram exercitados.
- Login, autenticação, documentos, propostas, chat e avaliações não são APIs implementadas nesses controllers. `futurePlatformApi` continua sendo uma proposta não importada pelo modo API; os fluxos correspondentes permanecem demonstrativos ou indisponíveis.
- O Java atual tem `clienteId` opcional no domínio de solicitação. A fonte atual do serviço salva o pedido sem chamar `CorreioImpl`; o teste de acesso ao ViaCEP é independente. A implementação remota não foi inspecionada por logs internos.
- A ferramenta de Chrome encerrou a verificação visual no turno anterior por não conseguir determinar a URL atual com segurança. Nesta revisão foram usados código, HTTP real e testes automatizados; não se afirma validação de cliques/renderização no navegador.

Evidências técnicas sem corpos de dados pessoais foram salvas localmente em `output/verificacao-apis.json` e `output/verificacao-gravacao.json`. A pasta `output` é ignorada pelo Git. Os scripts dessa auditoria também estão nessa pasta e não são executados por `npm run test`; o script de escrita não deve ser repetido sem necessidade, pois criaria novos registros.
