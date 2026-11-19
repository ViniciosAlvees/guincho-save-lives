Guincho Save Lives
Tecnologia que conecta motoristas a serviços de assistência veicular.

O Guincho Save Lives é um projeto desenvolvido para a Global Solution 2026/2 da FIAP, dentro da proposta CitizenTech. A ideia é facilitar a busca por profissionais de guincho e organizar as informações necessárias para solicitar assistência, reunindo localização, tipo de veículo, distância aproximada e estimativa de preço em um só lugar.

O projeto conta com uma aplicação web responsiva, desenvolvida em React, e integrações com serviços em Java e Python. Também possui um modo de demonstração para apresentar as funcionalidades sem depender das APIs externas.
Importante: esta é uma aplicação acadêmica em desenvolvimento. Os valores e os dados de demonstração são ilustrativos. A plataforma não deve ser utilizada para solicitar atendimentos reais de emergência.

Acesse o projeto
- Site: Guincho Save Lives
- Frontend: Repositório no GitHub
- Backend Java: Repositório no GitHub
- API Python: Repositório no GitHub
Como a plataforma funciona
A proposta é que o motorista consiga procurar um guincho de forma mais simples, visualizar os profissionais disponíveis e informar os detalhes do atendimento. Do outro lado, o guincheiro tem um espaço para cadastrar seu perfil e apresentar seus serviços.

No modo de demonstração, é possível navegar pelos fluxos de cadastro, busca, solicitação e acompanhamento. Já no modo API, o frontend utiliza os endpoints disponíveis da equipe para consultar profissionais, cadastrar guincheiros, registrar solicitações e calcular estimativas.
Principais funcionalidades
- Página inicial: apresentação do projeto com elementos visuais e animações relacionadas à assistência veicular.
- Busca de guinchos: filtros por região e características do serviço, com mapa e informações dos profissionais.
- Cadastro de clientes: formulário com dados pessoais e validações.
- Cadastro de guincheiros: informações profissionais e etapas para envio de documentos no fluxo demonstrativo.
- Perfil do profissional: apresentação dos dados e avaliações do guincheiro.
- Solicitação de atendimento: preenchimento de origem, destino, veículo e detalhes do problema.
- Estimativa de preço: cálculo ilustrativo a partir das informações fornecidas, por meio da API Python.
- Acompanhamento e avaliações: histórico, negociação e avaliação do atendimento no modo de demonstração.
- Área de funcionários: acesso restrito para consulta de informações, conforme os recursos disponíveis na API.
- Páginas informativas: apresentação da solução, integrantes, perguntas frequentes e pitches do projeto.
Algumas funcionalidades são apresentadas apenas no modo de demonstração. A autenticação completa, o armazenamento seguro de documentos, o chat entre dispositivos e o processamento de pagamentos não fazem parte da integração atual com a API Java.
Tecnologias utilizadas
Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Leaflet e OpenStreetMap
Integrações
- Java com API REST para os dados de profissionais e solicitações
- Python para estimativa de preço
- Fetch API para comunicação entre frontend e serviços
- Vercel para publicação da aplicação
Executando o projeto
Para rodar a aplicação localmente, é necessário ter Node.js 22.12 ou superior em uma versão compatível com o projeto e o npm instalados.

Clone o repositório:
git clone https://github.com/ViniciosAlvees/guincho-save-lives.git
cd guincho-save-lives
Instale as dependências e inicie o servidor:
npm install
npm run dev
Abra no navegador o endereço informado pelo terminal.
Configuração das APIs
Por padrão, o projeto inicia no modo api, com as configurações públicas necessárias. Para personalizar o ambiente, copie o arquivo .env.example para .env.local:
VITE_APP_MODE=api
VITE_API_BASE_URL=https://guincho-save-lives-backend.onrender.com
VITE_PYTHON_API_BASE_URL=/api/python
Para explorar as funcionalidades sem depender dos serviços externos, altere o modo para:
VITE_APP_MODE=demo
Após mudar o arquivo de ambiente, reinicie o servidor do Vite.
Comandos disponíveis
Comando	Finalidade
npm run dev	Inicia o ambiente de desenvolvimento
npm run build	Gera a versão de produção
npm run preview	Visualiza a versão de produção localmente
npm run typecheck	Verifica os tipos do TypeScript
npm run lint	Analisa o código com ESLint
npm run test	Executa os testes automatizados
npm run check:api	Verifica os endpoints configurados da API Java
npm run check:python	Verifica a integração com a API Python
npm run package:delivery	Prepara o arquivo ZIP de entrega


Integração entre frontend, Java e Python
O frontend reúne as telas e os fluxos de navegação. A API Java é responsável pelas operações disponibilizadas para consulta, cadastro e solicitações. A API Python fornece a estimativa de preço do serviço.

Na aplicação publicada, as chamadas ao Python utilizam o caminho /api/python, encaminhado pela configuração do Vercel. Esse formato permite que a interface utilize a API sem depender de uma chamada direta do navegador ao endereço externo.

A integração ainda possui limitações, especialmente nos recursos de autenticação, gestão de documentos e acompanhamento de atendimentos. O modo de demonstração permite apresentar esses fluxos enquanto as funcionalidades do servidor são desenvolvidas.
Organização do projeto
src/
├── assets/        # Imagens e recursos visuais
├── components/    # Componentes reutilizáveis
├── contexts/      # Estados do modo de demonstração
├── data/          # Informações das páginas e links
├── mocks/         # Dados utilizados na demonstração
├── pages/         # Telas da aplicação
├── services/      # Comunicação com as APIs e modo demo
├── types/         # Tipagens TypeScript
└── utils/         # Funções auxiliares

docs/              # Documentação técnica do projeto
scripts/           # Scripts de verificação e empacotamento
O visual do site foi pensado para transmitir uma identidade automotiva moderna, com predominância de azul, elementos de profundidade e adaptação para computadores e dispositivos móveis. Os mapas utilizam o OpenStreetMap.
Pitches e apresentação
Os vídeos serão adicionados pela equipe nos espaços abaixo.
Pitch de Frontend
Link do vídeo: [INSERIR LINK DO PITCH DE FRONTEND]

Apresentação das telas, da navegação, dos recursos responsivos e das principais funcionalidades desenvolvidas no frontend.
Pitch de Business Model
Link do vídeo: [INSERIR LINK DO PITCH DE BUSINESS MODEL]

Apresentação do problema identificado, da proposta de valor, do público-alvo e do modelo de negócio da solução.

A aplicação também possui uma página dedicada aos vídeos em /pitch. Para que eles apareçam dentro do site, os links confirmados devem ser inseridos no arquivo src/data/pitch.ts.
Relação com os Objetivos de Desenvolvimento Sustentável
O Guincho Save Lives se relaciona com a proposta de cidades mais conectadas e com a valorização dos pequenos prestadores de serviço.
- ODS 9 — Indústria, inovação e infraestrutura: a plataforma busca ampliar a visibilidade de profissionais autônomos e pequenos negócios de assistência veicular.
- ODS 11 — Cidades e comunidades sustentáveis: a organização das informações de assistência pode ajudar motoristas a encontrar suporte durante imprevistos no trânsito.
Esses são objetivos do projeto. A avaliação de resultados depende de testes e validação com usuários.
Equipe
FIAP — Turma 1TDSPY | Global Solution 2026/2
Integrante	RM
Bryan Germano Valcequi	569716
Enzo Alves	569427
Victor Hugo Velasco	573173
Vinicios Alves	573002
Rafael Ferreira	569767


Entrega acadêmica
A versão final do frontend pode ser empacotada com:
npm run lint
npm run test
npm run build
npm run package:delivery
O pacote é salvo em output/guincho-save-lives-entrega.zip. Antes da entrega, é importante conferir os links dos pitches, os arquivos de identificação, o funcionamento das páginas e as orientações da disciplina.
Guincho Save Lives — Global Solution 2026/2 | FIAP
