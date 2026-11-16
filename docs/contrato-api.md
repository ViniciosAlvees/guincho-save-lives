# Contrato da API Java

Base: `https://guincho-save-lives-backend.onrender.com`, configurável por `VITE_API_BASE_URL`. Fonte: [backend Java](https://github.com/velascoguzmanvictorhugo-ui/guincho-save-lives-backend), commit `c3d9505ae37bd37d5d2d087867576e2f59e73a8f`.

| Método | Rota | Corpo / resposta |
|---|---|---|
| GET | `/guincheiros` | Array JSON de guincheiros |
| POST | `/guincheiros` | Cadastro; HTTP 201 com objeto enviado |
| GET | `/solicitacoes` | Array JSON de solicitações |
| POST | `/solicitacoes` | Cadastro; HTTP 201 com objeto enviado e endereço quando consultado |

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

O POST envia os campos acima, exceto `id`. CEP opcional: remover máscara e enviar `null` se vazio. CEP informado aciona consulta de endereço no serviço Java. Não há vínculo com um profissional, status de atendimento, descrição separada do veículo, detalhes adicionais, propostas ou mensagens nesse modelo.

As anotações `@JsonProperty` usam nomes em inglês; os getters do domínio também podem expor nomes portugueses. O cliente aceita `nome`, `regiao`, `cidade`, `tipoGuincho`, `preco`, `nomeCliente`, `origem`, `destino`, `veiculo` e `problema` como aliases de leitura, enviando somente os nomes declarados nas anotações.

## IDs e confirmação de escrita

Os DAOs atuais usam sequences ao inserir, mas não atualizam o ID no objeto retornado pelo POST. Portanto, `id: null` é uma resposta possível de criação bem-sucedida; a interface confirma o recebimento e informa que não houve protocolo na resposta. IDs da listagem são obrigatórios e normalizados para strings. Não se cria protocolo, status ou data no navegador.

Erro de rede, HTTP 5xx ou resposta inválida após POST pode acontecer depois da persistência. O frontend não repete a escrita automaticamente e pausa o reenvio no formulário. Para concluir a integração, o backend deve retornar o registro persistido e fornecer tratamento consistente dessas falhas.

## HTTP e CORS

Fetch com `credentials: 'omit'`, compatível com `CorsConfig.allowCredentials(false)`. GET sem Content-Type; POST com `Content-Type: application/json`. Timeout de 90 segundos. Não há cookies nem autenticação nesses controllers. Nunca colocar segredos em `VITE_*`.

Cliente e tipos: `src/services/apiClient.ts` e `src/services/towService.ts`. Tipos do fluxo demo continuam separados em `src/types/index.ts`. As operações antigas propostas em `platformService.ts` não são chamadas pelo modo API.

## Verificação

Testes automatizados usam respostas controladas do contrato acima. A verificação remota em 15/11/2026 encontrou HTTP 500 em ambos os GETs, com CORS aceitando a origem local. Consulta e persistência ponta a ponta dependem da correção desse erro no serviço publicado. Consulte [diagnóstico e pendências](integracao-pendente.md).
