import { ArrowRight, Github, HelpCircle, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/UI'
import { projectLinks } from '../data/project'

export function Contact() {
  return <>
    <PageHero eyebrow="FALE COM A EQUIPE" title="Vamos conversar?" description="Dúvidas sobre o projeto, sugestões de melhoria e relatos de problemas podem ser acompanhados no GitHub."/>
    <div className="page-wrap grid gap-6 py-16 lg:grid-cols-2">
      <section className="surface p-7 sm:p-9" aria-labelledby="contact-title"><Github className="text-cyan" size={32} aria-hidden="true"/><h2 id="contact-title" className="mt-5 text-2xl font-bold">Canal público do projeto</h2><p className="mt-4 text-slate-300">Use a área de Issues do repositório para consultar dúvidas ou registrar uma sugestão. Para publicar, é necessário ter uma conta no GitHub. O acesso ao canal ocorre em uma nova aba.</p><a href={projectLinks.contact} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">Abrir canal no GitHub <ArrowRight size={18}/><span className="sr-only"> (nova aba)</span></a><p className="mt-5 text-sm leading-relaxed text-slate-400">As publicações são públicas. Não inclua CPF, senha, documentos, telefone ou endereço. A equipe ainda não definiu prazo de resposta. Este canal é sobre o projeto acadêmico e não solicita guincho ou atendimento de emergência.</p></section>
      <div className="space-y-6"><section className="surface p-7"><HelpCircle className="text-lime" aria-hidden="true"/><h2 className="mt-4 text-xl font-bold">Antes de enviar uma dúvida</h2><p className="mt-3 text-slate-300">Veja quais recursos estão disponíveis e entenda a diferença entre a API e a demonstração local.</p><Link to="/faq" className="btn-secondary mt-5">Consultar perguntas frequentes</Link></section><section className="surface p-7"><Users className="text-cyan" aria-hidden="true"/><h2 className="mt-4 text-xl font-bold">Conheça os integrantes</h2><p className="mt-3 text-slate-300">A página da equipe reúne identificação e perfis profissionais dos integrantes.</p><Link to="/integrantes" className="btn-secondary mt-5">Ver equipe</Link></section></div>
    </div>
  </>
}
