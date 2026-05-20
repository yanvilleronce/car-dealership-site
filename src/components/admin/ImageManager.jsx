/**
 * ImageManager.jsx
 * Lets staff paste image URLs (from Google Drive, Dropbox, WhatsApp web, etc.)
 * and instantly see a live preview. Multiple images supported.
 * No file upload required — just URLs.
 */
import { useState } from 'react'

export default function ImageManager({ images = [], onChange }) {
  const [inputVal, setInputVal] = useState('')
  const [error, setError] = useState('')
  const [failedImages, setFailedImages] = useState(new Set())

  const addImage = (url) => {
    const target = (url ?? inputVal).trim()
    if (!target) return
    if (!target.startsWith('http')) {
      setError("L'URL doit commencer par http:// ou https://")
      return
    }
    if (images.includes(target)) {
      setError('Cette URL est déjà ajoutée.')
      return
    }
    setError('')
    onChange([...images, target])
    setInputVal('')
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text && text.startsWith('http')) {
        addImage(text)
      } else if (text) {
        setError("Le presse-papiers ne contient pas une URL valide.")
      }
    } catch {
      setError("Impossible d'accéder au presse-papiers. Collez l'URL manuellement.")
    }
  }

  const removeImage = (idx) => {
    const removed = images[idx]
    setFailedImages(prev => { const n = new Set(prev); n.delete(removed); return n })
    onChange(images.filter((_, i) => i !== idx))
  }

  const moveImage = (idx, dir) => {
    const next = [...images]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    onChange(next)
  }

  const markFailed = (url) => {
    setFailedImages(prev => new Set(prev).add(url))
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-xs font-sans font-medium text-text-secondary">
        Photos du véhicule
        <span className="text-text-muted ml-1">(URLs — Google Drive, Dropbox, lien direct…)</span>
      </label>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, idx) => (
            <div key={idx} className={`relative group rounded-sm overflow-hidden border aspect-[4/3] ${failedImages.has(url) ? 'bg-red-500/10 border-red-500/40' : 'bg-surface-2 border-border'}`}>
              {failedImages.has(url) ? (
                <div className="flex flex-col items-center justify-center h-full gap-1 p-2 text-center">
                  <svg className="w-6 h-6 text-red-400/60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p className="text-red-400/60 text-[10px] font-sans leading-tight">Image inaccessible</p>
                </div>
              ) : (
              <img
                src={url}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={() => markFailed(url)}
              />)}
              {/* Controls overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(idx, -1)}
                    title="Déplacer à gauche"
                    className="flex items-center justify-center w-7 h-7 rounded bg-white/20 hover:bg-white/40 text-white transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  title="Supprimer"
                  className="flex items-center justify-center w-7 h-7 rounded bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {idx < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 1)}
                    title="Déplacer à droite"
                    className="flex items-center justify-center w-7 h-7 rounded bg-white/20 hover:bg-white/40 text-white transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-gold text-black text-[10px] font-sans font-bold px-1.5 py-0.5 rounded-sm">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* URL input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={inputVal}
          onChange={e => { setInputVal(e.target.value); setError('') }}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage() } }}
          placeholder="https://… coller l'URL de l'image"
          className="input-base flex-1 text-sm"
        />
        <button
          type="button"
          onClick={() => addImage()}
          className="btn-outline text-xs px-3 py-2 shrink-0"
        >
          Ajouter
        </button>
        <button
          type="button"
          onClick={handlePaste}
          title="Coller depuis le presse-papiers"
          className="btn-outline text-xs px-2.5 py-2 shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
        </button>
      </div>
      {error && <p className="text-red-400 text-xs font-sans">{error}</p>}
      <p className="text-text-muted text-xs font-sans">
        Collez une URL ou utilisez le bouton presse-papiers pour ajouter des photos.
      </p>
    </div>
  )
}
