# GUINCHO SAVE LIVES

**Tecnologia que conecta. Agilidade que faz a diferença.**

Front-End da Global Solution 2026/2 da FIAP (CitizenTech), com busca, cadastro de guincheiros e solicitações integrados à API Java da equipe e estimativa de preço integrada à API Python. O modo demonstração local continua disponível como opção. **Não é um serviço real de emergência, transporte ou pagamento.**

## Tecnologias

React, Vite, TypeScript, Tailwind CSS, React Router, Leaflet e OpenStreetMap. Comunicação HTTP pela Fetch API. Os backends Java e Python estão em repositórios separados.

## Executar

Requisitos: Node.js 22.12+, 24.x ou 26.x e npm. A suíte Vitest 5 não oferece suporte a Node 20.

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

Para verificar os GETs Java, status Python e uma estimativa sem gravar dados: `npm run check:api`. O comando informa HTTP, contrato e CORS, sem exibir nomes ou endereços; espera 401/403 na listagem anônima de solicitações e falha se ela estiver pública. Ele não substitui o teste de escrita nem a demonstração no navegador. Para verificar o proxy de um frontend iniciado/publicado, configure `FRONTEND_BASE_URL` com sua URL.

## API Python: estimativa de preço

**Publicação em 18/11/2026:** integração Python publicada em produção na Vercel, com proxy retornando JSON. Os seis cenários de estimativa (três veículos, diurno/noturno) e a rejeição de veículo inválido passaram pela URL pública. Consulte o [registro do deploy e das verificações](docs/deploy-python-vercel-2026-11-18.md). O [relatório anterior de APIs](docs/verificacao-apis-2026-11-18.md) preserva o diagnóstico Java/Oracle, fora do escopo desta publicação.

**Migração do próprio Python para a Vercel:** a API agora está em `https://python-guincho-save.vercel.app`, com entrypoint e dependências corrigidos no repositório Python. O proxy do frontend foi atualizado para essa hospedagem. Detalhes e evidências estão no [registro da API Python na Vercel](docs/api-python-vercel-2026-11-18.md).

A rota `/estimar-guincho` consulta a [API Python na Vercel](https://python-guincho-save.vercel.app) com preço inicial, distância prevista, veículo e opção noturna. Pode ser aberta pelo menu Acessos, pela busca/perfil de um profissional e pelo formulário de solicitação. O cálculo é ilustrativo e não confirma contratação. A distância é informada pelo usuário.

`VITE_PYTHON_API_BASE_URL=/api/python` está nos arquivos de ambiente públicos, é o padrão do cliente e foi configurada na Vercel. O Vite e o `vercel.json` encaminham essa rota ao Python. Isso permite o acesso pela mesma origem do frontend, sem depender do CORS direto da Render Python. A tela e o rewrite já estão publicados. O Java continua responsável pelas consultas/cadastros atuais.

**Verificação em 18/11/2026:** a estimativa pública da Vercel retornou HTTP 200, `application/json` e R$ 225 para base de R$ 180, 10 km, carro e sem adicional noturno. Passaram 73 testes, lint e build. Execute `npm run check:python` para conferir o HTML/bundle e as estimativas pelo proxy público; para outra instância, configure `FRONTEND_BASE_URL`. A renderização no navegador não foi confirmada porque o acesso pela ferramenta ficou bloqueado. Veja o [contrato Python](docs/contrato-api-python.md).

## Menu, Pitch e funcionários

O botão **Menu** reúne páginas institucionais, busca, solicitação, cadastro de guincho, **Pitch** e **Funcionários**, em desktop, tablet e celular. A animação inicial tem pausa e retomada; respeita movimento reduzido por padrão e permite reprodução por escolha explícita.

A página `/pitch` tem espaços para o pitch da solução (até cinco minutos) e a demonstração do frontend (até três minutos). Os links ainda serão enviados pela equipe. Depois de confirmados, preencher `url` em `src/data/pitch.ts` e o link exigido no README. A página não apresenta links fictícios.

O acesso `/funcionarios/acesso` envia o PIN de oito dígitos para `/funcionarios/sessao`. Nenhum PIN padrão está no frontend. O painel exige sessão confirmada pelo servidor; PIN e token não ficam em URL, localStorage ou sessionStorage. **A API publicada ainda não possui essas rotas**. A implementação Java correspondente, compilada e testada localmente, está em [support/backend-security](support/backend-security/README.md) para o responsável aplicar e configurar no Render. Até lá, o acesso permanece fechado. Aprovação de documentos e alteração de status ainda não foram implementadas na API.

Veja [a revisão de segurança e as ações necessárias no servidor](docs/seguranca.md). Não é possível esconder JavaScript enviado ao navegador; a proteção consiste em manter credenciais no servidor e exigir autorização também nos endpoints.

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

- Home cinematográfica com guincho ilustrado, estrada e rota animadas, parallax sutil, pausa/retomada e respeito a `prefers-reduced-motion`.
- Busca por região, distância aproximada em linha reta, disponibilidade, veículo, preço e avaliação; mapa interativo com marcadores fictícios. Geolocalização somente após ação do usuário.
- Cadastro e login demonstrativos de clientes e guincheiros, com CPF validado e mascarado, senha apenas em memória durante o formulário e sessão local em memória (perdida ao recarregar). A senha do login demo não é verificada: **não há autenticação real**.
- Cadastro profissional em quatro etapas, pré-visualização temporária de JPG/PNG/PDF (até 5 MB) e quatro documentos fictícios para concluir o fluxo. Arquivos reais não são enviados nem persistidos. Aprovação demonstrativa por funcionário, com status e bloqueios de disponibilidade/chamados.
- O acesso público de funcionários usa exclusivamente validação pela API. Os componentes antigos de análise documental demonstrativa permanecem no código, sem rota pública que contorne a autenticação.
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
- `scripts`: diagnóstico GET/OPTIONS da API e geração dos ZIPs de entrega e correção do backend.
- `support/backend-security`: arquivos Java de substituição, sem credenciais, para aplicação pelo responsável do backend.

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

O pacote é gerado em `output/guincho-save-lives-entrega.zip`, com manifesto de arquivos, tamanho e SHA256 em `output/manifesto-entrega.json`. O empacotador inclui fontes, assets, documentação, scripts, suporte ao backend, lockfile, identificação e configurações necessárias. Exclui dependências instaladas, `.git`, `target`, builds, caches, chaves privadas e `.env` locais; inclui somente `.env.example` e `.env.production`, com apenas as três configurações públicas autorizadas. O ZIP é reaberto e comparado byte a byte por SHA256 e deve ficar abaixo de 50.000.000 bytes. O comando `npm run package:backend-security` gera separadamente `output/guincho-backend-seguranca.zip`; ele contém somente a correção e não substitui a entrega completa da disciplina Java.

Extraia o pacote em uma pasta nova, execute `npm ci` e `npm run build` e confira o projeto antes de anexá-lo no Portal. Gere novamente o ZIP depois de acrescentar o vídeo, finalizar os ajustes ou integrar os commits dos colegas. Não compacte a pasta inteira manualmente. O pacote não constitui uma submissão nem comprova os requisitos que ainda dependem de API, vídeo, commits e apresentação.

## API Java e Vercel

Backend: [repositório Java](https://github.com/velascoguzmanvictorhugo-ui/guincho-save-lives-backend) e [serviço na Render](https://guincho-save-lives-backend.onrender.com). No modo API, `/buscar-guincho` consulta e filtra os profissionais, `/guincheiros/:id` apresenta o perfil, `/cadastro/guincheiro` registra um profissional por POST e `/solicitar-guincho` envia nome, origem, destino, veículo, problema e CEP opcional. A API atual não tem autenticação, documentos, negociação, chat ou status de atendimento; essas áreas explicam a limitação e oferecem os fluxos disponíveis. As chamadas validam o JSON e não usam mocks como fallback. O CORS Java exige chamadas sem cookies, já configuradas no cliente.

**Verificação em 17/11/2026:** GETs responderam HTTP 200, com CORS de consulta e POST JSON aceitando a Vercel. No navegador, um cadastro de guincheiro e uma solicitação fictícios receberam HTTP 201 e foram encontrados em consultas posteriores com IDs persistidos. Houve também um HTTP 500 intermitente durante a navegação; ele não deve ser tratado como resolvido sem examinar os logs do servidor. Os POSTs atuais continuam sem devolver o ID gerado; a interface informa essa limitação. A listagem anônima de solicitações e a credencial fixa encontrada no código Java são pendências de segurança. Veja o [contrato](docs/contrato-api.md), o [diagnóstico](docs/integracao-pendente.md) e a [revisão de segurança](docs/seguranca.md).

As correções Java foram preparadas em `support/backend-security`, mas não aplicadas remotamente: a conexão disponível não tem permissão de escrita nesse repositório. O responsável precisa substituir a credencial exposta, configurar as variáveis privadas e publicar a correção. Nunca colocar dados do banco ou PIN em `VITE_*`. O build bloqueia variáveis públicas não autorizadas e URLs de API com usuário/senha.

O arquivo `vercel.json` configura o fallback SPA e os cabeçalhos de segurança, incluindo CSP. Em 17/11/2026, a produção estava `READY` no commit `abca0a5` da `main`, vinculada ao repositório correto; foram verificados 30 acessos públicos nas três resoluções oficiais. As novas alterações desta revisão só passam a aparecer no site após publicação. A auditoria atual está em [revisão de requisitos e penalidades](docs/revisao-frontend.md).

## Limitações e declaração de IA

Sem autenticação/autorização real, armazenamento seguro de documentos, cobrança, roteamento rodoviário, ETA real ou mensagens entre dispositivos. No modo API, os formulários enviam dados ao servidor Java da equipe; use apenas dados fictícios para testar o projeto acadêmico. O painel administrativo demo não protege dados reais. Não use para atendimentos reais. Este Front-End foi desenvolvido com auxílio de IA (OpenAI Codex); a equipe deve revisar código, validações, conteúdo e entrega antes da submissão. A implementação não substitui a apresentação presencial ou o vídeo.
