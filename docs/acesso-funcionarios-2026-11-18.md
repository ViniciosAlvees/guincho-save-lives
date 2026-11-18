# Acesso de funcionários — 18/11/2026

A tela enviava o PIN ao Java, que não implementava `/funcionarios/sessao`. A autenticação agora usa a API Python pelo proxy `/api/python` do frontend.

O PIN solicitado foi configurado como hash PBKDF2-HMAC-SHA256 com salt aleatório e 600.000 iterações, em Secret de produção do projeto Python. A chave de assinatura também é um Secret separado. Nenhum desses valores foi incluído no Git ou nas variáveis públicas do Vite.

As sessões assinadas duram dez minutos. Sair ou recarregar apaga o token da memória do navegador; um token previamente copiado continua válido até expirar. O [contrato Python](https://github.com/ViniciosAlvees/python-guincho-save-/blob/main/EMPLOYEE_ACCESS.md) documenta a configuração, o rate limiting por instância e os limites de revogação.

## Verificação real

Testes HTTP executados na API `https://python-guincho-save.vercel.app` e pelo proxy `https://gincho-save-lives.vercel.app/api/python`:

| Operação | Resultado |
|---|---|
| Login com o PIN solicitado | HTTP 200, token e expiração válidos |
| Login com PIN incorreto | HTTP 401 |
| Consulta anônima de pedidos | HTTP 401 |
| Token adulterado | HTTP 401 |
| Resposta do login | `Cache-Control: no-store` |
| Saída autenticada | HTTP 204 |
| Consulta autenticada de pedidos | HTTP 502; Java retornou HTTP 500 |

O login está funcional. A consulta dos pedidos depende de corrigir o backend Java/Oracle. O painel mantém a sessão e explica que o acesso foi confirmado, mas o servidor de pedidos está indisponível. Não foi usada uma lista fictícia como substituição.

A ferramenta do navegador informou `The browser access host is unavailable`. A verificação cobre HTTP, autorização e contrato; não comprova interação visual.

## Testes e publicação

- Frontend: 76 testes, lint e build passaram.
- Python: 12 testes HTTP passaram, incluindo expiração, adulteração, configuração ausente, rotação de chave, rate limiting e bloqueio antes da consulta ao Java.
- Suíte existente de regras do Python: todos os cenários passaram.
- Estimativa pelo site publicado: seis cenários HTTP 200 com os valores esperados e veículo inválido HTTP 422.
- Ambiente: produção, equipe `alveesdev`.
- Python: commit `1f49b84`, deploy `dpl_2Gta3oBu9CJAWVDoNxW3t1nqKvhC`, **READY**, FastAPI; aproximadamente 17 segundos de build/publicação.
- Frontend inicial: commit `0009f8e`, deploy `dpl_2T78Wz3YeQEbE99TRktMctiyR8Jo`, **READY**, Vite; aproximadamente 29 segundos de build/publicação.
- A mensagem específica sobre o Java foi acrescentada em uma publicação posterior do frontend.
- Logs error/fatal dos dois deploys iniciais: nenhum registro encontrado na janela de 15 minutos consultada. Isso não elimina o erro HTTP 500 retornado pelo Java, comprovado acima.
- Nenhum drain configurado na equipe; não foi instalado monitoramento contínuo.

A correção Java de `support/backend-security` continua independente e é necessária para proteger os endpoints diretos daquele servidor. A autenticação Python não modifica as permissões da URL pública do Java.
