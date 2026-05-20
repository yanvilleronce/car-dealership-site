/**
 * CSVUploader.jsx
 * Drag-and-drop (or click-to-browse) CSV import with:
 * - Live validation feedback
 * - Row preview table before confirming
 * - Error list per row
 * - Download template button
 */
import { useState, useRef } from 'react'
import { parseCSV, generateCSVTemplate, downloadCSV } from '../../inventory/csvUtils'
import { formatPrice, formatMileage, STATUS_LABELS } from '../../inventory/inventoryService'

export default function CSVUploader({ onImport, onCancel }) {
  const [dragOver, setDragOver] = useState(false)
  const [stage, setStage] = useState('upload') // 'upload' | 'preview' | 'done'
  const [parsed, setParsed] = useState(null)   // { vehicles, errors }
  const [mode, setMode] = useState('merge')    // 'merge' | 'replace'
  const [fileName, setFileName] = useState('')
  const fileRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    setFileName(file.name)
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setParsed({ vehicles: [], errors: ['Le fichier doit être au format .csv'] })
      setStage('preview')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = parseCSV(e.target.result)
      setParsed(result)
      setStage('preview')
    }
    reader.readAsText(file, 'UTF-8')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleConfirm = () => {
    if (!parsed?.vehicles?.length) return
    onImport(parsed.vehicles, mode)
    setStage('done')
  }

  const downloadTemplate = () => {
    downloadCSV(generateCSVTemplate(), 'modele-inventaire-automobile-rennais.csv')
  }

  return (
    <div className="flex flex-col gap-5">
      {stage === 'upload' && (
        <>
          {/* Download template */}
          <div className="flex items-start gap-3 p-4 bg-gold/5 border border-gold/20 rounded-sm">
            <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary font-sans text-sm font-semibold">Première utilisation ?</p>
              <p className="text-text-muted font-sans text-xs mt-0.5 leading-relaxed">
                Téléchargez le modèle CSV, remplissez-le dans Excel ou Google Sheets, puis importez-le ici.
              </p>
              <button type="button" onClick={downloadTemplate} className="btn-outline text-xs py-1.5 px-3 mt-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger le modèle CSV
              </button>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-sm cursor-pointer transition-all ${
              dragOver ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/50 hover:bg-surface-2/50'
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={e => handleFile(e.target.files[0])}
            />
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border transition-colors ${dragOver ? 'border-gold bg-gold/10' : 'border-border bg-surface-2'}`}>
              <svg className={`w-6 h-6 transition-colors ${dragOver ? 'text-gold' : 'text-text-muted'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-text-primary font-sans text-sm font-medium">
                {dragOver ? 'Déposez le fichier ici' : 'Glissez-déposez votre fichier CSV'}
              </p>
              <p className="text-text-muted font-sans text-xs mt-1">ou cliquez pour sélectionner</p>
            </div>
          </div>
        </>
      )}

      {stage === 'preview' && parsed && (
        <>
          {/* Error summary */}
          {parsed.errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4">
              <p className="text-red-400 font-sans font-semibold text-sm mb-2">
                {parsed.errors.length} erreur{parsed.errors.length > 1 ? 's' : ''} détectée{parsed.errors.length > 1 ? 's' : ''}
              </p>
              <ul className="space-y-1 max-h-32 overflow-y-auto">
                {parsed.errors.map((err, i) => (
                  <li key={i} className="text-red-300 font-sans text-xs">{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success count */}
          {parsed.vehicles.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-sm p-4">
              <p className="text-green-400 font-sans font-semibold text-sm">
                {parsed.vehicles.length} véhicule{parsed.vehicles.length > 1 ? 's' : ''} prêt{parsed.vehicles.length > 1 ? 's' : ''} à importer
              </p>
              {fileName && (
                <p className="text-text-muted font-sans text-xs mt-1">
                  Fichier : {fileName}
                </p>
              )}
            </div>
          )}

          {/* Preview table */}
          {parsed.vehicles.length > 0 && (
            <>
              <div className="overflow-x-auto rounded-sm border border-border">
                <table className="w-full text-xs font-sans">
                  <thead>
                    <tr className="bg-surface-2 border-b border-border">
                      {['Marque', 'Modèle', 'Année', 'Type', 'Prix', 'km', 'Statut'].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-text-muted font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.vehicles.slice(0, 10).map((v, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-surface-2/50">
                        <td className="px-3 py-2 text-text-primary font-semibold">{v.make}</td>
                        <td className="px-3 py-2 text-text-secondary">{v.model}</td>
                        <td className="px-3 py-2 text-text-muted">{v.year}</td>
                        <td className="px-3 py-2">
                          <span className={`px-1.5 py-0.5 rounded-sm font-bold ${v.type === 'new' ? 'bg-gold/15 text-gold' : 'bg-surface-3 text-text-muted'}`}>
                            {v.type === 'new' ? 'Neuf' : 'Occ.'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gold font-semibold whitespace-nowrap">{formatPrice(v.price, v.priceOnRequest)}</td>
                        <td className="px-3 py-2 text-text-muted whitespace-nowrap">{formatMileage(v.mileage)}</td>
                        <td className="px-3 py-2 text-text-muted">{STATUS_LABELS[v.status] || v.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsed.vehicles.length > 10 && (
                  <p className="text-center text-text-muted text-xs py-2">
                    + {parsed.vehicles.length - 10} autres…
                  </p>
                )}
              </div>

              {/* Import mode */}
              <div className="flex flex-col gap-2">
                <p className="text-text-secondary font-sans text-xs font-semibold">Mode d'import :</p>
                <div className="grid grid-cols-2 gap-3">
                  <ModeCard
                    selected={mode === 'merge'}
                    onClick={() => setMode('merge')}
                    title="Fusion"
                    desc="Ajoute les nouveaux véhicules, ne touche pas aux existants."
                    recommended
                  />
                  <ModeCard
                    selected={mode === 'replace'}
                    onClick={() => setMode('replace')}
                    title="Remplacer tout"
                    desc="Remplace tout l'inventaire. L'inventaire actuel sera perdu."
                    danger
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={handleConfirm} className="btn-primary flex-1 justify-center py-3">
                  Confirmer l'import ({parsed.vehicles.length} véhicules)
                </button>
                <button type="button" onClick={() => setStage('upload')} className="btn-ghost px-4 py-3">
                  Retour
                </button>
              </div>
            </>
          )}

          {parsed.vehicles.length === 0 && (
            <button type="button" onClick={() => setStage('upload')} className="btn-outline w-full justify-center py-3">
              Réessayer avec un autre fichier
            </button>
          )}
        </>
      )}

      {stage === 'done' && (
        <div className="flex flex-col items-center text-center py-8 gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-serif text-lg text-white">Import réussi</h3>
          <p className="text-text-muted font-sans text-sm">
            {parsed?.vehicles?.length} véhicule{parsed?.vehicles?.length !== 1 ? 's' : ''} importé{parsed?.vehicles?.length !== 1 ? 's' : ''} avec succès.
          </p>
          <button type="button" onClick={onCancel} className="btn-primary px-6 py-2.5">
            Voir l'inventaire
          </button>
        </div>
      )}

      {stage !== 'done' && (
        <button type="button" onClick={onCancel} className="btn-ghost text-sm py-2 justify-center">
          Annuler
        </button>
      )}
    </div>
  )
}

function ModeCard({ selected, onClick, title, desc, recommended, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-3 rounded-sm border transition-all ${
        selected
          ? danger ? 'border-red-500/50 bg-red-500/10' : 'border-gold/50 bg-gold/5'
          : 'border-border hover:border-border-light'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <p className={`font-sans font-semibold text-xs ${selected && danger ? 'text-red-400' : selected ? 'text-gold' : 'text-text-primary'}`}>
          {title}
        </p>
        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${selected ? (danger ? 'border-red-400' : 'border-gold') : 'border-border'}`}>
          {selected && <div className={`w-1.5 h-1.5 rounded-full ${danger ? 'bg-red-400' : 'bg-gold'}`} />}
        </div>
      </div>
      <p className="text-text-muted font-sans text-xs leading-relaxed">{desc}</p>
      {recommended && <p className="text-gold text-[10px] font-sans font-semibold mt-1">Recommandé</p>}
    </button>
  )
}
