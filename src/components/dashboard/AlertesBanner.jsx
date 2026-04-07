import { AlertTriangle } from 'lucide-react'
import { useTable } from '../../hooks/useSupabase'

export default function AlertesBanner() {
  const { data: sops } = useTable('sops', {
    select: 'id,statut',
    filter: [['statut', 'eq', 'expiree']]
  })

  const { data: equipements } = useTable('equipements', {
    select: 'id,statut',
    filter: [['statut', 'eq', 'hors_service']]
  })

  const alerts = []
  if (sops.length > 0) alerts.push(`${sops.length} SOP${sops.length > 1 ? 's' : ''} expiree${sops.length > 1 ? 's' : ''}`)
  if (equipements.length > 0) alerts.push(`${equipements.length} equipement${equipements.length > 1 ? 's' : ''} hors service`)

  const total = alerts.length
  if (total === 0) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg mb-5 text-[13px]"
        style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent)', color: 'var(--accent)' }}
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          â
        </div>
        <span className="font-semibold">Aucune alerte â SMQ nominal</span>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg mb-5 text-[13px]"
      style={{ background: 'rgba(255,68,102,0.1)', border: '1px solid rgba(255,68,102,0.2)' }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0"
        style={{ background: 'var(--red)', color: 'var(--bg)' }}
      >
        <AlertTriangle size={14} />
      </div>
      <div>
        <span className="font-bold" style={{ color: 'var(--red)' }}>{total} alerte{total > 1 ? 's' : ''}</span>
        {' â '}
        {alerts.join(' Â· ')}
      </div>
    </div>
  )
}
