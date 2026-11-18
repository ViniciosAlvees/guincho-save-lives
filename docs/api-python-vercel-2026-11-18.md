# API Python hospedada na Vercel

Em 18/11/2026, o projeto Python `python-guincho-save-` foi publicado com sucesso na Vercel. Este registro complementa a primeira publicação do frontend, que ainda utilizava Python na Render.

## Correção do deploy Python

O erro `FASTAPI_ENTRYPOINT_NOT_FOUND` acontecia porque a detecção automática encontrava `main.py`, um programa de terminal, enquanto o FastAPI estava em `api.py` na variável `app`.

No repositório `ViniciosAlvees/python-guincho-save-`, foi criado `pyproject.toml` com:

```toml
[project]
name = "guincho-save-lives-api"
version = "1.1.0"
requires-python = ">=3.12,<3.13"
dependencies = [
    "fastapi==0.141.1",
    "uvicorn==0.52.1",
    "httpx==0.28.1",
]

[tool.vercel]
entrypoint = "api:app"
```

Declarar apenas o entrypoint permitiu o build, mas a execução falhou com `ModuleNotFoundError: No module named 'httpx'`, pois a Vercel passou a priorizar o pyproject para instalar dependências. A declaração completa acima corrigiu a inicialização. As versões foram alinhadas ao `requirements.txt` existente.

- Commits enviados ao `main` Python: `8c61d37` e `edb665e`.
- Deploy Python final: `dpl_2UuXPJDMA9VNAP7fD14JXDDZWBHa`, **READY**, produção, FastAPI/Python 3.12.
- API pública: https://python-guincho-save.vercel.app
- OpenAPI: https://python-guincho-save.vercel.app/openapi.json
- Documentação interativa: https://python-guincho-save.vercel.app/docs
- Build remoto concluído em cerca de cinco segundos; publicação total em cerca de dezesseis segundos.

Variáveis públicas de configuração definidas no projeto Python: `JAVA_API_URL=https://guincho-save-lives-backend.onrender.com` e `CORS_ORIGINS` incluindo a origem `https://gincho-save-lives.vercel.app` e as origens locais de desenvolvimento.

## Verificações

- `GET /`: HTTP 200, JSON online, `java_configurado: true`.
- `GET /openapi.json`: HTTP 200, título e rota de estimativa conferidos.
- Seis estimativas: HTTP 200, BRL e valores esperados para carro, moto e utilitário, diurno e noturno.
- Veículo inválido: HTTP 422 com detalhes de validação.
- Preflight da estimativa com origem do frontend: HTTP 200 e `Access-Control-Allow-Origin` correto.
- Suíte existente `testes.py`: todos os cenários passaram.
- TOML validado com `tomllib`, entrypoint conferido e versões comparadas ao requirements.

Nenhum POST, PUT ou DELETE foi necessário. As consultas acima não comprovam gravação no Java/Oracle. Os erros de inicialização citados pertencem ao deploy intermediário e foram resolvidos no deploy final.

## Frontend

O proxy `/api/python` do `vercel.json` e do Vite foi alterado para `https://python-guincho-save.vercel.app`. O frontend continua usando uma URL relativa na mesma origem. O Java permanece na Render.

O frontend passou novamente nos 73 testes automatizados, lint e build. O deploy `dpl_819zX3bj2dANdJK6EBfNoANHzn9k` foi criado com os arquivos locais testados e ficou **READY** em produção, em aproximadamente dois minutos. O arquivo `vercel.json` recuperado da fonte desse deploy confirma o destino `https://python-guincho-save.vercel.app/:path*`.

Após a publicação, `npm run check:python` passou pelo domínio público `https://gincho-save-lives.vercel.app`: HTML da calculadora e bundle HTTP 200, integração presente no JavaScript, seis estimativas HTTP 200 com valores esperados e veículo inválido HTTP 422. Esse teste verifica HTTP e os arquivos publicados; não confirma interação visual no navegador.

Os filtros de logs error/fatal dos dois deploys finais não encontraram registros na janela de 15 minutos consultada. O projeto Python não possui drains de logs configurados; não foi acrescentado monitoramento contínuo.

As alterações do frontend foram registradas posteriormente no commit `b06910b`, na branch `Vinicios`, para sincronização com o GitHub. Os commits `8c61d37` e `edb665e` pertencem ao repositório Python e já foram enviados ao `main` daquele projeto. O diagnóstico Java/Oracle e a persistência de pedidos não foram alterados nem retestados nesta migração.
