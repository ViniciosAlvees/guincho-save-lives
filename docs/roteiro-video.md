# Roteiro — vídeo YouTube de até três minutos

**Pré-condição:** aquecer e conferir a API na Render, aplicar a correção de segurança e usar somente dados fictícios. Em 17/11/2026 GET e POST foram comprovados, mas houve um HTTP 500 intermitente e a proteção da listagem de pedidos ainda precisa ser publicada. O vídeo obrigatório demonstra aplicação e integração Java real; o modo demo não substitui esse requisito.

1. **0:00–0:20:** apresentar equipe, cidadão beneficiado, problema de acesso à assistência veicular e proposta CitizenTech.
2. **0:20–0:45:** mostrar Home, Integrantes, Sobre/ODS, FAQ e Contato; explicar a contribuição proposta, sem inventar impacto comprovado.
3. **0:45–1:10:** abrir a Vercel e demonstrar a busca carregando registros reais do Java; mostrar filtro por região/cidade e perfil.
4. **1:10–1:50:** preencher solicitação com dados fictícios, demonstrar validação e enviar um POST real; mostrar confirmação e consultar o registro persistido no Java. Preparar o servidor antes para não gastar o tempo com inicialização.
5. **1:50–2:20:** demonstrar as três resoluções oficiais, o menu mobile e a navegação.
6. **2:20–2:45:** explicar React/Vite/TypeScript/Tailwind, componentes reutilizáveis, serviços Fetch e tratamento de erros.
7. **2:45–3:00:** mostrar links de GitHub, Vercel e API no README; mencionar as limitações atuais e encerrar.

Publicar no YouTube como público ou não listado, conferir duração **máxima de três minutos** e inserir o link no README. Confirmar que o vídeo abre sem depender da conta do autor. Chat, propostas e login de clientes/guincheiros existem apenas no modo demo: identificá-los como simulação se forem mostrados, sem desviar da demonstração obrigatória de GET e escrita reais.

Inserir também o link confirmado em `src/data/pitch.ts`, no item `frontend`. O item `pitch` recebe o vídeo de apresentação da solução, cujo limite da disciplina Software Engineering é cinco minutos. Não mostrar PIN, token, credenciais, logs SQL ou dados reais na gravação. O acesso novo de funcionários só pode ser apresentado como disponível depois de validado com o backend publicado.

Não confundir o vídeo com a apresentação presencial de 23 a 27/11, que exige participação oral dos integrantes e domínio do código.
