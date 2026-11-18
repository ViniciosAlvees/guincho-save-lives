# Integração Java / Render e Python / Vercel

**Atualização de publicação em 18/11/2026:** frontend e API Python publicados na Vercel com status READY e estimativas públicas verificadas. O proxy `/api/python` aponta para a API Python na Vercel. Veja o [registro da migração](api-python-vercel-2026-11-18.md). O diagnóstico Java/Oracle permanece separado.

Base do frontend: `https://guincho-save-lives-backend.onrender.com`, modo API por padrão. GETs, POSTs e validação do contrato usam Fetch; sem cookies, sem retorno automático de mocks e sem repetição automática de escrita.

## Verificação anterior em 17/11/2026

- `GET /guincheiros` e `GET /solicitacoes`: HTTP 200 e arrays JSON; CORS aceitou a origem da Vercel e o preflight do POST JSON.
- Busca e perfil exibiram dados reais na interface pública nas três resoluções oficiais.
- Cadastro de guincheiro fictício: HTTP 201, seguido de GET com o registro persistido e ID 8.
- Solicitação fictícia: HTTP 201, seguida de GET com o registro persistido e ID 6.
- Os POSTs ainda devolvem ID nulo; a interface não inventa um protocolo. O ID acima foi confirmado em consulta posterior.

## Atualização em 18/11/2026

Guincheiro fictício criado via Python e recuperado no Java com ID `11`. A escrita de solicitação revelou `ORA-00904: "NOME_CLIENTE": invalid identifier`; o SQL do Java precisa ser alinhado ao schema Oracle. A gravação de solicitações não foi confirmada nessa revisão. Veja o [relatório completo](verificacao-apis-2026-11-18.md), com testes de CORS, cálculo, escrita e limites da validação. A versão antiga da Vercel citada nesse relatório foi substituída pelos deploys da integração Python.

Integração Python disponível na calculadora `/estimar-guincho`, com proxy Vite/Vercel e API Python também hospedada na Vercel. Os seis cenários de estimativa e a rejeição de entrada inválida passaram pelo domínio público do frontend. Passaram 73 testes, lint e build. A interação visual no Chrome não foi confirmada pela ferramenta. Detalhes e configuração estão no [contrato Python](contrato-api-python.md).

## Pendências atuais

1. Na revisão de 18/11/2026, GET e POST de solicitações retornaram HTTP 500; o POST indicou coluna Oracle inválida. O responsável deve alinhar SQL e schema e repetir criação e leitura. O Python não contorna esse erro do Java.
2. O código Java público contém credencial fixa do banco. Ela precisa ser substituída no banco e removida da configuração versionada. Não registrar seu valor em relatório, issue, frontend ou commit novo.
3. `GET /solicitacoes` ainda é anônimo e devolve dados de pedidos. A correção preparada exige sessão nessa listagem e na nova área de funcionários.
4. A API publicada não tem `/funcionarios/sessao` ou `/funcionarios/solicitacoes`. O frontend não libera acesso com PIN local. O responsável deve aplicar [a correção compilada e testada](../support/backend-security/README.md), cadastrar as variáveis privadas e publicar no Render.
5. Aprovação de documentos, alteração de status, negociação, chat e contas reais continuam sem endpoints implementados.

`npm run check:api` passou a esperar HTTP 401/403 na listagem anônima de pedidos. No serviço antigo, o comando deve falhar por segurança enquanto essa rota estiver pública, mesmo quando os GETs funcionam tecnicamente. Não exibe nomes/endereços e não faz escrita.

O pacote Java é de substituição de arquivos para o repositório separado, não um deploy já realizado nem uma implementação completa da rubrica DDD. A conexão disponível tem apenas leitura nesse repositório. Depois da aplicação, validar PIN incorreto, limite de tentativas, sessão, consulta autorizada, expiração, logout e os dois cadastros públicos, somente com dados fictícios.
