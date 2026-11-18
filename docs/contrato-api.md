# Contrato da API Java

A estimativa de preço utiliza uma segunda API, descrita no [contrato Python](contrato-api-python.md). As consultas e cadastros abaixo continuam usando o Java por padrão.

Base: `https://guincho-save-lives-backend.onrender.com`, configurável por `VITE_API_BASE_URL`. Fonte: [backend Java](https://github.com/velascoguzmanvictorhugo-ui/guincho-save-lives-backend), revisado no commit `dde8c4766553e2b379285adff5b3e529d54062df` em 18/11/2026. Veja a [revisão completa, incluindo escrita real](verificacao-apis-2026-11-18.md).

**Segurança:** a listagem publicada de solicitações ainda é anônima. A correção preparada em [support/backend-security](../support/backend-security/README.md) passa a exigir sessão nessa rota e adiciona `/funcionarios/sessao` e `/funcionarios/solicitacoes`. Essas mudanças ainda não foram aplicadas no Render. Não colocar o PIN ou as credenciais do banco no frontend.

| Método | Rota | Corpo / resposta |
|---|---|---|
| GET | `/guincheiros` | Array JSON de guincheiros |
| POST | `/guincheiros` | Cadastro; HTTP 201 com objeto enviado |
| GET | `/solicitacoes` | Array JSON de solicitações |
| POST | `/solicitacoes` | Contrato previsto: HTTP 201 com objeto enviado; atualmente retorna HTTP 500 |

## Guincheiro

```json
{
  "id": "12",
  "name": "Profissional fictício",
  "region": "Centro",
  "city": "São Paulo",
  "towType": "Plataforma",
  "price": 180
}
```

O POST envia apenas `name`, `region`, `city`, `towType` e `price`. O ID da lista vem do Oracle. Os campos `available`, `lat`, `lng`, `vehicles`, `jobs`, `about`, avaliações e aprovação não fazem parte do modelo Java.

## Solicitação

```json
{
  "id": "34",
  "clientName": "Cliente fictício",
  "origin": "Rua de origem",
  "destination": "Oficina destino",
  "vehicle": "Carro",
  "problem": "Pane elétrica",
  "cep": "01001000"
}
```

O POST do frontend envia os campos acima, exceto `id`. CEP opcional: remover máscara e enviar `null` se vazio. A fonte atual do serviço Java salva o CEP sem chamar o `CorreioImpl`. O domínio Java passou a aceitar também `clienteId` opcional, não preenchido pelo fluxo atual do frontend. Não há vínculo com um profissional, status de atendimento, descrição separada do veículo, detalhes adicionais, propostas ou mensagens nesse modelo.

As anotações `@JsonProperty` usam nomes em inglês; os getters do domínio também podem expor nomes portugueses. O cliente aceita `nome`, `regiao`, `cidade`, `tipoGuincho`, `preco`, `nomeCliente`, `origem`, `destino`, `veiculo` e `problema` como aliases de leitura, enviando somente os nomes declarados nas anotações.

## IDs e confirmação de escrita

Os DAOs atuais usam sequences ao inserir, mas não atualizam o ID no objeto retornado pelo POST. Portanto, `id: null` é uma resposta possível de criação bem-sucedida; a interface confirma o recebimento e informa que não houve protocolo na resposta. IDs da listagem são obrigatórios e normalizados para strings. Não se cria protocolo, status ou data no navegador.

Erro de rede, HTTP 5xx ou resposta inválida após POST pode acontecer depois da persistência. O frontend não repete a escrita automaticamente e pausa o reenvio no formulário. Para concluir a integração, o backend deve retornar o registro persistido e fornecer tratamento consistente dessas falhas.

## HTTP e CORS

Fetch com `credentials: 'omit'`, compatível com `CorsConfig.allowCredentials(false)`. GET sem Content-Type; POST com `Content-Type: application/json`. Timeout de 90 segundos. Não há cookies nem autenticação nesses controllers. Nunca colocar segredos em `VITE_*`.

Cliente e tipos: `src/services/apiClient.ts` e `src/services/towService.ts`. Tipos do fluxo demo continuam separados em `src/types/index.ts`. As operações antigas propostas em `platformService.ts` não são chamadas pelo modo API.

## Verificação

Na verificação anterior de 17/11/2026 os GETs responderam 200 e os POSTs de guincheiro e solicitação fictícios responderam 201, com persistência confirmada por consulta posterior. Houve também um HTTP 500 intermitente no navegador; não se afirma estabilidade absoluta do serviço. Os 55 testes do frontend incluem contrato controlado e autenticação; o pacote Java separado passou em 12 testes. Consulte [diagnóstico e pendências](integracao-pendente.md).

Testes automatizados usam respostas controladas do contrato acima. Na revisão de 18/11/2026, guincheiros e clientes responderam HTTP 200. Um guincheiro fictício criado via Python foi recuperado no Java com ID `11`, confirmando persistência. GET e POST de solicitações retornaram HTTP 500; o POST identificou `ORA-00904: "NOME_CLIENTE": invalid identifier`. A gravação de solicitações não foi confirmada. Os preflights Java aceitaram a origem Vercel. Consulte a [revisão completa](verificacao-apis-2026-11-18.md).
