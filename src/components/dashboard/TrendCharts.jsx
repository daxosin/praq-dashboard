import { useTable } from '../../hooks/useSupabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'

// Placeholder data until kpi_history is populated
const placeholderSmq = [
  { mois: 'Mai', score: 62 }, { mois: 'Jun', score: 65 }, { mois: 'Jul', score: 63 },
  { mois: 'Aou', score: 68 }, { mois: 'Sep', score: 70 }, { mois: 'Oct', score: 67 },
  { mois: 'Nov', score: 72 }, { mois: 'Dec', score: 74 }, { mois: 'Jan', score: 71 },
  { mois: 'Fev', score: 73 }, { mois: 'Mar', score: 76 }, { mois: 'Avr', score: 78 },
]

export default function TrendCharts() {
  const { data: history } = useTable('kpi_history', {
    select: 'date_calcul,score_global',
    order: { col: 'date_calcul', asc: true }
  })

  const chartData = useMemo(() => {
    if (history.length > 0) {
      return history.slice(-12).map(h => ({
        mois: new Date(h.date_calcul).toLocaleDateString('fr-FR', { month: 'short' }),
        score: h.score_global
      }))
    }
    return placeholderSmq
  }, [history])

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-[13px] font-semibold mb-2.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Score SMQ â 12 mois
        </h3>
        <div className="rounded-lg p-3 h-[160px]" style={{ background: 'var(--surface)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="mois" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--text-muted)' }}
              />
              <Bar dataKey="score" fill="var(--accent)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <h3 className="text-[13px] font-semibold mb-2.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          SOPs par statut
        </h3>
        <SopsByStatus />
      </div>
    </div>
  )
}

function SopsByStatus() {
  const { data: sops } = useTable('sops', { select: 'statut' })

  const chartData = useMemo(() => {
    const counts = { en_vigueur: 0, en_revision: 0, brouillon: 0, expiree: 0 }
    for (const s of sops) counts[s.statut] = (counts[s.statut] || 0) + 1
    return [
      { statut: 'En vigueur', count: counts.en_vigueur, fill: 'var(--green)' },
      { statut: 'En revision', count: counts.en_revision, fill: 'var(--amber)' },
      { statut: 'Brouillon', count: counts.brouillon, fill: 'var(--blue)' },
      { statut: 'Expiree', count: counts.expiree, fill: 'var(--red)' },
    ]
  }, [sops])

  return (
    <div className="rounded-lg p-3 h-[160px]" style={{ background: 'var(--surface)' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical">
          <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis dataKey="statut" type="category" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={80} />
          <Tooltip
            contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="count" radius={[0, 3, 3, 0]}>
            {chartData.map((entry, i) => (
              <Bar key={i} dataKey="count" fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
