# GUINCHO SAVE LIVES

**Tecnologia que conecta. Agilidade que faz a diferença.**

Front-End da Global Solution 2026/2 da FIAP (CitizenTech), com busca, cadastro de guincheiros e solicitações integrados à API Java da equipe e estimativa de preço integrada à API Python. O modo demonstração local continua disponível como opção. **Não é um serviço real de emergência, transporte ou pagamento.**

## Tecnologias

React, Vite, TypeScript, Tailwind CSS, React Router, Leaflet e OpenStreetMap. Comunicação HTTP pela Fetch API. Os backends Java e Python estão em repositórios separados.

## Executar

Requisitos: Node.js 20.19+ ou 22.12+ e npm.

```bash
npm install
npm run dev
```

O modo padrão é `api`, apontando para `https://guincho-save-lives-backend.onrender.com`, inclusive sem `.env`. Para personalizar as variáveis, copie `.env.example` para `.env.local` (PowerShell: `Copy-Item .env.example .env.local`) e reinicie o Vite. Para usar a demonstração local, altere `VITE_APP_MODE=demo` em `.env.local`. Abra o endereço exibido pelo Vite. O build de produção já tem as variáveis públicas em `.env.production`; variáveis do provedor de hospedagem têm precedência.

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```

Para verificar os GETs Java, status Python e uma estimativa sem gravar dados: `npm run check:api`. O comando informa HTTP, contrato e CORS, sem exibir nomes ou endereços. Ele não substitui o teste de escrita nem a demonstração no navegador. Para verificar o proxy de um frontend iniciado/publicado, configure `FRONTEND_BASE_URL` com sua URL.

## API Python: estimativa de preço

**Publicação em 18/11/2026:** integração Python publicada em produção na Vercel, com proxy retornando JSON. Os seis cenários de estimativa (três veículos, diurno/noturno) e a rejeição de veículo inválido passaram pela URL pública. Consulte o [registro do deploy e das verificações](docs/deploy-python-vercel-2026-11-18.md). O [relatório anterior de APIs](docs/verificacao-apis-2026-11-18.md) preserva o diagnóstico Java/Oracle, fora do escopo desta publicação.

**Migração do próprio Python para a Vercel:** a API agora está em `https://python-guincho-save.vercel.app`, com entrypoint e dependências corrigidos no repositório Python. O proxy do frontend foi atualizado para essa hospedagem. Detalhes e evidências estão no [registro da API Python na Vercel](docs/api-python-vercel-2026-11-18.md).

A rota `/estimar-guincho` consulta a [API Python na Vercel](https://python-guincho-save.vercel.app) com preço inicial, distância prevista, veículo e opção noturna. Pode ser aberta pelo menu Acessos, pela busca/perfil de um profissional e pelo formulário de solicitação. O cálculo é ilustrativo e não confirma contratação. A distância é informada pelo usuário.

`VITE_PYTHON_API_BASE_URL=/api/python` está nos arquivos de ambiente públicos, é o padrão do cliente e foi configurada na Vercel. O Vite e o `vercel.json` encaminham essa rota ao Python. Isso permite o acesso pela mesma origem do frontend, sem depender do CORS direto da Render Python. A tela e o rewrite já estão publicados. O Java continua responsável pelas consultas/cadastros atuais.

**Verificação em 18/11/2026:** a estimativa pública da Vercel retornou HTTP 200, `application/json` e R$ 225 para base de R$ 180, 10 km, carro e sem adicional noturno. Passaram 73 testes, lint e build. Execute `npm run check:python` para conferir o HTML/bundle e as estimativas pelo proxy público; para outra instância, configure `FRONTEND_BASE_URL`. A renderização no navegador não foi confirmada porque o acesso pela ferramenta ficou bloqueado. Veja o [contrato Python](docs/contrato-api-python.md).

## CitizenTech, ODS e validação

O projeto foi pensado para motoristas e famílias que precisam localizar assistência veicular e para guincheiros autônomos e pequenos prestadores que buscam visibilidade. A hipótese é que reunir região, tipo de serviço, preço inicial e dados do pedido reduza a dificuldade de procurar ajuda. Essa hipótese ainda precisa de pesquisa e testes com usuários.

O ecossistema proposto inclui cidadãos, prestadores e equipe mantenedora. Oficinas e organizações locais são possíveis participantes de um piloto futuro; nenhuma parceria externa está confirmada. A página `/sobre` apresenta o plano e os limites do protótipo.

- **ODS 9, meta 9.3:** contribuição proposta à integração de pequenos negócios ao mercado por meio da descoberta de prestadores locais. O projeto não oferece crédito e não comprova mudança nos indicadores oficiais. [Fonte: ONU — ODS 9](https://sdgs.un.org/goals/goal9).
- **ODS 11, meta 11.2:** relação indireta com mobilidade e segurança viária, ao organizar o acesso à assistência após uma pane. Não há resultado comprovado sobre acidentes, transporte público ou sustentabilidade. [Fonte: ONU — ODS 11](https://sdgs.un.org/goals/goal11).

| O que avaliar | Indicador proposto | Método |
|---|---|---|
| Facilidade da busca | Tempo mediano até localizar um perfil adequado | Comparar tarefa fictícia na plataforma com o método habitual do participante |
| Clareza do formulário | Tarefas concluídas sem ajuda / tarefas iniciadas; erros por tarefa | Observação de usabilidade com consentimento |
| Visibilidade de prestadores | Participantes por região e proporção de perfis encontrados nas tarefas | Piloto futuro com adesão voluntária |
| Acesso por dispositivo | Conclusão da mesma tarefa em celular, tablet, desktop e por teclado | Roteiro de acessibilidade e usabilidade |

Nenhum desses resultados foi coletado. Primeiro será estabelecida uma linha de base; depois, as barreiras serão corrigidas e o piloto poderá ser ampliado. Os registros de avaliação devem ser agregados, com dados fictícios, sem guardar documentos, endereços ou senhas de participantes.

## Funcionalidades do modo demonstração

- Home cinematográfica com guincho ilustrado, estrada e rota animadas, parallax sutil, opção de pular e respeito a `prefers-reduced-motion`.
- Busca por região, distância aproximada em linha reta, disponibilidade, veículo, preço e avaliação; mapa interativo com marcadores fictícios. Geolocalização somente após ação do usuário.
- Cadastro e login demonstrativos de clientes e guincheiros, com CPF validado e mascarado, senha apenas em memória durante o formulário e sessão local em memória (perdida ao recarregar). A senha do login demo não é verificada: **não há autenticação real**.
- Cadastro profissional em quatro etapas, pré-visualização temporária de JPG/PNG/PDF (até 5 MB) e quatro documentos fictícios para concluir o fluxo. Arquivos reais não são enviados nem persistidos. Aprovação demonstrativa por funcionário, com status e bloqueios de disponibilidade/chamados.
- Painel de funcionários com acesso demonstrativo separado, indicadores, análise documental ilustrativa, histórico e decisões confirmadas em modal. O PIN real depende do backend; nenhuma credencial fixa está no navegador.
- Solicitação em cinco etapas; propostas, contraproposta, aceitação/recusa, chat local, acompanhamento e histórico.
- Painel do guincheiro com região, disponibilidade e avaliações refletidas na busca. Apenas perfis aprovados e disponíveis podem ser contratados; clientes precisam de conta demo ativa e sessão para solicitar ou negociar.
- Avaliações de 1 a 5 estrelas vinculadas a atendimento concluído, uma por chamado; média e distribuição calculadas dos registros.
- Formulários com validação e feedback. Páginas institucionais e FAQ.

Os perfis iniciais, coordenadas, avaliações e preços são **fictícios/ilustrativos**. O cadastro profissional usa coordenadas ilustrativas até existir geocodificação/integração real. O armazenamento local do navegador pode ser limpo pelo usuário.

## Identidade visual e créditos

O redesign usa CSS/Tailwind e componentes React próprios, sem template. A ilustração transparente em `src/assets/hero-tow-truck-blue.png` foi editada com OpenAI ImageGen a partir de `src/assets/hero-tow-truck.png`; não é fotografia nem representa veículo da operação. Prompt final da edição: “Replace every fluorescent lime-green trim accent on the tow truck with electric blue and icy cyan. Keep the original truck, proportions, pose, camera angle, dark graphite paint, wheels, lighting, composition, and genuinely transparent background unchanged. No text, logo, road or background.” Os mapas utilizam dados fictícios sobre tiles do OpenStreetMap, com atribuição visível na interface.

Os efeitos interativos respeitam `prefers-reduced-motion`, ponteiro por toque e foco visível. O menu e as funções demonstrativas permanecem disponíveis sem animação.

## Estrutura

- `src/components`: layout, mapa, animação e componentes reutilizáveis.
- `src/pages`: páginas e fluxos da SPA.
- `src/contexts`: estado do modo demonstração.
- `src/mocks`: dados fictícios identificados.
- `src/services`: contrato comum e providers `demo` (local) e `api` (Fetch).
- `src/types`: contratos TypeScript.
- `src/utils`: formatação e distância.
- `docs`: contrato Java, auditoria, evidências, pendências e roteiro.
- `scripts`: diagnóstico GET da API e geração do ZIP de entrega.

## Equipe e entrega

A página `/integrantes`, disponível no menu e no rodapé, apresenta os cinco integrantes com foto, RM, turma, LinkedIn e GitHub. Os dados e as fotos foram obtidos do [repositório indicado pela equipe](https://github.com/alvesdemacedoenzo-beep/challenge-front-end-fiap/tree/ab68687687319ec60cab98737dc10b34fca58f44), em `src/data/site.ts` e `src/assets/team/`. As fotos estão incluídas localmente em `src/assets/team/` e os perfis em `src/data/team.ts`.

| Integrante | RM | Turma |
|---|---|---|
| Raphael Ferreira Tavares | 569767 | 1TDSPY |
| Bryan Germano | 569716 | 1TDSPY |
| Enzo Macedo | 569427 | 1TDSPY |
| Victor Hugo Velasco Guzman | 573173 | 1TDSPY |
| Vinicios Alves | 573002 | 1TDSPY |

Funções no projeto: **pendentes de confirmação pela equipe**. Repositório GitHub: [guincho-save-lives](https://github.com/ViniciosAlvees/guincho-save-lives) (público, conferido em 15/11/2026). Deploy Vercel: [aplicação publicada](https://gincho-save-lives.vercel.app/). API Java remota: [Render](https://guincho-save-lives-backend.onrender.com). Vídeo YouTube (até três minutos): **ainda não produzido, conforme informado pela equipe**. Contato público do projeto: [GitHub Issues](https://github.com/ViniciosAlvees/guincho-save-lives/issues). Não publique dados pessoais nesse canal.

A FIAP exige **mínimo de 15 commits no total e 5 por integrante**. Com os cinco integrantes listados, cumprir cinco por pessoa resulta em pelo menos **25 commits**. Cada pessoa deve realizar seus próprios commits; não falsifique autoria. O ZIP final (até 50 MB, sem `node_modules`) deve incluir `identificacao.txt` e ser entregue no Portal do Aluno até **19/11/2026 às 23h55**, conforme a especificação fornecida. Confira [a revisão dos requisitos e penalidades](docs/revisao-frontend.md) antes de enviar.

## Preparar o ZIP

```bash
npm run lint
npm run test
npm run build
npm run package:delivery
```

O pacote é gerado em `output/guincho-save-lives-entrega.zip`, com manifesto de arquivos, tamanho e SHA256 em `output/manifesto-entrega.json`. O empacotador inclui fontes, assets, documentação, scripts, lockfile, identificação e configurações necessárias. Exclui dependências instaladas, `.git`, builds, caches, arquivos temporários e `.env` locais; inclui somente `.env.example` e `.env.production`, que contêm configuração pública. O ZIP é reaberto e comparado byte a byte por SHA256 e deve ficar abaixo de 50.000.000 bytes.

Extraia o pacote em uma pasta nova, execute `npm ci` e `npm run build` e confira o projeto antes de anexá-lo no Portal. Gere novamente o ZIP depois de acrescentar o vídeo, finalizar os ajustes ou integrar os commits dos colegas. Não compacte a pasta inteira manualmente. O pacote não constitui uma submissão nem comprova os requisitos que ainda dependem de API, vídeo, commits e apresentação.

## API Java e Vercel

Backend: [repositório Java](https://github.com/velascoguzmanvictorhugo-ui/guincho-save-lives-backend) e [serviço na Render](https://guincho-save-lives-backend.onrender.com). No modo API, `/buscar-guincho` consulta e filtra os profissionais, `/guincheiros/:id` apresenta o perfil, `/cadastro/guincheiro` registra um profissional por POST e `/solicitar-guincho` envia nome, origem, destino, veículo, problema e CEP opcional. A API atual não tem autenticação, documentos, negociação, chat ou status de atendimento; essas áreas explicam a limitação e oferecem os fluxos disponíveis. As chamadas validam o JSON e não usam mocks como fallback. O CORS Java exige chamadas sem cookies, já configuradas no cliente.

**Verificação em 15/11/2026:** a Render respondeu HTTP 500 tanto em `GET /guincheiros` quanto em `GET /solicitacoes`. O frontend está configurado e seus testes de contrato usam respostas controladas, mas a consulta e a persistência ponta a ponta ainda dependem da correção do erro interno do backend. Os POSTs atuais também não devolvem o ID gerado no Oracle; a interface não inventa um protocolo ou status. Veja o [contrato verificado](docs/contrato-api.md) e o [diagnóstico com próximos passos](docs/integracao-pendente.md).

As alterações deste repositório se limitam ao frontend e à integração HTTP. A correção do Java, do banco e da configuração da Render cabe ao integrante responsável pelo backend. Depois que o serviço estiver corrigido, executar `npm run check:api` e validar a consulta e uma escrita real pelo frontend.

O arquivo `vercel.json` configura fallback de rotas SPA para acesso direto. Em 15/11/2026, a produção da Vercel estava `READY` no commit `11984ee` da branch `main`; as páginas foram acessadas publicamente e renderizadas em Chrome nas três resoluções oficiais. O erro HTTP 500 da API ainda impede a consulta e a persistência ponta a ponta. A auditoria atual está em [revisão de requisitos e penalidades](docs/revisao-frontend.md).

## Limitações e declaração de IA

Sem autenticação/autorização real, armazenamento seguro de documentos, cobrança, roteamento rodoviário, ETA real ou mensagens entre dispositivos. No modo API, os formulários enviam dados ao servidor Java da equipe; use apenas dados fictícios para testar o projeto acadêmico. O painel administrativo demo não protege dados reais. Não use para atendimentos reais. Este Front-End foi desenvolvido com auxílio de IA (OpenAI Codex); a equipe deve revisar código, validações, conteúdo e entrega antes da submissão. A implementação não substitui a apresentação presencial ou o vídeo.
