import { NavLink } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import {
  LayoutDashboard, FileText, AlertTriangle, ClipboardCheck,
  Shield, Wrench, GraduationCap, Truck, MessageSquare,
  Bell, PenLine, Sun, Moon
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/sops', icon: FileText, label: 'SOPs & Documents' },
  { to: '/capa', icon: AlertTriangle, label: 'CAPA' },
  { to: '/audits', icon: ClipboardCheck, label: 'Audits' },
  { to: '/risques', icon: Shield, label: 'Risques' },
  { to: '/equipements', icon: Wrench, label: 'Equipements' },
  { to: '/formations', icon: GraduationCap, label: 'Formations' },
  { to: '/fournisseurs', icon: Truck, label: 'Fournisseurs' },
  { to: '/reclamations', icon: MessageSquare, label: 'Reclamations' },
  { to: '/vigilances', icon: Bell, label: 'Vigilances' },
]

export default function Sidebar() {
  const { dark, toggle } = useTheme()

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-[220px] flex flex-col z-50"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5 text-xl font-extrabold tracking-tight"
        style={{ fontFamily: 'Montserrat, sans-serif', color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}
      >
        PRAQ
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium transition-all border-l-[3px] ${
                isActive
                  ? 'border-l-[var(--accent)] text-[var(--text)]'
                  : 'border-l-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`
            }
            style={({ isActive }) => isActive ? { background: 'var(--accent-dim)' } : {}}
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="mx-4 my-3" style={{ borderTop: '1px solid var(--border)' }} />

        <NavLink
          to="/declaration"
          className={({ isActive }) =>
            `flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium transition-all border-l-[3px] ${
              isActive
                ? 'border-l-[var(--accent)] text-[var(--text)]'
                : 'border-l-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
            }`
          }
          style={({ isActive }) => isActive ? { background: 'var(--accent-dim)' } : {}}
        >
          <PenLine size={16} />
          <span>Declaration terrain</span>
        </NavLink>
      </nav>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="flex items-center gap-3 px-5 py-4 text-[13px] font-medium cursor-pointer transition-colors"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent', border: 'none', borderTop: '1px solid var(--border)' }}
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
        <span>{dark ? 'Mode jour' : 'Mode nuit'}</span>
      </button>
    </aside>
  )
}
