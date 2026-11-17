# Correção de segurança e acesso de funcionários

Arquivos de substituição para o repositório Java `velascoguzmanvictorhugo-ui/guincho-save-lives-backend`, conferido no commit `45c50e18f5ab37c6ea69a5ce1377d35a05fec357`. Este diretório é um pacote de correção, não um segundo backend completo nem parte do build React.

**Estado:** compilado e testado em cópia temporária do backend. Não aplicado ao repositório remoto nem ao Render: a conexão disponível tem permissão de leitura, sem push nesse repositório. Os testes usam dados controlados e não abrem conexão com o Oracle.

## Aplicar

1. O responsável pelo banco deve **trocar a senha que já ficou exposta no histórico público**. Remover o literal do arquivo atual não invalida cópias ou commits antigos. Não reutilizar essa senha nem enviá-la por chat, issue ou commit.
2. Copiar os arquivos deste diretório para os mesmos caminhos do backend, preservando o `pom.xml`, o Dockerfile e os demais arquivos do projeto. Se já houver `application.properties`, `.gitignore` ou `.dockerignore` personalizados, incorporar as regras sem apagar configurações existentes. Não copiar este README por cima da documentação técnica existente.
3. Configurar **somente no ambiente privado do Render**: `DB_URL`, `DB_USER`, `DB_PASSWORD` com os valores novos. Sem prefixo `VITE_`, sem usuário/senha no JDBC URL e sem esses valores no frontend ou no GitHub. O usuário Oracle deve ter somente as permissões necessárias à aplicação.
4. Escolher um PIN novo e executar localmente `java tools/GenerateEmployeePinHash.java`. O programa pede o PIN sem exibi-lo e produz o hash PBKDF2. Cadastrar o resultado em `EMPLOYEE_PIN_HASH` no Render. Não cadastrar o PIN em texto puro nem em variável do frontend. Não há PIN padrão neste pacote.
5. Executar `mvn test` e `mvn clean package`. Publicar o backend revisado com as variáveis configuradas. As sessões são em memória: expiram em 30 minutos e são invalidadas ao reiniciar o serviço.
6. Validar o acesso pelo frontend, a rejeição de PIN incorreto, o bloqueio de chamadas sem sessão, a consulta autorizada e o logout. Repetir `npm run check:api` no frontend. Não divulgar respostas com nomes ou endereços de usuários reais.

## Contrato de funcionários

| Método | Rota | Resultado |
|---|---|---|
| POST | `/funcionarios/sessao` | JSON `{ "pin": "<oito dígitos>" }`; HTTP 200 com `token` opaco e `expiresAt` ISO 8601 |
| GET | `/funcionarios/solicitacoes` | `Authorization: Bearer <token>`; lista de solicitações, com `Cache-Control: no-store` |
| DELETE | `/funcionarios/sessao` | Mesmo cabeçalho; invalida o token e responde HTTP 204 |
| GET | `/solicitacoes` | A listagem antiga também passa a exigir a sessão; sem ela, HTTP 401 |

PIN inválido: 401; formato incorreto: 400; cinco tentativas malsucedidas pela mesma origem em dez minutos: 429; hash ausente/inválido: 503. No Render, clientes podem compartilhar o endereço do proxy; conferir o comportamento desse limite na infraestrutura antes de ampliar o serviço. Não se confia em um `X-Forwarded-For` enviado livremente pelo visitante. Há limites de memória para tentativas e sessões.

O PIN é comparado por PBKDF2-HMAC-SHA256 com salt aleatório e 600.000 iterações. Tokens de 256 bits são aleatórios; somente seus hashes ficam no mapa de sessões. O frontend guarda a sessão em memória e manda o token no cabeçalho, sem cookies. O CORS atual do Java permite esses cabeçalhos. Nenhum token ou PIN vai na URL.

## O que a correção cobre

- Remove as credenciais fixas do `ConnectionFactory` e não registra seus valores.
- Evita devolver mensagens de exceção, detalhes SQL e stack traces nos controllers; erros têm JSON genérico.
- Impede a listagem anônima de solicitações, que contém nome, origem e destino.
- Adiciona login, sessão, expiração, limite de tentativas e logout de funcionários.
- Exclui `.env`, chaves, wallets, relatório e artefatos de build dos contextos de Git/Docker novos. Arquivos já rastreados exigem retirada do índice e revisão pelo responsável; `.gitignore` não apaga histórico.

**Limites:** não completa a rubrica de DDD. Ainda faltam CRUD completo, DTOs/Bean Validation/ModelMapper, relacionamento 1:N, script SQL e documentação técnica exigidos no PDF. Também não implementa análise de documentos ou alteração do status de atendimentos. Não foi feita auditoria completa das dependências Java. O cadastro público continua destinado apenas a testes acadêmicos; contas reais e operação comercial exigem um modelo de autorização mais amplo.
