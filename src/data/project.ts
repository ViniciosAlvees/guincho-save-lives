export const projectLinks = {
  repository: 'https://github.com/ViniciosAlvees/guincho-save-lives',
  contact: 'https://github.com/ViniciosAlvees/guincho-save-lives/issues',
  frontend: 'https://gincho-save-lives.vercel.app/',
  backend: 'https://guincho-save-lives-backend.onrender.com',
} as const

export const impactIndicators = [
  { name: 'Facilidade para encontrar ajuda', measurement: 'Tempo mediano entre abrir a busca e localizar um perfil adequado, comparando a plataforma com a busca habitual.', collection: 'Teste de usabilidade com tarefas fictícias e consentimento.' },
  { name: 'Clareza ao fazer um pedido', measurement: 'Percentual de participantes que concluem o formulário sem ajuda e quantidade de erros por tarefa.', collection: 'Observação de testes, sem registrar nomes, endereços ou senhas.' },
  { name: 'Visibilidade dos pequenos prestadores', measurement: 'Quantidade de profissionais participantes por região e percentual de perfis encontrados durante os testes.', collection: 'Piloto com adesão voluntária dos prestadores, após estabilizar a API.' },
  { name: 'Acesso em diferentes dispositivos', measurement: 'Conclusão das mesmas tarefas no celular, tablet e desktop, incluindo navegação por teclado.', collection: 'Testes nas três resoluções da entrega e avaliação de barreiras de uso.' },
] as const
