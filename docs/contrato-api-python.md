# Integração com a API Python

**Atualização de publicação em 18/11/2026:** integração publicada em produção na Vercel, com status READY e os sete checks HTTP pelo proxy aprovados. O novo comando `npm run check:python` verifica a publicação. Veja o [registro do deploy](deploy-python-vercel-2026-11-18.md); os diagnósticos iniciais abaixo são históricos.

Serviço atual: `https://python-guincho-save.vercel.app`. Contrato conferido em 18/11/2026 no [`api.py` do repositório Python](https://github.com/ViniciosAlvees/python-guincho-save-/blob/main/api.py). A hospedagem anterior na Render permanece citada nas evidências históricas abaixo. A configuração `pyproject.toml` da API define `api:app`, Python 3.12 e as dependências FastAPI, Uvicorn e HTTPX.

O frontend utiliza Java para buscar/cadastrar guincheiros e registrar solicitações, e Python para estimar preços. Não duplica cadastros entre servidores. O Python também oferece proxy para as rotas Java, mas isso continua dependendo do Java e do Oracle; não é um armazenamento alternativo.

## Fluxo da estimativa

`/estimar-guincho` → `pythonService.estimatePrice` → `GET /api/python/estimativa` → proxy do Vite/Vercel → API Python na Vercel → validação JSON → valor em reais na interface.

A tela pode ser aberta pelo menu Acessos, pelos perfis/resultados de busca (com o preço inicial do profissional) e pelo formulário de solicitação em nova aba, preservando o pedido em edição. A calculadora também funciona sem profissionais cadastrados. Informa preço inicial, distância prevista, veículo e opção de atendimento noturno. Não calcula distância pelo mapa nem confirma contratação. O valor é calculado no Python; não há fórmula local ou mock de fallback. Alterar os campos remove o resultado anterior. A consulta pode ser repetida após erro e é cancelada ao sair da página.

### GET `/estimativa`

| Parâmetro | Tipo e limites |
|---|---|
| `preco_base` | Número finito entre 20 e 10.000 |
| `km` | Número finito maior que zero e até 1.000 |
| `tipo` | `carro`, `moto` ou `utilitario` |
| `noturno` | `true` ou `false` |

Exemplo: `/estimativa?preco_base=180&km=10&tipo=carro&noturno=false`.

```json
{ "valor_estimado": 225.0, "moeda": "BRL" }
```

O cliente valida um valor numérico finito não negativo e moeda BRL antes de exibir a resposta. Caminhão não faz parte deste endpoint. Os limites também são validados antes da requisição. Falhas HTTP, de rede e de JSON são exibidas sem inventar um preço.

## Configuração, proxy e CORS

```dotenv
VITE_APP_MODE=api
VITE_API_BASE_URL=https://guincho-save-lives-backend.onrender.com
VITE_PYTHON_API_BASE_URL=/api/python
```

`VITE_API_BASE_URL` continua sendo a base das consultas/cadastros Java. `VITE_PYTHON_API_BASE_URL` configura somente o serviço de estimativa e usa `/api/python` como padrão mesmo sem `.env`.

O `vercel.json` encaminha `/api/python/:path*` à API Python na Vercel antes do fallback da SPA. O `vite.config.ts` faz o mesmo no desenvolvimento, com timeout de 90 segundos; o preview herda o proxy do Vite. Assim, o navegador consulta a mesma origem do frontend. O Python também permite a origem pública do frontend em `CORS_ORIGINS`. As chamadas continuam sem cookies. Referências: [rewrites externos da Vercel](https://vercel.com/docs/routing/rewrites) e [proxy do preview Vite](https://vite.dev/config/preview-options#preview-proxy).

Alterações futuras nessa configuração exigem novo deploy do frontend. Se houver variável de mesmo nome no provedor, alinhe `VITE_PYTHON_API_BASE_URL=/api/python` antes do build. Em outra hospedagem, configure um proxy equivalente ou use a URL absoluta do Python com CORS permitindo a origem do site. Variáveis `VITE_*` são públicas; não colocar segredos nelas.

Opcionalmente, `VITE_API_BASE_URL=/api/python` também encaminha as operações existentes de guincheiros/solicitações pelo proxy Python, desde que `JAVA_API_URL` esteja corretamente configurada no serviço Python. Não é necessário para usar a calculadora. Não altere a configuração padrão para tentar contornar um erro interno do Java: o Python apenas o repassa como falha de upstream.

## Verificação inicial de 18/11/2026

Uma [revisão posterior com testes reais de escrita](verificacao-apis-2026-11-18.md) confirmou a persistência de um guincheiro, identificou o erro Oracle de solicitações e verificou que a Vercel ainda serve a versão sem a integração Python. Os itens abaixo registram a verificação inicial anterior a esses POSTs.

- Python `GET /`: HTTP 200, contrato de status válido.
- Python `GET /estimativa` com base 180, 10 km, carro e sem adicional noturno: HTTP 200, valor 225 e moeda BRL.
- Requisição com `Origin: https://gincho-save-lives.vercel.app`: sem `Access-Control-Allow-Origin` autorizando essa origem. A chamada direta do navegador seria bloqueada; o proxy resolve esse acesso sem mudar o backend.
- Frontend local `GET http://localhost:5173/api/python/estimativa?preco_base=180&km=10&tipo=carro&noturno=false`: HTTP 200, JSON real `{"valor_estimado":225.0,"moeda":"BRL"}`. Confirma o caminho HTTP frontend → proxy → Python.
- Java `GET /guincheiros`: HTTP 200, lista vazia, CORS aceitando Vercel. `GET /solicitacoes`: HTTP 500, CORS aceitando Vercel. O erro interno dessa rota permanece no backend.
- 47 testes automatizados aprovados, incluindo 18 de integração Python com respostas controladas; ESLint e build TypeScript/Vite aprovados.
- A ferramenta de controle do Chrome interrompeu a verificação visual por não conseguir identificar a URL atual com segurança. O resultado renderizado no navegador e o rewrite da Vercel após publicação não foram verificados.

Nenhum POST foi enviado durante essas verificações. A consulta e a estimativa não comprovam persistência de pedidos.

`npm run check:api` verifica as listas Java, o status Python e o exemplo de estimativa, sem expor registros pessoais. Espera que a lista pública de solicitações esteja protegida com 401/403 e retorna saída 1 se algum check falhar. Sem `FRONTEND_BASE_URL`, verifica o Python diretamente na Vercel; o CORS direto é informativo porque o frontend usa proxy. Para verificar o proxy de um frontend já iniciado/publicado:

```powershell
$env:FRONTEND_BASE_URL = 'http://localhost:5173'
npm run check:api
Remove-Item Env:FRONTEND_BASE_URL
```

Para apontar esse diagnóstico a outro Java/Python, exporte as respectivas variáveis no terminal. O script Node não carrega `.env.local` automaticamente. Se optar por `VITE_API_BASE_URL=/api/python`, use uma URL absoluta equivalente no diagnóstico CLI, que não tem origem de navegador.
