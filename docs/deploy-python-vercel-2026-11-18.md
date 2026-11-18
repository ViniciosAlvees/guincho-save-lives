# Integração Python publicada na Vercel

**Atualização posterior:** a própria API Python também foi migrada para a Vercel e o proxy do frontend foi atualizado. Veja o [registro da migração](api-python-vercel-2026-11-18.md). O texto abaixo preserva a primeira publicação, que utilizava Python na Render.

Publicação e verificação em **18/11/2026, aproximadamente 11h12–11h15, America/Sao_Paulo**.

- Projeto: `gincho-save-lives`, ID `prj_MyUAyCmKfY9udGwE0Vf0mSZgLUqu`.
- Equipe: `team_ABvNbluzBwUAUeLfHDspIvvG`.
- Ambiente: produção, status **READY**.
- Site: https://gincho-save-lives.vercel.app/estimar-guincho
- Deployment: `dpl_D7A9bUUowxH6qnfGKL4DxVMrt3qN`.
- URL imutável: https://gincho-save-lives-ljgoky8hi-alveesdev.vercel.app
- Framework: Vite; build remoto concluído em aproximadamente dois minutos.
- Origem: snapshot dos arquivos locais, incluindo alterações ainda não commitadas, sobre a base Git `f676088`. Não houve commit ou push durante essa publicação. Esse SHA isolado não reproduz o snapshot publicado. Após a migração do Python, as alterações do frontend foram registradas no commit `b06910b`, na branch `Vinicios`.

## Configuração publicada

`/api/python/:path*` é encaminhado para `https://python-guincho-save.onrender.com/:path*` antes do fallback da SPA. O Python continua hospedado na Render; a Vercel serve o frontend e o proxy.

Variáveis públicas configuradas nos ambientes production, preview e development:

```dotenv
VITE_APP_MODE=api
VITE_API_BASE_URL=https://guincho-save-lives-backend.onrender.com
VITE_PYTHON_API_BASE_URL=/api/python
```

## Verificação pela URL pública

Todas as chamadas abaixo usaram `/api/python/estimativa` no domínio público da Vercel, com preço base de 180 e distância de 10 km. As sete responderam `application/json`.

| Veículo | Noturno | HTTP | Valor BRL |
|---|---|---|---|
| carro | false | 200 | 225,00 |
| carro | true | 200 | 270,00 |
| moto | false | 200 | 191,25 |
| moto | true | 200 | 229,50 |
| utilitario | false | 200 | 303,75 |
| utilitario | true | 200 | 364,50 |
| caminhao (inválido) | false | 422 | Erros de validação, conforme esperado |

O comando `npm run check:python` repete a verificação sem POSTs nem dados pessoais. Também confere o HTML da rota e a presença da integração no bundle publicado. Para outra instância, exportar `FRONTEND_BASE_URL` antes de executar.

## Validação e limites

- 73 testes automatizados aprovados; ESLint e build TypeScript/Vite aprovados.
- Logs Vercel filtrados por error/fatal nos 15 minutos posteriores: nenhum registro encontrado. Como o backend é externo, isso não verifica os logs internos da Render.
- Nenhum drain de logs configurado; não há evidência de monitoramento contínuo nesta verificação.
- A ferramenta de navegador informou indisponibilidade do host e bloqueio de acesso ao Chrome. HTML, bundle e HTTP são verificados separadamente da renderização/interação visual, que não foi confirmada.
- A publicação não corrige nem retesta gravação Java/Oracle. O diagnóstico anterior está em `verificacao-apis-2026-11-18.md`.
