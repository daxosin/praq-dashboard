# PRAQ Dashboard â Pharma78pure

Cockpit qualite ISO 9001 / BPP pour la pharmacie H8 Pharma (Pharma78pure).

## Stack

- **Frontend** : React 19 + Vite 8 + Tailwind CSS 4
- **Backend** : Supabase (PostgreSQL)
- **Charts** : Recharts 3
- **Icones** : Lucide React
- **Deploiement** : Vercel (production) / Docker + Nginx (self-hosted)

## Architecture

```
src/
âââ pages/
â   âââ Dashboard.jsx        # Page d'accueil â score SMQ, KPIs, PHSQ, processus
â   âââ SopsList.jsx         # Liste des SOPs avec recherche/filtres/tri
â   âââ Placeholder.jsx      # Placeholder modules Phase 2
âââ components/
â   âââ dashboard/
â   â   âââ AlertesBanner.jsx   # Alertes systeme (SOPs expirees, equipements HS)
â   â   âââ ScoreSmq.jsx        # Score SMQ composite /100 (ponderation 7 axes)
â   â   âââ KpiCards.jsx        # 4 cartes KPI (SOPs, equipements, audits, risques)
â   â   âââ PhsqKpis.jsx        # KPIs terrain PHSQ (dysfonctionnements, erreurs, ECOR)
â   â   âââ ProcessHealth.jsx   # Matrice sante des 16 processus
â   â   âââ TrendCharts.jsx     # Graphes tendance SMQ 12 mois + SOPs par statut
â   âââ ui/
â       âââ Layout.jsx          # Layout principal sidebar + content
â       âââ Sidebar.jsx         # Navigation laterale 10 modules + theme toggle
âââ hooks/
â   âââ useSupabase.jsx      # Hook generique Supabase (useTable, useCrud)
â   âââ useTheme.jsx         # Dark/light mode
âââ lib/
    âââ supabase.js          # Client Supabase
```

## Modules (12 onglets)

| Module | Statut | Route |
|--------|--------|-------|
| Tableau de bord | Live | `/` |
| SOPs & Documents | Live | `/sops` |
| CAPA | Phase 2 | `/capa` |
| Audits | Phase 2 | `/audits` |
| Risques | Phase 2 | `/risques` |
| Equipements | Phase 2 | `/equipements` |
| Formations | Phase 2 | `/formations` |
| Fournisseurs | Phase 2 | `/fournisseurs` |
| Reclamations | Phase 2 | `/reclamations` |
| Vigilances | Phase 2 | `/vigilances` |
| Declaration terrain | Phase 2 | `/declaration` |

## Score SMQ â Ponderation

| Composante | Poids |
|------------|-------|
| SOPs | 25% |
| CAPA | 20% |
| Habilitations | 15% |
| Equipements | 15% |
| Audits | 10% |
| Reclamations | 10% |
| Risques | 5% |

## Integration PHSQ

Le composant `PhsqKpis` affiche les donnees scrapees depuis PHSQ (lqo.phsq.fr) :
- **Compteurs** : dysfonctionnements non lus, taches en retard, CR a rediger
- **KPIs mensuels** : dysfonctionnements, erreurs de dispensation, ECOR, ruptures
- **Source** : table Supabase `phsq_snapshots` alimentee par scraping automatise hebdomadaire

Contraintes RGPD strictes : seules les donnees agregees et anonymes sont collectees.

## Tables Supabase

`sops` Â· `equipements` Â· `audits` Â· `risques` Â· `processus` Â· `capa` Â· `vigilances` Â· `formations` Â· `habilitations` Â· `fournisseurs` Â· `reclamations` Â· `declarations` Â· `kpi_history` Â· `smq_config` Â· `phsq_snapshots`

## Developpement local

```bash
npm install
cp .env.example .env   # renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run dev             # http://localhost:5173
```

## Build & Deploy

```bash
npm run build           # genere dist/
```

**Vercel** : push sur `main` â auto-deploy production
**Docker** : `docker compose up -d` â http://localhost:3078

## Themes

Dark mode (defaut, accent neon vert #00FF88) et light mode (accent bleu #3B82F6). Toggle via le bouton soleil/lune dans la sidebar.
