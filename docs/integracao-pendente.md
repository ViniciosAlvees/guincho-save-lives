# Integração Java / Render - 17/11/2026

Base do frontend: `https://guincho-save-lives-backend.onrender.com`, modo API por padrão. GETs, POSTs e validação do contrato usam Fetch; sem cookies, sem retorno automático de mocks e sem repetição automática de escrita.

## Comprovado

- `GET /guincheiros` e `GET /solicitacoes`: HTTP 200 e arrays JSON; CORS aceitou a origem da Vercel e o preflight do POST JSON.
- Busca e perfil exibiram dados reais na interface pública nas três resoluções oficiais.
- Cadastro de guincheiro fictício: HTTP 201, seguido de GET com o registro persistido e ID 8.
- Solicitação fictícia: HTTP 201, seguida de GET com o registro persistido e ID 6.
- Os POSTs ainda devolvem ID nulo; a interface não inventa um protocolo. O ID acima foi confirmado em consulta posterior.

## Pendências atuais

1. Houve um HTTP 500 intermitente na navegação, embora consultas seguintes tenham respondido 200. Sem logs do Render não se afirma a causa interna.
2. O código Java público contém credencial fixa do banco. Ela precisa ser substituída no banco e removida da configuração versionada. Não registrar seu valor em relatório, issue, frontend ou commit novo.
3. `GET /solicitacoes` ainda é anônimo e devolve dados de pedidos. A correção preparada exige sessão nessa listagem e na nova área de funcionários.
4. A API publicada não tem `/funcionarios/sessao` ou `/funcionarios/solicitacoes`. O frontend não libera acesso com PIN local. O responsável deve aplicar [a correção compilada e testada](../support/backend-security/README.md), cadastrar as variáveis privadas e publicar no Render.
5. Aprovação de documentos, alteração de status, negociação, chat e contas reais continuam sem endpoints implementados.

`npm run check:api` passou a esperar HTTP 401/403 na listagem anônima de pedidos. No serviço antigo, o comando deve falhar por segurança enquanto essa rota estiver pública, mesmo quando os GETs funcionam tecnicamente. Não exibe nomes/endereços e não faz escrita.

O pacote Java é de substituição de arquivos para o repositório separado, não um deploy já realizado nem uma implementação completa da rubrica DDD. A conexão disponível tem apenas leitura nesse repositório. Depois da aplicação, validar PIN incorreto, limite de tentativas, sessão, consulta autorizada, expiração, logout e os dois cadastros públicos, somente com dados fictícios.
