# Revisão de segurança - 17/11/2026

## O que o visitante consegue inspecionar

HTML, CSS e JavaScript entregues ao navegador são públicos. Bloquear clique direito ou DevTools não protege credenciais. O PDF também exige repositório público. A segurança depende de manter segredos no servidor e validar autorização nos endpoints. Variáveis `VITE_*` são incorporadas ao código público, conforme a [documentação do Vite](https://vite.dev/guide/env-and-mode#security-notes).

## Frontend corrigido

- Não contém senha/usuário JDBC ou PIN válido fixo. Os três literais de conexão do backend original foram comparados ao bundle, sem correspondência, sem imprimi-los nos resultados.
- Build rejeita variáveis públicas fora das configurações permitidas e metadados públicos Vercel; nomes de segredo/token/banco são bloqueados. A URL da API não pode conter usuário/senha e deve usar HTTPS, exceto localhost.
- Source maps de produção desativados. Isso reduz a exposição do fonte original no site, mas não torna o JavaScript secreto.
- `vercel.json` define CSP, `nosniff`, proibição de iframe externo, política de referência e restrição de câmera/microfone. Scripts limitados à própria origem; conexão externa à API indicada; imagens dos mapas permitidas. Estilos inline continuam necessários aos estilos dinâmicos/Leaflet. A configuração segue os [cabeçalhos da Vercel](https://vercel.com/docs/project-configuration/vercel-json#headers).
- Sessão de funcionários fica somente em memória, token no cabeçalho Authorization, PIN somente no corpo do login, sem cookies ou persistência no navegador. O painel não consulta dados antes de existir sessão válida da API. A API também precisa verificar o token.
- Links do Pitch aceitam apenas HTTPS do YouTube, sem credenciais ou hosts parecidos. Não há links ou credenciais inventados.
- `.env` locais, chaves, wallets, dependências, builds e contextos privados excluídos do versionamento/empacotamento novo. A configuração pública do ZIP aceita somente modo e URL da API.
- Servidores de desenvolvimento/prévia escutam em 127.0.0.1 por padrão.

## Pendências críticas no backend publicado

Foram encontrados uma credencial fixa no código público Java, listagem anônima de solicitações com nome/origem/destino e controllers que devolvem `e.getMessage()` em falhas. Não são problemas corrigíveis escondendo o código React.

A credencial deve ser **trocada no banco**, pois já pode existir em commits e cópias. Preparada [correção Java testada](../support/backend-security/README.md): variáveis privadas sem valores padrão, mensagens de erro genéricas, proteção da listagem e autenticação do PIN de funcionários. Não foi aplicada remotamente porque não há permissão de escrita no repositório do backend.

O PIN é armazenado como hash PBKDF2-HMAC-SHA256 com salt e 600.000 iterações, compatível com a [orientação OWASP para PBKDF2](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html). Sessões têm token aleatório de 256 bits, hash no servidor, expiração de 30 minutos e logout. O limite por origem precisa ser validado no proxy do Render. Um PIN compartilhado não substitui contas individuais com papéis para uma operação real.

## Dependências

Vitest atualizado de 3 para 5 e TypeScript ESLint atualizado; removida a cadeia crítica de `tinypool`. Tailwind e seu plugin são dependências de desenvolvimento. Auditoria do pacote usado em produção: **zero vulnerabilidades conhecidas** na consulta, sem equivaler a uma garantia geral.

A auditoria completa ainda sinaliza **11 avisos altos de ferramentas de desenvolvimento**, propagados pela dependência `picomatch` (última versão consultada 4.0.7). O registro não ofereceu versão corrigida. Não foi aplicado downgrade incompatível nem ignorado o alerta com `--force`. Referência: [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf). Manter os servidores locais restritos, não processar repositórios/padrões não confiáveis e atualizar quando houver correção compatível. Não houve auditoria completa das dependências Java.

## Limites da conclusão

Não afirmar que o sistema está totalmente seguro enquanto a credencial exposta não for substituída, o backend corrigido não estiver publicado e o fluxo autorizado não tiver sido testado no Render. A operação permanece acadêmica, com dados fictícios. Não há autenticação real de clientes, armazenamento privado de documentos, cobrança ou atendimento de emergência.
