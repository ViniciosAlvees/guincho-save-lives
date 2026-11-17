import { ArrowUpRight, PlayCircle, Video } from 'lucide-react'
import { PageHero } from '../components/UI'
import { projectVideos, youtubeLink } from '../data/pitch'

export function PitchPage() {
  return <><PageHero eyebrow="NOSSA APRESENTAÇÃO" title="Pitch." description="Conheça a proposta do Guincho Save Lives e acompanhe a demonstração da aplicação."/><div className="page-wrap grid gap-6 py-12 md:grid-cols-2">
    {projectVideos.map(video => {
      const link = youtubeLink(video.url)
      return <section key={video.id} className="surface flex flex-col p-6 sm:p-9"><div className="flex h-40 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/5"><PlayCircle className="text-cyan" size={60} strokeWidth={1.25} aria-hidden="true"/></div><p className="eyebrow mt-7">{video.duration}</p><h2 className="mt-3 text-2xl font-bold">{video.title}</h2><p className="mt-4 text-slate-300">{video.description}</p><div className="mt-auto pt-7">{link ? <a href={link} target="_blank" rel="noopener noreferrer" className="btn-primary"><Video size={18}/> Assistir no YouTube <ArrowUpRight size={17}/><span className="sr-only"> (nova aba)</span></a> : <p className="rounded-xl border border-white/10 p-4 text-sm text-slate-400">O vídeo será disponibilizado aqui em breve.</p>}</div></section>
    })}
  </div></>
}
