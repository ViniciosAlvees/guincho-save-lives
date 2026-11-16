# GUINCHO SAVE LIVES

**Tecnologia que conecta. Agilidade que faz a diferença.**

Front-End da Global Solution 2026/2 da FIAP (CitizenTech), com busca, cadastro de guincheiros e solicitações integrados à API Java da equipe. O modo demonstração local continua disponível como opção. **Não é um serviço real de emergência, transporte ou pagamento.**

## Tecnologias

React, Vite, TypeScript, Tailwind CSS, React Router, Leaflet e OpenStreetMap. Comunicação HTTP pela Fetch API. O backend Java está em repositório separado.

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
- `docs`: contrato proposto, matriz, pendências e roteiro.

## Equipe e entrega

A página `/integrantes`, disponível no menu e no rodapé, apresenta os cinco integrantes com foto, RM, turma, LinkedIn e GitHub. Os dados e as fotos foram obtidos do [repositório indicado pela equipe](https://github.com/alvesdemacedoenzo-beep/challenge-front-end-fiap/tree/ab68687687319ec60cab98737dc10b34fca58f44), em `src/data/site.ts` e `src/assets/team/`. As fotos estão incluídas localmente em `src/assets/team/` e os perfis em `src/data/team.ts`.

| Integrante | RM | Turma |
|---|---|---|
| Raphael Ferreira Tavares | 569767 | 1TDSPY |
| Bryan Germano | 569716 | 1TDSPY |
| Enzo Macedo | 569427 | 1TDSPY |
| Victor Hugo Velasco Guzman | 573173 | 1TDSPY |
| Vinicios Alves | 573002 | 1TDSPY |

Funções no projeto: **pendentes de confirmação pela equipe**. Repositório GitHub: [gincho-save-lives](https://github.com/ViniciosAlvees/gincho-save-lives) (URL conferida do remote local; visibilidade pública ainda precisa ser confirmada). Deploy Vercel: **link pendente**. API Java remota: [Render](https://guincho-save-lives-backend.onrender.com). Vídeo YouTube (até três minutos): **link pendente**. Canal de contato oficial: **pendente**.

A FIAP exige **mínimo de 15 commits no total e 5 por integrante**. Com os cinco integrantes listados, cumprir cinco por pessoa resulta em pelo menos **25 commits**. Cada pessoa deve realizar seus próprios commits; não falsifique autoria. O ZIP final (até 50 MB, sem `node_modules`) deve incluir `identificacao.txt` e ser entregue no Portal do Aluno até **19/11/2026 às 23h55**, conforme a especificação fornecida. Confira [a revisão dos requisitos e penalidades](docs/revisao-frontend.md) antes de enviar.

## API Java e Vercel

Backend: [repositório Java](https://github.com/velascoguzmanvictorhugo-ui/guincho-save-lives-backend) e [serviço na Render](https://guincho-save-lives-backend.onrender.com). No modo API, `/buscar-guincho` consulta e filtra os profissionais, `/guincheiros/:id` apresenta o perfil, `/cadastro/guincheiro` registra um profissional por POST e `/solicitar-guincho` envia nome, origem, destino, veículo, problema e CEP opcional. A API atual não tem autenticação, documentos, negociação, chat ou status de atendimento; essas áreas explicam a limitação e oferecem os fluxos disponíveis. As chamadas validam o JSON e não usam mocks como fallback. O CORS Java exige chamadas sem cookies, já configuradas no cliente.

**Verificação em 15/11/2026:** a Render respondeu HTTP 500 tanto em `GET /guincheiros` quanto em `GET /solicitacoes`. O frontend está configurado e seus testes de contrato usam respostas controladas, mas a consulta e a persistência ponta a ponta ainda dependem da correção do erro interno do backend. Os POSTs atuais também não devolvem o ID gerado no Oracle; a interface não inventa um protocolo ou status. Veja o [contrato verificado](docs/contrato-api.md) e o [diagnóstico com próximos passos](docs/integracao-pendente.md).

O arquivo `vercel.json` configura fallback de rotas SPA para acesso direto. O deploy ainda não foi realizado.

## Limitações e declaração de IA

Sem autenticação/autorização real, armazenamento seguro de documentos, cobrança, roteamento rodoviário, ETA real ou mensagens entre dispositivos. No modo API, os formulários enviam dados ao servidor Java da equipe; use apenas dados fictícios para testar o projeto acadêmico. O painel administrativo demo não protege dados reais. Não use para atendimentos reais. Este Front-End foi desenvolvido com auxílio de IA (OpenAI Codex); a equipe deve revisar código, validações, conteúdo e entrega antes da submissão. A implementação não substitui a apresentação presencial ou o vídeo.
