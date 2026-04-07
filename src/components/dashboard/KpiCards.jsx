import { useTable } from '../../hooks/useSupabase'
import { useMemo } from 'react'

function KpiCard({ label, value, sub, color }) {
  return (
    <div className="rounded-lg p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="text-2xl font-extrabold" style={{ fontFamily: 'Montserrat, sans-serif', color }}>
        {value}
      </div>
      <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
        {sub}
      </div>
    </div>
  )
}

export default function KpiCards() {
  const { data: sops } = useTable('sops', { select: 'statut' })
  const { data: equipements } = useTable('equipements', { select: 'statut' })
  const { data: audits } = useTable('audits', { select: 'statut' })
  const { data: risques } = useTable('risques', { select: 'niveau' })

  const sopStats = useMemo(() => {
    const total = sops.length
    const ok = sops.filter(s => s.statut === 'en_vigueur').length
    const pct = total ? Math.round((ok / total) * 100) : 0
    return { pct, ok, total }
  }, [sops])

  const eqStats = useMemo(() => {
    const total = equipements.length
    const ok = equipements.filter(e => e.statut === 'conforme').length
    const pct = total ? Math.round((ok / total) * 100) : 0
    return { pct, ok, total }
  }, [equipements])

  const auditStats = useMemo(() => {
    const total = audits.length
    const done = audits.filter(a => a.statut === 'realise').length
    return { done, total }
  }, [audits])

  const risqueStats = useMemo(() => {
    const critiques = risques.filter(r => r.niveau === 'critique').length
    const eleves = risques.filter(r => r.niveau === 'eleve').length
    return { critiques, eleves, total: risques.length }
  }, [risques])

  return (
    <div className="grid grid-cols-4 gap-3 flex-1">
      <KpiCard
        label="SOPs conformes"
        value={`${sopStats.pct}%`}
        sub={`${sopStats.ok}/${sopStats.total} a jour`}
        color={sopStats.pct >= 80 ? 'var(--green)' : sopStats.pct >= 60 ? 'var(--amber)' : 'var(--red)'}
      />
      <KpiCard
        label="Equipements OK"
        value={`${eqStats.pct || 'â'}%`}
        sub={eqStats.total ? `${eqStats.ok}/${eqStats.total} conformes` : 'Aucune donnee'}
        color={eqStats.pct >= 80 ? 'var(--green)' : 'var(--amber)'}
      />
      <KpiCard
        label="Audits realises"
        value={auditStats.total ? `${auditStats.done}/${auditStats.total}` : 'â'}
        sub={auditStats.total ? `${Math.round((auditStats.done / auditStats.total) * 100)}% du programme` : 'Aucun audit'}
        color="var(--blue)"
      />
      <KpiCard
        label="Risques critiques"
        value={risqueStats.total ? `${risqueStats.critiques}` : 'â'}
        sub={risqueStats.total ? `${risqueStats.eleves} eleves / ${risqueStats.total} total` : 'Aucune donnee'}
        color={risqueStats.critiques > 0 ? 'var(--red)' : 'var(--green)'}
      />
    </div>
  )
}
