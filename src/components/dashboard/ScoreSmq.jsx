import { useTable } from '../../hooks/useSupabase'
import { useMemo } from 'react'

export default function ScoreSmq() {
  const { data: sops, loading: l1 } = useTable('sops', { select: 'statut' })
  const { data: config } = useTable('smq_config', { select: 'composante,poids' })

  // Calculate SOPs score (main component for now)
  const score = useMemo(() => {
    if (sops.length === 0) return 0
    const aJour = sops.filter(s => s.statut === 'en_vigueur').length
    const sopScore = Math.round((aJour / sops.length) * 100)
    // For MVP, SOPs score is the main driver. Other components will be added as data flows in.
    // Weighted: SOPs 25%, rest defaults to 75 (neutral) for now
    const otherDefault = 75
    const weights = { sops: 0.25, capa: 0.20, habilitations: 0.15, equipements: 0.15, audits: 0.10, reclamations: 0.10, risques: 0.05 }
    return Math.round(
      sopScore * weights.sops +
      otherDefault * (1 - weights.sops)
    )
  }, [sops])

  const color = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--amber)' : 'var(--red)'

  return (
    <div
      className="rounded-xl p-5 text-center flex flex-col justify-center min-w-[180px]"
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}30`
      }}
    >
      <div className="text-xs uppercase tracking-widest font-semibold" style={{ color }}>
        Score SMQ
      </div>
      <div
        className="text-5xl font-extrabold leading-none my-1"
        style={{ fontFamily: 'Montserrat, sans-serif', color }}
      >
        {l1 ? 'â' : score}
      </div>
      <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        /100
      </div>
    </div>
  )
}
