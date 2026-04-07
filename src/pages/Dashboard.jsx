import AlertesBanner from '../components/dashboard/AlertesBanner'
import ScoreSmq from '../components/dashboard/ScoreSmq'
import KpiCards from '../components/dashboard/KpiCards'
import ProcessHealth from '../components/dashboard/ProcessHealth'
import TrendCharts from '../components/dashboard/TrendCharts'
import PhsqKpis from '../components/dashboard/PhsqKpis'

export default function Dashboard() {
  const today = new Date()
  const dateStr = today.toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  const week = `S${Math.ceil(((today - new Date(today.getFullYear(), 0, 1)) / 86400000 + 1) / 7)}`

  return (
    <div className="max-w-[1200px]">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Tableau de bord
        </h1>
        <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
          {dateStr} â {week}
        </span>
      </div>

      {/* Alerts */}
      <AlertesBanner />

      {/* Score + KPIs row */}
      <div className="flex gap-4 mb-5">
        <ScoreSmq />
        <KpiCards />
      </div>

      {/* PHSQ KPIs â donnÃ©es terrain */}
      <PhsqKpis />

      {/* Process Health */}
      <ProcessHealth />

      {/* Trend Charts */}
      <TrendCharts />
    </div>
  )
}
