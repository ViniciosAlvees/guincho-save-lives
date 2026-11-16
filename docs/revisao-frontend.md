# Auditoria de requisitos e penalidades — 15/11/2026

## Escopo e fonte

Conferência do frontend Guincho Save Lives com o PDF oficial `1TDS Fevereiro - Global Solution 2026-2.pdf`, localizado em Downloads. Foram lidas as páginas 1–17 (regras gerais e CitizenTech) e 58–74 (Front-End Design Engineering). As penalidades abaixo são as da página 73. Esta auditoria não certifica as entregas das outras cinco disciplinas.

Evidências: código local da branch `Vinicios`, testes executados nesta revisão, GitHub conectado, dados de deploy da Vercel, HTTP público, Chrome headless e arquivo ZIP extraído em pasta limpa. Horários e datas referem-se a America/Sao_Paulo.

## Resultado

**A entrega ainda não atende a todos os requisitos.** A base técnica, as páginas e a publicação foram verificadas, mas a API Java retorna HTTP 500, o histórico publicado não atende à participação exigida e o vídeo ainda será produzido pela equipe. Os colegas realizarão seus próprios commits, conforme informado pelo usuário. Contato público, conteúdo CitizenTech/ODS e ajuste de layout foram corrigidos localmente. Não é possível garantir ausência de descontos ou nota zero por questões que dependem da submissão, autoria e apresentação.

O usuário delimitou o trabalho ao frontend e à integração HTTP. Nenhum código Java foi alterado ou incluído nesta entrega. A correção do servidor é responsabilidade do integrante do backend.

### Evidências atuais

- [GitHub público](https://github.com/ViniciosAlvees/guincho-save-lives): branch padrão `main`, commit `11984eeb9ace08128def4841b499771c154d6ec2` na consulta. O endereço antigo `gincho-save-lives` redireciona ao repositório renomeado.
- [Vercel](https://gincho-save-lives.vercel.app/): produção `READY`, commit `11984ee`, branch `main`. O bundle público `index-CHyD361d.js` correspondia ao build da integração antes dos ajustes desta auditoria. Portanto, os dois commits da integração já chegaram ao GitHub e à produção por merge; não estão apenas locais.
- Navegador: nove páginas em três resoluções, **27 acessos com HTTP 200 e título de página renderizado**, sem exceções JavaScript. Registro em [evidências do navegador](evidencias/navegador-publicado-2026-11-15.json).
- Mobile/tablet: o menu abriu, navegou para Integrantes e fechou. As cinco fotos carregaram nas três resoluções após verificar também o carregamento tardio.
- Formulários de solicitação e guincheiro: envio vazio impedido pelo navegador, respectivamente quatro e três campos inválidos, sem POST enviado.
- API: em aproximadamente 21h45, `GET /guincheiros` retornou HTTP 500 com `Access-Control-Allow-Origin: https://gincho-save-lives.vercel.app`. O mesmo HTTP 500 foi observado pelo Chrome nas telas da solução. CORS aceitou a origem; o erro interno continua. A consulta anterior a `/solicitacoes` também retornou 500; não houve nova escrita em produção nesta auditoria.
- Código: **29 testes aprovados**, incluindo 19 testes do cliente HTTP com respostas controladas; ESLint e build TypeScript/Vite aprovados.
- Pacote de conferência do commit `a09aff1`: **3.733.807 bytes**, 77 entradas incluindo diretórios, sem `node_modules` ou `.git`, com `identificacao.txt`, lockfile e configuração pública de API. Foi extraído em pasta limpa; `npm ci --offline --no-audit --no-fund`, `npm run build` e `npm run dev -- --port 5180` funcionaram. O npm usou seu cache local. Esse pacote é uma amostra auditada, não uma confirmação do ZIP que será anexado ao Portal.

## Matriz detalhada do frontend

Os pontos identificam o peso oficial de cada grupo de critérios; não representam uma nota atribuída nesta revisão.

| Critério do PDF | Peso | Verificação e situação |
|---|---:|---|
| Construção do projeto, p. 64 | 10 | **Comprovado:** React/Vite e scripts; código TS/TSX; pastas de componentes, páginas, serviços e tipos; interfaces nas props/estados/respostas; instalação limpa, build e início do servidor. |
| Componentização, páginas e rotas, p. 65 | 10 | **Comprovado:** `PageHero` e `Notice` reaproveitados; responsabilidades separadas; Home, Integrantes, Sobre, FAQ e Contato; busca, solicitação e cadastro profissional como páginas da solução; rotas estáticas e `/guincheiros/:id`; links do menu mobile e acesso direto remoto renderizados. O conteúdo do perfil com um ID existente depende do GET atualmente em erro. |
| Tailwind e responsividade, p. 66 | 8 | **Parcial:** Tailwind configurado e classes utilitárias aplicadas; 390×844, 768×1024 e 1440×900 renderizadas sem rolagem horizontal. A revisão visual encontrou o radar decorativo atrás do texto no tablet; corrigido localmente nesta revisão, ainda sem publicação. A ilustração do caminhão estende-se no recorte decorativo da Home mobile, sem ampliar o documento nem cortar controles. Não se deve usar apenas a métrica de largura como prova de ausência de sobreposição. |
| API Java, p. 67 | 18 | **Parcial:** URL remota e README, serviços organizados, tipos e estados de carregamento/erro/vazio existem; erro real apareceu na interface. **Não comprovado:** GET bem-sucedido exibindo registros reais e escrita persistida. Backend retorna 500. Mocks dos testes e modo demo não satisfazem esses dois itens. |
| Formulários e UX, p. 68 | 7 | **Parcial:** formulários de solicitação e profissional identificados, com validação, bloqueio de envio vazio e mensagens; usabilidade examinada nos três tamanhos. Erro remoto visível. **Sucesso de operação real ainda não validado**, pois depende de corrigir a API. Contato agora direciona ao canal público real de GitHub Issues, sem formulário que apenas simulava comunicação. |
| Vercel, p. 69 | 7 | **Parcial:** publicação pública, carregamento React e acesso direto às rotas comprovados; link incluído no README local durante a auditoria. Integração em produção continua falhando na API. O README publicado e o ajuste visual precisam receber as alterações locais desta revisão. |
| GitHub, README e vídeo, p. 70 | 10 | **Parcial:** repositório público, título, objetivo, tecnologias, pastas, integrantes, comandos e links GitHub/API/Vercel/contato presentes no README local. **Faltam:** participação dos integrantes nos commits, mínimo total na `main` e URL do vídeo YouTube de até 3 minutos. O usuário informou que colegas aplicarão seus commits e o vídeo ainda não está pronto. Funções dos integrantes estão pendentes de confirmação, sem atribuições inventadas. |
| Apresentação presencial, p. 71 | 30 | **Pendente de realização:** problema/contexto; explicação da solução; navegação; demonstração nas três resoluções; menu/interações/formulário; domínio de HTML/CSS/JavaScript; participação oral efetiva de todos; respostas ao professor. O slide repete um rótulo de domínio técnico; preservar os itens do professor sem inventar critérios adicionais. Código ou testes não comprovam apresentação. |

### Páginas verificadas no navegador

`/`, `/integrantes`, `/sobre`, `/faq`, `/contato`, `/buscar-guincho`, `/guincheiros/1`, `/solicitar-guincho` e `/cadastro/guincheiro`. Na busca e no perfil, verificou-se a apresentação do erro real da API; não se afirma que registros de profissionais foram carregados.

### Histórico Git — requisito não atendido

A API do GitHub retornou **12 commits alcançáveis na `main`**, todos associados ao mesmo e-mail e usuário ViniciosAlvees. A branch `Vinicios` local tem oito commits. Referências auxiliares e checkpoints locais não foram usados para aumentar a contagem da entrega.

| Integrante | Participação comprovada no histórico final consultado |
|---|---|
| Vinicios Alves | 12 commits na `main`, incluindo merges; atende ao mínimo individual numérico |
| Raphael Ferreira Tavares | Nenhum commit identificado como autoria dele |
| Bryan Germano | Nenhum commit identificado como autoria dele |
| Enzo Macedo | Nenhum commit identificado como autoria dele |
| Victor Hugo Velasco Guzman | Nenhum commit identificado como autoria dele |

O PDF exige pelo menos 15 commits no total e cinco por integrante. Com cinco pessoas, cumprir a participação individual exige pelo menos 25 commits autênticos. Cada integrante deve realizar e explicar suas próprias alterações. Não basta aumentar o total por um único autor nem atribuir autoria que não corresponde ao trabalho realizado.

## Penalidades específicas — página 73

| Item | Penalidade oficial | Evidência e limite da conclusão |
|---|---|---|
| 01 — ZIP maior que 50 MB | −2 pontos | **Não ocorre na amostra auditada:** 3,73 MB. Medir novamente o arquivo exato que será enviado. |
| 02 — `node_modules` incluída | −3 pontos | **Não ocorre na amostra:** nenhuma entrada dessa pasta. Ter `node_modules` na máquina é normal; o risco é compactar a pasta do projeto inteira. |
| 03 — arquivos essenciais ausentes | −10 pontos | **Não identificado na amostra:** extração, instalação limpa, build e início de servidor aprovados; código, assets, lockfile e configurações presentes. Revalidar se o ZIP final for montado de outra forma. |
| 04 — Axios/outra biblioteca substituindo Fetch | −10 pontos | **Não identificado:** dependências diretas não incluem biblioteca HTTP substituta e o código de serviços usa Fetch. Leaflet, React Router e ícones não substituem a camada HTTP exigida. |
| 05 — entrega sem ZIP no Portal | Nota zero | **Depende da submissão:** o representante deve anexar o arquivo na área da disciplina. GitHub, Vercel, e-mail ou Teams não substituem esse envio. Nenhuma submissão foi feita nesta auditoria. |
| 06 — template pronto como base substancial | Nota zero | Nenhum template pronto foi identificado na inspeção. A origem integral e o domínio do código precisam ser sustentados pela equipe; análise técnica local não certifica autoria. |
| 07 — tecnologia proibida substituindo React/Vite | Nota zero | **Não identificado:** implementação em React + Vite + TypeScript; sem Angular, Vue, Next.js ou Create React App como base da aplicação. |
| 08 — incompatibilidade com a proposta | Nota zero | A solução se relaciona a mobilidade e acesso a serviços. Beneficiários, ecossistema, metas ODS e plano de medição de impacto foram detalhados em Sobre e no README. A contribuição aos ODS é apresentada como proposta parcial, sem inventar resultados ou parcerias; não é uma garantia prévia de avaliação. |
| 09 — plágio/trabalho substancialmente idêntico | Nota zero + ocorrência | **Não certificável por esta auditoria.** Há créditos de fotos/dados dos integrantes e uso de IA no README. O grupo deve revisar, compreender e defender o trabalho; IA permitida não dispensa domínio do conteúdo. |

API, vídeo, commits e apresentação também impactam os critérios da rubrica. Não há base para transformar automaticamente cada pendência em uma penalidade adicional de nota zero, nem para prometer uma nota final.

## Regras gerais e conteúdo CitizenTech

| Requisito geral | Situação |
|---|---|
| Até cinco integrantes | Cinco pessoas listadas no código, README e `identificacao.txt`. |
| Cadastro do grupo até 13/11 | Não verificável pelo repositório. Prazo já passou; confirmar o comprovante com o representante, pois grupo não cadastrado pode não aparecer no Portal. |
| TXT em cada ZIP com RM, nome completo e turma | Arquivo presente na amostra e com os três campos por integrante. A própria identificação pede conferência dos nomes completos; confirmar especialmente abreviações antes de entregar. |
| CitizenTech: beneficiário, problema, funcionamento, tecnologias, ecossistema e impacto | Conteúdo incluído em Sobre e README: motoristas/famílias e pequenos prestadores; funcionamento; participantes do ecossistema; quatro indicadores e métodos de coleta. Pesquisa e impacto ainda não realizados, claramente identificados como plano. |
| ODS e contribuição para metas | Sobre e README explicam a relação parcial com a meta 9.3 (integração de pequenos negócios ao mercado) e indireta com a 11.2 (mobilidade/segurança), com links às fontes oficiais da ONU e limites da contribuição. Não são alegados resultados nem mudanças nos indicadores oficiais. |
| IA generativa | Uso de Codex/ImageGen declarado no README com finalidade e créditos. Entregar sem revisar ou sem compreender o código contraria a orientação geral da página 17. |
| Prazo e canal | Representante deve anexar um ZIP até **19/11/2026, 23h55**, no Portal do Aluno. Não houve acesso/submissão no Portal nesta revisão. |
| Apresentações | **23 a 27/11/2026**, na aula da disciplina, com participação efetiva dos integrantes. Confirmar escala e materiais com o professor. |

## Correções locais feitas nesta revisão

1. README passou a conter a URL da Vercel fornecida, o nome atual do repositório público e o estado real da publicação.
2. Radar decorativo de `PageHero` ocultado também no tablet, evitando disputar o espaço do texto. Build aprovado; verificação visual local documentada após a alteração. A produção examinada ainda contém o CSS anterior.
3. Matriz e roteiro de vídeo atualizados para não recomendar demonstrar mocks como substitutos da API real.
4. Sobre detalha cidadãos beneficiados, ecossistema, metas ODS e plano de avaliação; Home no modo API passou a anunciar somente os recursos disponíveis.
5. Contato passou a apontar ao GitHub Issues do projeto, que está habilitado; não foram inventados e-mail, telefone ou prazo de resposta.
6. Scripts `check:api` e `package:delivery` incluídos: diagnóstico GET sem dados pessoais e geração de ZIP por lista explícita, com limite de tamanho, validação de conteúdo e manifesto SHA256.

A verificação final local das páginas está registrada em [evidências finais](evidencias/validacao-final-local-2026-11-15.json). O pacote atualizado pode ser reproduzido com `npm run package:delivery`; é necessário regenerá-lo após vídeo e contribuições do grupo. A dependência de compactação `fflate` é usada somente no empacotador e não substitui Fetch nas requisições HTTP.

As alterações desta revisão foram organizadas em commits locais na branch `Vinicios`. Ainda precisam ser revisadas e publicadas. Não houve push, merge, deploy ou submissão no Portal nesta etapa.

## Ordem prática para concluir a entrega

1. O responsável pelo backend deve corrigir o HTTP 500. Depois, o frontend deve repetir `npm run check:api` e demonstrar GET exibindo dados e um POST persistido, confirmado por consulta posterior.
2. Cada integrante realizar suas contribuições e commits autênticos; consolidar a versão final no GitHub público.
3. Revisar as alterações locais desta auditoria e publicar a versão final na Vercel; repetir o teste das rotas e da integração.
4. Gravar vídeo público/não listado no YouTube, de até três minutos, mostrando a aplicação e a API real. Inserir a URL no README; o canal de contato público já está indicado.
5. Revisar e compreender a explicação CitizenTech/ODS incluída, confirmar nomes/cadastro do grupo e preparar a apresentação.
6. Montar o ZIP final sem `node_modules`, conferir tamanho/arquivos, extrair em pasta limpa e executar os comandos. O representante deve anexar esse arquivo no Portal dentro do prazo.
