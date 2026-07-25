import KAIChat from '@/componentes/KAIChat'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white p-4">
      <h1 className="text-3xl text-[#00f5ff] font-bold text-center">K-AI OMEGA PRIME v5</h1>
      <p className="text-[#00f5ff] text-center mb-6">NÚCLEO COGNITIVO DO ECOSSISTEMA KORVIL</p>
      <KAIChat />
    </main>
  )
}
