import { useTable } from '../../hooks/useSupabase'
import { useMemo } from 'react'

// Map processus to health based on linked SOPs
export default function ProcessHealth() {
  const { data: processus } = useTable('processus', {
    select: 'id,nom,code',
    order: { col: 'code', asc: true }
  })

  const { data: sops } = useTable('sops', {
    select: 'processus_id,statut'
  })

  const healthMap = useMemo(() => {
    const map = {}
    for (const p of processus) {
      const linked = sops.filter(s => s.processus_id === p.id)
      const total = linked.length
      if (total === 0) { map[p.id] = 'ok'; continue }
      const expired = linked.filter(s => s.statut === 'expiree').length
      const revision = linked.filter(s => s.statut === 'en_revision').length
      if (expired > 0) map[p.id] = 'danger'
      else if (revision > 0) map[p.id] = 'warn'
      else map[p.id] = 'ok'
    }
    return map
  }, [processus, sops])

  const cellStyles = {
    ok: { background: 'var(--accent-dim)', color: 'var(--green)', border: '1px solid transparent' },
    warn: { background: 'rgba(255,170,51,0.12)', color: 'var(--amber)', border: '1px solid transparent' },
    danger: { background: 'rgba(255,68,102,0.12)', color: 'var(--red)', border: '1px solid transparent' },
  }

  return (
    <div className="mb-5">
      <h3 className="text-[13px] font-semibold mb-2.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        Sante des 16 processus
      </h3>
      <div className="grid grid-cols-8 gap-1.5">
        {processus.map(p => (
          <div
            key={p.id}
            className="py-2 px-1 rounded-md text-center text-[10px] font-semibold"
            style={cellStyles[healthMap[p.id] || 'ok']}
            title={p.code}
          >
            {p.nom.length > 12 ? p.nom.slice(0, 11) + '.' : p.nom}
          </div>
        ))}
      </div>
    </div>
  )
}
