# Guincho Save Lives

**Tecnologia que conecta motoristas a serviços de assistência veicular.**

O **Guincho Save Lives** é um projeto desenvolvido para a **Global Solution 2026/2 da FIAP**, dentro da proposta CitizenTech.

A plataforma tem como objetivo facilitar a busca por profissionais de guincho, reunindo informações como localização, tipo de veículo, distância aproximada e estimativa de preço em um único ambiente.

O projeto conta com uma aplicação web responsiva, desenvolvida em React, com integrações a serviços em Java e Python. Também possui um modo de demonstração que permite apresentar as funcionalidades sem depender da disponibilidade das APIs externas.

**Importante:** esta é uma aplicação acadêmica em desenvolvimento. Os valores e dados apresentados no modo de demonstração são ilustrativos. A plataforma não deve ser utilizada para solicitar atendimentos reais de emergência.

---

## 1. Acesse o projeto

- **Site:** https://gincho-save-lives.vercel.app/
- **Frontend:** https://github.com/ViniciosAlvees/guincho-save-lives
- **Backend Java:** https://github.com/velascoguzmanvictorhugo-ui/guincho-save-lives-backend
- **API Python:** https://github.com/ViniciosAlvees/python-guincho-save-

---

## 2. Como a plataforma funciona

O Guincho Save Lives foi desenvolvido para tornar a busca por assistência veicular mais simples e organizada.

O motorista pode procurar profissionais de guincho, visualizar informações dos prestadores disponíveis e informar os detalhes necessários para solicitar um atendimento.

Os guincheiros, por sua vez, possuem um espaço específico para cadastrar seus dados profissionais e apresentar seus serviços.

A aplicação possui dois modos de funcionamento:

### Modo de demonstração

Permite navegar pelos fluxos de cadastro, busca de guinchos, solicitação e acompanhamento de atendimentos utilizando dados simulados.

### Modo API

O frontend utiliza os endpoints desenvolvidos pela equipe para realizar operações como consulta de profissionais, cadastro de guincheiros, registro de solicitações e cálculo de estimativas de preço.

---

## 3. Principais funcionalidades

- **Página inicial:** apresentação do projeto com elementos visuais, animações e identidade relacionada ao setor automotivo.
- **Busca de guinchos:** pesquisa de profissionais por região e características do serviço, com visualização de mapa e informações dos prestadores.
- **Cadastro de clientes:** formulário com informações pessoais e validação dos campos.
- **Cadastro de guincheiros:** registro de dados pessoais e profissionais, incluindo etapas demonstrativas para envio de documentos.
- **Perfil do profissional:** apresentação dos dados e das avaliações dos guincheiros.
- **Solicitação de atendimento:** preenchimento das informações de origem, destino, veículo e descrição do problema.
- **Estimativa de preço:** cálculo ilustrativo realizado por meio da integração com a API Python.
- **Acompanhamento e avaliações:** visualização de histórico, negociação e avaliação dos atendimentos no modo de demonstração.
- **Área de funcionários:** espaço de acesso restrito para consulta de informações, conforme os recursos disponibilizados pela API.
- **Páginas informativas:** conteúdos sobre a solução, integrantes do projeto e perguntas frequentes.

**Observação:** algumas funcionalidades estão disponíveis somente no modo de demonstração. A autenticação completa, o armazenamento seguro de documentos, o chat entre dispositivos e o processamento de pagamentos ainda não fazem parte da integração atual com a API Java.

---

## 4. Tecnologias utilizadas

### Frontend

- **React:** desenvolvimento da interface.
- **TypeScript:** tipagem e organização do código.
- **Vite:** configuração e execução do ambiente de desenvolvimento.
- **Tailwind CSS:** estilização e responsividade.
- **React Router:** gerenciamento das rotas e navegação.
- **Leaflet:** implementação dos mapas interativos.
- **OpenStreetMap:** fornecimento dos dados cartográficos.

### Backend e integrações

- **Java:** API REST responsável pelas operações disponibilizadas para profissionais e solicitações.
- **Python:** serviço utilizado para calcular estimativas de preço.
- **Fetch API:** comunicação entre o frontend e as APIs.
- **Vercel:** hospedagem e publicação da aplicação.

---

## 5. Executando o projeto

Para executar a aplicação localmente, é necessário ter o **Node.js 22.12 ou superior**, em uma versão compatível com o projeto, e o npm instalados.

### 5.1. Clonar o repositório

```bash
git clone https://github.com/ViniciosAlvees/guincho-save-lives.git
cd guincho-save-lives
```

### 5.2. Instalar as dependências

```bash
npm install
```

### 5.3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Após iniciar o servidor, abra no navegador o endereço informado pelo terminal.

---

## 6. Configuração das APIs

Por padrão, o projeto utiliza o modo API, com as configurações públicas necessárias para a comunicação entre os serviços.

Para personalizar o ambiente local, copie o arquivo `.env.example` para `.env.local`.

### Configuração do modo API

```env
VITE_APP_MODE=api
VITE_API_BASE_URL=https://guincho-save-lives-backend.onrender.com
VITE_PYTHON_API_BASE_URL=/api/python
```

### Configuração do modo de demonstração

Para explorar a aplicação utilizando dados simulados, altere a variável:

```env
VITE_APP_MODE=demo
```

Após modificar as configurações do ambiente, reinicie o servidor do Vite para aplicar as alterações.

---

## 7. Comandos disponíveis

| Comando | Finalidade |
|---|---|
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run preview` | Visualiza a versão de produção localmente |
| `npm run typecheck` | Verifica os tipos do TypeScript |
| `npm run lint` | Analisa o código utilizando ESLint |
| `npm run test` | Executa os testes automatizados |
| `npm run check:api` | Verifica os endpoints configurados da API Java |
| `npm run check:python` | Verifica a integração com a API Python |
| `npm run package:delivery` | Prepara o arquivo ZIP para entrega |

---

## 8. Integração entre frontend, Java e Python

O projeto utiliza diferentes tecnologias para organizar as responsabilidades de cada parte da aplicação.

### Frontend — React e TypeScript

Responsável pela interface visual, navegação entre páginas, formulários, apresentação das informações e comunicação com os serviços externos.

### Backend — Java

A API Java disponibiliza as operações necessárias para consulta de profissionais, cadastros e gerenciamento das solicitações implementadas.

### API — Python

A API Python realiza os cálculos utilizados para apresentar estimativas de preço dos serviços de guincho.

### Comunicação entre os serviços

O frontend utiliza requisições HTTP para acessar os endpoints disponibilizados pelas APIs.

Na aplicação publicada, as chamadas ao serviço Python utilizam o caminho `/api/python`, encaminhado pela configuração do Vercel.

Essa estrutura permite que o frontend se comunique com o serviço Python sem precisar realizar chamadas diretas do navegador ao endereço externo.

A integração ainda apresenta limitações, principalmente nos recursos de autenticação, gerenciamento de documentos e acompanhamento de atendimentos.

O modo de demonstração permite apresentar esses fluxos enquanto as funcionalidades dos servidores continuam sendo desenvolvidas.

---

## 9. Organização do projeto

A aplicação utiliza uma estrutura organizada por componentes, páginas, serviços e arquivos auxiliares.

```text
src/
├── assets/          # Imagens e recursos visuais
├── components/      # Componentes reutilizáveis
├── contexts/        # Estados do modo de demonstração
├── data/            # Informações das páginas e links
├── mocks/           # Dados utilizados na demonstração
├── pages/           # Telas da aplicação
├── services/        # Comunicação com as APIs e modo demo
├── types/           # Tipagens TypeScript
└── utils/           # Funções auxiliares

docs/                # Documentação técnica do projeto
scripts/             # Scripts de verificação e empacotamento
```

Essa organização facilita a manutenção do código, a reutilização de componentes e a integração entre as diferentes funcionalidades da aplicação.

---

## 10. Interface e experiência do usuário

A identidade visual do Guincho Save Lives foi desenvolvida para transmitir uma aparência moderna, com elementos relacionados ao setor automotivo.

O site utiliza uma paleta de cores predominantemente azul, efeitos de profundidade, animações e transições para proporcionar uma experiência visual mais dinâmica.

A interface também foi planejada para funcionar em computadores, tablets e smartphones, adaptando seus componentes aos diferentes tamanhos de tela.

Os mapas utilizam Leaflet e OpenStreetMap para apresentar informações geográficas e auxiliar na visualização dos profissionais.

---

## 11. Relação com os Objetivos de Desenvolvimento Sustentável

O Guincho Save Lives está relacionado à proposta de cidades mais conectadas e à valorização de pequenos prestadores de serviço.

### ODS 9 — Indústria, inovação e infraestrutura

A plataforma busca utilizar a tecnologia para facilitar o acesso a serviços de assistência veicular, ampliando a visibilidade de profissionais autônomos e pequenos negócios do setor.

### ODS 11 — Cidades e comunidades sustentáveis

A organização das informações sobre assistência veicular pode contribuir para que motoristas encontrem suporte de maneira mais prática durante imprevistos no trânsito.

Esses objetivos representam a proposta do projeto. A avaliação dos resultados depende de testes, validação com usuários e evolução da plataforma.

---

## 12. Equipe

**FIAP — Global Solution 2026/2**

**Turma: 1TDSPY**

| Integrante | RM |
|---|---|
| Bryan Germano Valcequi | 569716 |
| Enzo Alves | 569427 |
| Victor Hugo Velasco | 573173 |
| Vinicios Alves | 573002 |
| Rafael Ferreira | 569767 |

---

## 13. Entrega acadêmica

A versão final do frontend pode ser preparada utilizando os seguintes comandos:

```bash
npm run lint
npm run test
npm run build
npm run package:delivery
```

O pacote de entrega é gerado no seguinte caminho:

```text
output/guincho-save-lives-entrega.zip
```

Antes de finalizar a entrega, é importante verificar o funcionamento das páginas, as configurações das APIs, os arquivos de identificação e o atendimento aos requisitos da disciplina.

---

**Guincho Save Lives — Global Solution 2026/2 | FIAP**
