import { Bolt, Clock3, MapPin, ShieldCheck, Users } from 'lucide-react'
import { Notice, PageHero } from '../components/UI'
import { impactIndicators } from '../data/project'

export function About() {
  return <>
    <PageHero eyebrow="A SOLUÇÃO" title="Tecnologia a serviço da mobilidade e das pessoas." description="Uma proposta CitizenTech para facilitar o acesso à assistência veicular e dar visibilidade aos profissionais de cada região."/>
    <div className="page-wrap space-y-12 py-16">
      <section className="grid gap-5 md:grid-cols-2" aria-label="Problema e proposta">
        {[
          [Clock3, 'O problema', 'Uma pane pode interromper o trabalho e os deslocamentos de uma família. Encontrar um prestador, entender o serviço e explicar o pedido em canais dispersos pode aumentar a incerteza. Essa hipótese será validada com usuários; ainda não realizamos pesquisa de campo.'],
          [Bolt, 'Nossa proposta', 'Reunir profissionais por cidade e região, apresentar o tipo de guincho e o preço inicial e organizar os dados de uma solicitação. A pessoa consegue comparar informações antes de dar o próximo passo.'],
          [Users, 'Quem pode se beneficiar', 'Motoristas e famílias que precisam localizar assistência veicular, além de guincheiros autônomos e pequenos prestadores que desejam apresentar seus serviços. A avaliação de acessibilidade deverá incluir pessoas com diferentes níveis de familiaridade digital.'],
          [ShieldCheck, 'O que está disponível', 'O protótipo oferece busca, cadastro profissional e registro de pedidos pela API Java. Contratação, verificação de documentos, pagamentos, chat e acompanhamento ainda dependem de desenvolvimento. Este projeto acadêmico não aciona atendimento de emergência.'],
        ].map(([Icon, title, description]) => { const Component = Icon as typeof Users; return <article key={title as string} className="surface p-7"><Component className="text-lime" size={30} aria-hidden="true"/><h2 className="mt-5 text-xl font-bold">{title as string}</h2><p className="mt-3 text-slate-300">{description as string}</p></article> })}
      </section>

      <section aria-labelledby="ecosystem-title">
        <p className="eyebrow">CIDADÃO NO CENTRO</p><h2 id="ecosystem-title" className="mt-3 text-2xl font-bold">Quem participa dessa conexão</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {[
            ['Motoristas', 'Informam a necessidade, comparam os serviços cadastrados e avaliam a clareza e a facilidade da experiência.'],
            ['Profissionais de guincho', 'Apresentam região, tipo de serviço e preço inicial. Um piloto futuro deverá validar a adesão e a atualização dessas informações.'],
            ['Equipe e parceiros futuros', 'A equipe mantém o protótipo. Oficinas e organizações locais poderão apoiar testes mediante acordo; nenhuma parceria externa está confirmada.'],
          ].map(([title, text]) => <article key={title} className="surface p-6"><MapPin className="text-cyan" aria-hidden="true"/><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-300">{text}</p></article>)}
        </div>
      </section>

      <section aria-labelledby="sdg-title">
        <p className="eyebrow">ALINHAMENTO GLOBAL</p><h2 id="sdg-title" className="mt-3 text-2xl font-bold">ODS e contribuição proposta</h2>
        <p className="mt-4 max-w-3xl text-slate-300">O vínculo com as metas é uma interpretação da proposta, com contribuição potencial e parcial. Os indicadores abaixo são próprios do projeto e não substituem os indicadores oficiais da ONU.</p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <article className="surface p-7"><p className="eyebrow">ODS 9 • META 9.3</p><h3 className="mt-3 text-xl font-bold">Pequenos prestadores com mais visibilidade</h3><p className="mt-4 text-slate-300">A meta inclui integrar pequenos negócios a cadeias de valor e mercados. O projeto pretende contribuir para essa dimensão ao facilitar a descoberta de guincheiros locais. A proposta não oferece crédito nem comprova avanço nos indicadores oficiais.</p><a className="mt-5 inline-block text-sm font-semibold text-cyan underline underline-offset-4" href="https://sdgs.un.org/goals/goal9#targets_and_indicators" target="_blank" rel="noopener noreferrer">Consultar meta 9.3 na ONU (nova aba)</a></article>
          <article className="surface p-7"><p className="eyebrow">ODS 11 • META 11.2</p><h3 className="mt-3 text-xl font-bold">Apoio à mobilidade e à segurança viária</h3><p className="mt-4 text-slate-300">A meta trata de transporte seguro, acessível e sustentável. A contribuição pretendida é indireta: organizar o acesso à assistência diante de uma pane. Ainda será necessário avaliar essa utilidade com os cidadãos; o protótipo não demonstra redução de acidentes nem ampliação do transporte público.</p><a className="mt-5 inline-block text-sm font-semibold text-cyan underline underline-offset-4" href="https://sdgs.un.org/goals/goal11#targets_and_indicators" target="_blank" rel="noopener noreferrer">Consultar meta 11.2 na ONU (nova aba)</a></article>
        </div>
      </section>

      <section aria-labelledby="impact-title">
        <p className="eyebrow">COMO VAMOS VALIDAR</p><h2 id="impact-title" className="mt-3 text-2xl font-bold">Impacto a medir, sem resultados inventados</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">{impactIndicators.map(indicator => <article key={indicator.name} className="surface p-6"><h3 className="text-lg font-bold">{indicator.name}</h3><p className="mt-3 text-sm leading-relaxed text-slate-300"><strong>Indicador:</strong> {indicator.measurement}</p><p className="mt-3 text-sm leading-relaxed text-slate-400"><strong>Coleta proposta:</strong> {indicator.collection}</p></article>)}</div>
        <div className="mt-5"><Notice>Os testes de impacto ainda não foram realizados. O plano é estabelecer uma linha de base, testar tarefas com consentimento, comparar os resultados e corrigir barreiras antes de ampliar o piloto. Serão usados dados fictícios e registros agregados.</Notice></div>
      </section>

      <section className="surface p-7" aria-labelledby="inclusion-title"><h2 id="inclusion-title" className="text-2xl font-bold">Acesso, privacidade e limites</h2><p className="mt-4 text-slate-300">A busca por cidade e região dispensa permissão de localização. Rótulos, foco visível, navegação por teclado e adaptação a celular, tablet e desktop apoiam o uso do protótipo. Quando o servidor falha, a interface informa o problema e permite tentar novamente. Isso não garante funcionamento sem internet ou conformidade integral de acessibilidade.</p><p className="mt-4 text-slate-300">As próximas etapas são estabilizar a API, validar a experiência com usuários e pequenos prestadores e planejar autenticação e proteção dos dados antes de qualquer operação real.</p></section>
    </div>
  </>
}
