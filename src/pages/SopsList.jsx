import { useState, useMemo } from 'react'
import { useTable, useCrud } from '../hooks/useSupabase'
import { Search, Filter, ChevronDown, ChevronUp, FileText } from 'lucide-react'

const statusLabels = {
  en_vigueur: { label: 'En vigueur', color: 'var(--green)' },
  en_revision: { label: 'En revision', color: 'var(--amber)' },
  brouillon: { label: 'Brouillon', color: 'var(--blue)' },
  expiree: { label: 'Expiree', color: 'var(--red)' },
}

export default function SopsList() {
  const { data: sops, loading, refetch } = useTable('sops', {
    select: 'id,code,titre,version,statut,date_revision,processus_id,processus(nom,code)',
    order: { col: 'code', asc: true }
  })

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortCol, setSortCol] = useState('code')
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = useMemo(() => {
    let list = [...sops]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.code?.toLowerCase().includes(q) ||
        s.titre?.toLowerCase().includes(q) ||
        s.processus?.nom?.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter(s => s.statut === statusFilter)
    }
    list.sort((a, b) => {
      const va = a[sortCol] || ''
      const vb = b[sortCol] || ''
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
    return list
  }, [sops, search, statusFilter, sortCol, sortAsc])

  const stats = useMemo(() => {
    const total = sops.length
    const ok = sops.filter(s => s.statut === 'en_vigueur').length
    return { total, ok, pct: total ? Math.round((ok / total) * 100) : 0 }
  }, [sops])

  const toggleSort = (col) => {
    if (sortCol === col) setSortAsc(!sortAsc)
    else { setSortCol(col); setSortAsc(true) }
  }

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return null
    return sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
  }

  if (loading) return <div style={{ color: 'var(--text-muted)' }}>Chargement...</div>

  return (
    <div className="max-w-[1200px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            SOPs & Documents
          </h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {stats.total} SOPs â {stats.pct}% conformes ({stats.ok} en vigueur)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Rechercher par code, titre ou processus..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-[13px] outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-[13px] cursor-pointer outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          <option value="all">Tous les statuts</option>
          <option value="en_vigueur">En vigueur</option>
          <option value="en_revision">En revision</option>
          <option value="brouillon">Brouillon</option>
          <option value="expiree">Expiree</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full text-[13px]" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {[
                { key: 'code', label: 'Code' },
                { key: 'titre', label: 'Titre' },
                { key: 'version', label: 'Version' },
                { key: 'statut', label: 'Statut' },
                { key: 'processus', label: 'Processus' },
                { key: 'date_revision', label: 'Revision' },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-[11px] cursor-pointer select-none"
                  style={{ color: 'var(--text-muted)', borderBottom: '2px solid var(--border)' }}
                >
                  <span className="flex items-center gap-1">
                    {col.label} <SortIcon col={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(sop => {
              const st = statusLabels[sop.statut] || { label: sop.statut, color: 'var(--text-muted)' }
              return (
                <tr key={sop.id} className="hover:opacity-90" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-4 py-3 font-mono font-semibold" style={{ color: 'var(--accent)' }}>
                    {sop.code}
                  </td>
                  <td className="px-4 py-3">{sop.titre}</td>
                  <td className="px-4 py-3 text-center">{sop.version}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{ background: `${st.color}18`, color: st.color }}
                    >
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    {sop.processus?.nom || 'â'}
                  </td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    {sop.date_revision ? new Date(sop.date_revision).toLocaleDateString('fr-FR') : 'â'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[13px]" style={{ color: 'var(--text-muted)' }}>
            Aucune SOP trouvee
          </div>
        )}
      </div>
      <div className="mt-3 text-[12px]" style={{ color: 'var(--text-muted)' }}>
        {filtered.length} resultat{filtered.length > 1 ? 's' : ''}
      </div>
    </div>
  )
}
