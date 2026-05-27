import { useState, useEffect } from 'react'
import { getInsights } from '../../utils/insightCollector'

export default function InsightsDashboard({ onBack }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(getInsights())
    const id = setInterval(() => setData(getInsights()), 5000)
    return () => clearInterval(id)
  }, [])

  if (!data) return null

  const { counts, vehicles, inquiries } = data
  const pageViews = counts.page_view || 0
  const reserveClicks = counts.click_reserve || 0
  const financingClicks = counts.click_financing || 0
  const inquiryTotal = inquiries.length

  const sorted = (key, limit = 10) =>
    Object.entries(vehicles)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => (b[key] || 0) - (a[key] || 0))
      .slice(0, limit)
      .filter(v => (v[key] || 0) > 0)

  const topViews = sorted('views')
  const topReserve = sorted('reserve_clicks')
  const topFinancing = sorted('financing_clicks')

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        {onBack && (
          <button onClick={onBack} className="text-text-muted hover:text-gold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        )}
        <h2 className="font-serif text-xl text-white">Insights</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card value={pageViews} label="Pages vues" color="gold" />
        <Card value={reserveClicks} label="Clics Réservation" color="green" />
        <Card value={financingClicks} label="Clics Financement" color="yellow" />
        <Card value={inquiryTotal} label="Demandes reçues" color="blue" />
      </div>

      {pageViews > 0 && (
        <div className="bg-surface-1 border border-border rounded-sm p-4 sm:p-5 mb-6">
          <h3 className="font-serif text-white text-sm mb-3">Entonnoir de conversion</h3>
          <div className="flex flex-col gap-2">
            <FunnelRow label="Pages vues" value={pageViews} total={pageViews} color="bg-gold" />
            <FunnelRow label="Clics Réservation" value={reserveClicks} total={pageViews} color="bg-green-500" />
            <FunnelRow label="Demandes reçues" value={inquiryTotal} total={pageViews} color="bg-amber-500" />
          </div>
        </div>
      )}

      {topViews.length > 0 && (
        <Section title="Véhicules les plus vus">
          <Table rows={topViews} columns={[
            { label: 'Véhicule', render: r => `${r.make} ${r.model}` },
            { label: 'Vues', render: r => r.views, className: 'text-gold font-bold' },
          ]} />
        </Section>
      )}

      {topReserve.length > 0 && (
        <Section title="Réservations les plus demandées">
          <Table rows={topReserve} columns={[
            { label: 'Véhicule', render: r => `${r.make} ${r.model}` },
            { label: 'Clics', render: r => r.reserve_clicks, className: 'text-green-400 font-bold' },
          ]} />
        </Section>
      )}

      {topFinancing.length > 0 && (
        <Section title="Financements les plus demandés">
          <Table rows={topFinancing} columns={[
            { label: 'Véhicule', render: r => `${r.make} ${r.model}` },
            { label: 'Clics', render: r => r.financing_clicks, className: 'text-yellow-400 font-bold' },
          ]} />
        </Section>
      )}

      {inquiries.length > 0 && (
        <Section title="Demandes de contact">
          <p className="text-text-muted font-sans text-xs mb-3">{inquiryTotal} demande(s) reçue(s)</p>
          {inquiries.filter(i => i.vehicle).length > 0 && (
            <Table rows={inquiries.filter(i => i.vehicle).slice(-10).reverse()} columns={[
              { label: 'Véhicule', render: r => r.vehicle || '—' },
              { label: 'Date', render: r => new Date(r.timestamp).toLocaleDateString('fr-FR') },
            ]} />
          )}
        </Section>
      )}

      {inquiryTotal === 0 && topViews.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted font-sans text-sm">Aucune donnée collectée pour le moment.</p>
          <p className="text-text-muted font-sans text-xs mt-2">Les statistiques apparaissent ici au fur et à mesure des visites.</p>
        </div>
      )}

      {data.firstEvent && (
        <p className="text-text-muted font-sans text-xs text-center mt-6">
          Collecte depuis le {new Date(data.firstEvent).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </p>
      )}
    </div>
  )
}

function Card({ value, label, color }) {
  const colors = { gold: 'text-gold', green: 'text-green-400', yellow: 'text-yellow-400', blue: 'text-blue-400' }
  return (
    <div className="bg-surface-1 border border-border rounded-sm p-4">
      <p className={`font-serif text-2xl font-bold ${colors[color] || 'text-white'}`}>{value}</p>
      <p className="text-text-primary font-sans text-sm font-semibold mt-0.5">{label}</p>
    </div>
  )
}

function FunnelRow({ label, value, total, color }) {
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
  return (
    <div className="flex items-center gap-3">
      <span className="font-sans text-xs text-text-muted w-36 shrink-0">{label}</span>
      <div className="flex-1 bg-surface-2 rounded-full h-3 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${Math.max(Number(pct), 0.5)}%` }} />
      </div>
      <span className="font-sans text-xs text-text-secondary font-medium w-16 text-right">{value}</span>
      <span className="font-sans text-xs text-text-muted w-12 text-right">{pct}%</span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-surface-1 border border-border rounded-sm p-4 sm:p-5 mb-4">
      <h3 className="font-serif text-white text-sm mb-3">{title}</h3>
      {children}
    </div>
  )
}

function Table({ rows, columns }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            {columns.map(c => (
              <th key={c.label} className="font-sans text-xs text-text-muted font-semibold pb-2 pr-4 whitespace-nowrap">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i} className="border-b border-border/50 last:border-0">
              {columns.map(c => (
                <td key={c.label} className={`font-sans text-sm text-text-primary py-2 pr-4 whitespace-nowrap ${c.className || ''}`}>{c.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
