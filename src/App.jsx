import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import Layout from './components/ui/Layout'
import Dashboard from './pages/Dashboard'
import SopsList from './pages/SopsList'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/sops" element={<SopsList />} />
            <Route path="/capa" element={<Placeholder />} />
            <Route path="/audits" element={<Placeholder />} />
            <Route path="/risques" element={<Placeholder />} />
            <Route path="/equipements" element={<Placeholder />} />
            <Route path="/formations" element={<Placeholder />} />
            <Route path="/fournisseurs" element={<Placeholder />} />
            <Route path="/reclamations" element={<Placeholder />} />
            <Route path="/vigilances" element={<Placeholder />} />
            <Route path="/declaration" element={<Placeholder />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
