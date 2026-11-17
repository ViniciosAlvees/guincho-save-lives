# Auditoria de requisitos e penalidades - 17/11/2026

## Fonte e alcance

PDF oficial `1TDS Fevereiro - Global Solution 2026-2.pdf`, 100 páginas: regras gerais nas páginas 1-17, Front-End Design Engineering nas páginas 58-74 e penalidades na página 73. A tabela de penalidades e as resoluções foram conferidas também por renderização visual do PDF. Horários de referência: America/Sao_Paulo.

Esta revisão cobre o repositório do frontend, a publicação Vercel, o contrato e as chamadas da API Java, além das correções de segurança solicitadas. As outras disciplinas têm entregas próprias: veja [limites e pendências das demais disciplinas](outras-disciplinas.md). Não se atribui nota nem se certifica autoria ou submissão pelo Portal.

**Resultado: os requisitos técnicos principais do frontend estão implementados e foram testados, mas a entrega ainda tem pendências.** Faltam os links dos vídeos, participação dos demais integrantes no histórico final e aplicação das correções de segurança no backend. A API teve uma resposta HTTP 500 intermitente, cuja causa precisa de logs do Render. O acesso de funcionários está implementado e testado com contrato controlado; permanece fechado na API publicada até o responsável instalar a correção Java e configurar o PIN.

## Evidências atuais

- GitHub público: `ViniciosAlvees/guincho-save-lives`, `main` em `abca0a5c55b6e3b2f88356957c4f36aeca38825a` na consulta. Foram encontrados 16 commits, incluindo cinco merges, todos associados a Vinicios. Esta revisão foi organizada em seis commits locais na branch `bryan`, com a autoria configurada pelo usuário, sem atribuir commits a colegas. Envio/integração no histórico remoto não se presume a partir de commits locais.
- Vercel: projeto `gincho-save-lives`, framework Vite, produção `READY`, commit `abca0a5`, origem Git conectada ao repositório correto, URL `https://gincho-save-lives.vercel.app/`. Não houve erro de alias. A consulta de logs de runtime nos 30 minutos anteriores não encontrou registros de erro; uma SPA estática não envia automaticamente suas exceções de navegador a esses logs.
- Navegador na produção original: dez rotas em 390x844, 768x1024 e 1440x900, total de 30 acessos HTTP 200, navegação mobile e imagens da equipe verificadas. Em uma primeira navegação houve HTTP 500 da API no perfil, após a busca ter respondido 200. Na rodada seguinte, as consultas carregaram dados nas três resoluções.
- Antes das mudanças de Menu/Pitch/funcionários, foram feitos outros 30 acessos locais e testes de escrita. Guincheiro fictício recebeu HTTP 201 e foi encontrado com ID 8; solicitação fictícia recebeu HTTP 201 e foi encontrada com ID 6. As respostas dos POSTs tiveram ID nulo; a consulta posterior confirmou a persistência. Esses registros são explicitamente de teste, sem atendimento real.
- Versão final local com os cabeçalhos da Vercel: 12 rotas em três resoluções, 36 verificações, sem rolagem horizontal medida, imagens quebradas ou exceções JavaScript. Dois eventos `ERR_NETWORK_IO_SUSPENDED` foram registrados na rodada; não foram ocultados do relatório. Isso impede afirmar ausência absoluta de falhas de transporte.
- Animação: movimento do guincho confirmado por mudança de transformação entre quadros; pausa e retomada verificadas; parallax continua após mover o ponteiro. Movimento reduzido respeitado por padrão, com reprodução mediante ação explícita. Frase indicada pelo usuário removida. Botão da cena reposicionado no celular para não sobrepor o texto.
- Menu: abre nas três resoluções, fica dentro da tela, contém Pitch/Funcionários, fecha após navegar e por Escape, devolvendo foco ao botão. Navegação entre páginas volta ao topo, preservando âncoras válidas.
- Formulários públicos: campos vazios impediram POST nas três resoluções. Estados de lista vazia, falha de rede e nova tentativa foram verificados. Não há fallback de API para dados fictícios.
- Funcionários: formato do PIN validado, falhas HTTP não liberam acesso, token exige formato e expiração válidos, painel redireciona sem sessão, sessão desaparece ao recarregar, logout chama a API. Testes de fluxo usaram respostas controladas; **não equivalem a autenticação remota já disponível**.
- Código: 55 testes TypeScript/Vitest aprovados, ESLint e build aprovados. Backend de suporte: 12 testes Java aprovados, sendo oito novos de segurança, em cópia temporária sem acesso ao Oracle.
- Pacote de entrega: 97 arquivos, aproximadamente 3,72 MB, manifesto SHA256 e exclusões conferidos; extraído em pasta limpa, com `npm ci --offline --ignore-scripts` e `npm run build` aprovados. Os guards rejeitaram uma variável de senha com prefixo público e uma URL com credenciais, usando apenas sentinelas fictícios.
- Segurança: nenhum dos literais de conexão/usuário/senha encontrados no backend original aparece no bundle JavaScript do frontend; nenhum PIN foi configurado no frontend; build sem arquivos `.map`. `npm audit --omit=dev` retornou zero vulnerabilidades conhecidas. A auditoria completa ainda aponta 11 avisos altos na cadeia de ferramentas locais ligada a `picomatch`, sem versão corrigida publicada no registro consultado. Não foi feito downgrade forçado do Vite.

Evidências resumidas em [auditoria técnica](evidencias/auditoria-tecnica-2026-11-17.json), [verificação inicial](evidencias/navegador-integracao-2026-11-17.json) e [verificação final](evidencias/frontend-final-2026-11-17.json). A auditoria antiga está preservada como [registro histórico de 15/11](evidencias/auditoria-2026-11-15.md).

## Matriz da rubrica de Front-End

Os pesos abaixo são os do PDF; não representam nota concedida.

| Critério | Peso | Situação e evidência |
|---|---:|---|
| Construção do projeto, p. 64 | 10 | React + Vite + TypeScript, scripts, pastas e tipagem presentes. Instalação, testes e build conferidos. Node 22.12+, 24 ou 26 por causa da atualização de segurança do Vitest. |
| Componentização, páginas e rotas, p. 65 | 10 | `PageHero` e `Notice` reutilizados. Cinco institucionais, busca, cadastro, solicitação e perfil com parâmetro. Pitch e funcionários acrescentados. Menus e acesso direto testados; painel protegido redireciona sem sessão. |
| Tailwind e responsividade, p. 66 | 8 | Tailwind configurado; mobile 390x844, tablet 768x1024 e desktop 1440x900. Menu e controles corrigidos após medidas e inspeção visual. Sem rolagem horizontal indevida nos casos testados. |
| API Java, p. 67 | 18 | GET real mostrado na interface; POSTs reais com persistência confirmada; serviços Fetch, tipos e estados. Houve HTTP 500 intermitente: estabilidade depende do servidor. Segurança e autenticação novas aguardam aplicação do pacote Java. |
| Formulários e UX, p. 68 | 7 | Campos identificados, obrigatoriedade, formato, carregamento, erro e sucesso verificados. Não repete POST automaticamente quando a escrita pode ter ocorrido. |
| Vercel, p. 69 | 7 | URL pública, projeto/repositório corretos e produção READY conferidos. Rotas da versão publicada testadas. Novas alterações locais só aparecem após publicação; não confundir a produção original com a revisão local. |
| GitHub, README e vídeo, p. 70 | 10 | Repositório público e documentação atualizados. Total remoto de 16 commits atende numericamente ao mínimo de 15, incluindo merges. **Falta comprovar cinco por cada integrante no histórico final.** URL do vídeo frontend até três minutos ainda ausente. |
| Apresentação presencial, p. 71 | 30 | Depende da equipe, entre 23 e 27/11. Todos precisam participar oralmente, explicar decisões e responder às perguntas. Código e testes não comprovam a apresentação. |

O slide 71 repete o rótulo de domínio técnico; esta auditoria não cria um critério adicional para corrigir a redação do professor. O limite do vídeo frontend é **três minutos**, distinto dos cinco minutos do pitch de Software Engineering e do vídeo Java.

## Penalidades oficiais de Front-End - página 73

| Item | Penalidade | Conferência |
|---|---|---|
| 01. ZIP acima de 50 MB | -2 pontos | Empacotador exige até 50.000.000 bytes, gera manifesto e reabre o ZIP para comparar hashes. Medir o pacote exato da entrega. |
| 02. `node_modules` no ZIP | -3 pontos | Excluída por lista explícita e validação. Dependências instaladas na máquina não entram na entrega. |
| 03. Arquivos essenciais ausentes | -10 pontos | Fontes, assets, configurações, lockfile e identificação incluídos. Instalação/build do pacote extraído precisam continuar válidos após qualquer alteração posterior. |
| 04. Biblioteca HTTP substituindo Fetch | -10 pontos | Serviços do frontend usam Fetch. Nenhum Axios ou substituto foi introduzido. Bibliotecas de teste/compactação não substituem Fetch na aplicação. |
| 05. Falta de ZIP no Portal | Nota zero | Não verificável por código. Somente o representante deve anexar o ZIP na área da disciplina; link de GitHub/Vercel não substitui o envio. |
| 06. Template pronto como base substancial | Nota zero | Nenhum template foi identificado na inspeção. A equipe precisa sustentar a origem e o domínio do trabalho. |
| 07. Tecnologia proibida substituindo React/Vite | Nota zero | Aplicação permanece React + Vite + TypeScript. Os arquivos Java em `support` são correção separada para o backend, sem substituir a SPA ou entrar em seu build. |
| 08. Incompatibilidade com a proposta | Nota zero | CitizenTech, beneficiários, problema, funcionamento, ecossistema, metas ODS e plano de medição presentes. Pesquisa e impacto não são apresentados como já realizados. |
| 09. Plágio/trabalho substancialmente idêntico | Nota zero + ocorrência | Não é possível certificar originalidade global por inspeção local. Créditos e uso de IA declarados; revisão e explicação pela equipe continuam obrigatórias. |

Pendências de API, vídeo, histórico e apresentação afetam a rubrica; não se inventam penalidades adicionais de nota zero para cada uma delas.

## Regras gerais e pendências da equipe

- Cinco integrantes listados, dentro do limite do PDF. `identificacao.txt` contém nome, RM e turma de cada pessoa. Conferir os nomes completos, especialmente os atualmente abreviados, antes de entregar.
- O cadastro do grupo deveria ter sido feito até 13/11. Conferir o comprovante com o representante; o repositório não prova esse cadastro.
- Entrega de Front-End: um ZIP no Portal até **19/11/2026, 23h55**. Apresentações: **23 a 27/11/2026**, conforme a escala do professor. Nenhuma submissão foi realizada nesta revisão.
- Cada integrante deve produzir e explicar seus próprios cinco commits. Com cinco integrantes, isso implica pelo menos 25 commits autênticos. Commits desta revisão não são atribuídos a colegas para simular participação.
- Enviar os links reais do YouTube para preencher o README e `src/data/pitch.ts`. A página Pitch preparada não substitui o vídeo.
- Responsável pelo backend: trocar a credencial exposta, aplicar [a correção Java](../support/backend-security/README.md), configurar o PIN e publicar. Não inserir essas credenciais no frontend nem neste relatório.
- Estabilizar o HTTP 500 observado e testar a autenticação no Render após a publicação. Verificar também as entregas específicas de Java, banco, IA, Python e Software Engineering.

## Correções desta revisão

1. Animação recuperada com pausa/retomada e correção do listener de rolagem; mensagem pedida removida.
2. Menu único, responsivo e acessível; novas páginas Pitch e Funcionários.
3. Sessão de funcionários somente em memória, dependente de confirmação da API, com expiração/logout e nenhum PIN fixo.
4. CSP e cabeçalhos de segurança preparados; source maps desabilitados; bloqueio de variáveis públicas indevidas e URLs com credenciais; servidores locais restritos a 127.0.0.1.
5. Ferramentas vulneráveis atualizadas; dependências de build separadas das usadas em produção; auditoria residual documentada.
6. Correção Java de credenciais, erros e autenticação preparada e testada, sem acesso de escrita ao backend remoto.
7. Diagnóstico passou a detectar a listagem indevidamente pública de pedidos; empacotadores conferem conteúdo, hashes e configuração pública.

Nenhuma dessas verificações garante uma nota final ou substitui os itens acadêmicos e operacionais pendentes.
