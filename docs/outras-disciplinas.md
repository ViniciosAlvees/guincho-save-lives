# Alcance das demais disciplinas do PDF

O repositório fornecido é do frontend. As entregas abaixo são independentes no Portal e não podem ser certificadas pelo build React. Este registro evita confundir a revisão de Front-End com aprovação de toda a Global Solution.

| Disciplina / páginas | Material exigido que não está neste frontend |
|---|---|
| IA & Chatbot, 22-28 | Pelo menos dois modelos, dados, notebooks com análise/treinamento/métricas, modelos exportados e API Flask; ZIP e identificação. Ausência/corrupção e menos de dois modelos têm penalidades próprias. |
| Banco relacional, 29-37 | Oracle/Data Modeler, pelo menos seis tabelas, dois 1:N e um N:N, PK/FK/restrições, modelos conceitual/lógico/relacional, dicionário, consultas e evidências. O PDF menciona 60 registros nos requisitos e 50 em outras lâminas: planejar pelo menos 60 distribuídos para atender ao requisito mais exigente e confirmar com o professor. SQL/PDF e capturas precisam de revisão própria. |
| Python, 38-45 | Código procedural com menus, estruturas, funções e persistência, mais documentação PDF. Proibição de classes/OOP e desconto por list comprehension são dessa disciplina, não regras aplicáveis ao TypeScript deste frontend. |
| Java, 46-56 | Spring Boot, Oracle/JDBC/DataSource, pelo menos três entidades com 1:N, CRUD e rotas aninhadas, DTOs/ModelMapper/Bean Validation, regra de negócio, handler, status/Location, SQL, Docker/Render, PDF técnico e vídeo até cinco minutos. |
| Software Engineering, 75-94 | PDF único com BMC, benchmark, backlog Jira/Trello, HUs/RF/RNF/RN, casos de uso, atividades, UX, precificação, ROI, SLA, pitch e registro detalhado de IA. O pitch de até cinco minutos não substitui o vídeo frontend de três minutos. |

## Backend Java observado

O repositório Java vinculado foi consultado no commit `45c50e18f5ab37c6ea69a5ce1377d35a05fec357`. Ele tem dois controllers de recursos com GET/POST, recebe/devolve modelos diretamente e cria conexões por `ConnectionFactory`. Não foram encontrados DTOs, ModelMapper, validação com `@Valid`, CRUD completo, rotas 1:N ou script SQL na árvore consultada. Os nomes de tabelas/colunas também precisam ser conferidos frente ao padrão exigido na disciplina.

Essas lacunas não são resolvidas pelo fato de GET e POST funcionarem no frontend. O pacote em `support/backend-security` corrige parte da segurança e acrescenta autenticação de funcionários, mas **não completa os requisitos da disciplina Java**. Documentação técnica, modelo/SQL e vídeo não foram fornecidos para validação. A credencial exposta deve ser substituída, sem registrar seu valor em novas entregas.

O cadastro do grupo, os materiais de cada disciplina e a submissão no Portal dependem do representante e dos responsáveis. Prazo geral: 19/11/2026 às 23h55; apresentações de 23 a 27/11, segundo a escala do professor.
