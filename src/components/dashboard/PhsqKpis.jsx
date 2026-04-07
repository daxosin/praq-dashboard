import { useTable } from '../../hooks/useSupabase'
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { AlertTriangle, Bell, Clock, FileText } from 'lucide-react'

function NotifBadge({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
      <Icon size={14} style={{ color }} />
      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="text-sm font-extrabold ml-auto" style={{ fontFamily: 'Montserrat, sans-serif', color }}>
        {value}
      </span>
    </div>
  )
}

export default function PhsqKpis() {
  const { data: snapshots, loading } = useTable('phsq_snapshots', {
    select: 'donnees,notifications,date_scraping',
    order: { col: 'date_scraping', asc: false }
  })

  const latest = snapshots?.[0]

  const notifs = useMemo(() => {
    if (!latest?.notifications) return null
    return latest.notifications
  }, [latest])

  const chartData = useMemo(() => {
    if (!latest?.donnees?.indicateurs) return []
    const ind = latest.donnees.indicateurs
    const moisKeys = ['jan', 'fev', 'mar', 'avr', 'mai', 'jun', 'jul', 'aou', 'sep', 'oct', 'nov', 'dec']
    const moisLabels = ['Jan', 'FÃ©v', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'AoÃ»', 'Sep', 'Oct', 'Nov', 'DÃ©c']

    return moisKeys
      .map((key, i) => {
        const dysf = ind.dysfonctionnements?.[key]
        const err = ind.erreurs_dispensation?.[key]
        if (dysf == null && err == null) return null
        return {
          mois: moisLabels[i],
          Dysfonctionnements: dysf ?? 0,
          'Erreurs dispensation': err ?? 0,
        }
      })
      .filter(Boolean)
  }, [latest])

  const kpiSummary = useMemo(() => {
    if (!latest?.donnees?.indicateurs) return null
    const ind = latest.donnees.indicateurs
    return {
      dysf_avg: ind.dysfonctionnements?.moyenne ?? 'â',
      err_avg: ind.erreurs_dispensation?.moyenne ?? 'â',
      ecor_avg: ind.ecor?.moyenne ?? 'â',
      ruptures_avg: ind.ruptures?.moyenne ?? 'â',
    }
  }, [latest])

  if (loading) return null

  const lastDate = latest?.date_scraping
    ? new Date(latest.date_scraping).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'â'

  return (
    <div className="mb-5">
      {/* Section header */}
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          PHSQ â Indicateurs qualitÃ© terrain
        </h3>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          Dernier scraping : {lastDate}
        </span>
      </div>

      {/* Notification counters */}
      {notifs && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <NotifBadge
            icon={AlertTriangle}
            label="Dysf. non lus"
            value={notifs.dysfonctionnements_non_lus ?? 0}
            color="var(--red)"
          />
          <NotifBadge
            icon={Clock}
            label="TÃ¢ches en retard"
            value={notifs.taches_en_retard ?? 0}
            color="var(--amber)"
          />
          <NotifBadge
            icon={FileText}
            label="CR Ã  rÃ©diger"
            value={notifs.cr_a_rediger ?? 0}
            color="var(--blue)"
          />
        </div>
      )}

      {/* Main content: chart + summary */}
      <div className="grid grid-cols-3 gap-3">
        {/* Chart: 2 cols */}
        <div className="col-span-2 rounded-lg p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
            Dysfonctionnements & Erreurs â 2026
          </div>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={2}>
                <XAxis dataKey="mois" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={25} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'var(--text-muted)' }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Dysfonctionnements" fill="var(--red)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Erreurs dispensation" fill="var(--amber)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary cards: 1 col */}
        <div className="flex flex-col gap-2">
          <SummaryCard label="Dysf. / mois" value={kpiSummary?.dysf_avg} color="var(--red)" />
          <SummaryCard label="Err. disp. / mois" value={kpiSummary?.err_avg} color="var(--amber)" />
          <SummaryCard label="ECOR" value={kpiSummary?.ecor_avg} color="var(--green)" />
          <SummaryCard label="Ruptures" value={kpiSummary?.ruptures_avg} color="var(--green)" />
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, color }) {
  return (
    <div className="rounded-lg p-3 flex-1 flex flex-col justify-center" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="text-xl font-extrabold" style={{ fontFamily: 'Montserrat, sans-serif', color }}>
        {value ?? 'â'}
      </div>
      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>moy. mensuelle</div>
    </div>
  )
}
