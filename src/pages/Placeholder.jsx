import { useLocation } from 'react-router-dom'
import { Construction } from 'lucide-react'

export default function Placeholder() {
  const { pathname } = useLocation()
  const name = pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Construction size={48} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
      <h2 className="text-lg font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Module {name}
      </h2>
      <p className="text-[14px] max-w-md" style={{ color: 'var(--text-muted)' }}>
        Ce module sera disponible en Phase 2. Les donnees sont deja en base Supabase â
        le frontend sera construit progressivement.
      </p>
    </div>
  )
}
