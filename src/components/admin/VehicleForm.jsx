/**
 * VehicleForm.jsx
 * Add or edit a vehicle. Used in a modal/drawer from the admin panel.
 * Designed for non-technical staff — clear labels, French, sensible defaults.
 */
import { useState, useRef, useEffect } from 'react'
import ImageManager from './ImageManager'
import {
  createEmptyVehicle,
  FUEL_OPTIONS,
  TRANS_OPTIONS,
  VEHICLE_STATUSES,
  STATUS_LABELS,
} from '../../inventory/inventoryService'

const REQUIRED_FIELDS = ['make', 'model', 'year', 'price', 'fuel']

export default function VehicleForm({ initial = null, onSave, onCancel }) {
  const [form, setForm] = useState(() => initial ? { ...createEmptyVehicle(), ...initial } : createEmptyVehicle())
  const [errors, setErrors] = useState({})
  const [optionInput, setOptionInput] = useState('')
  const [saving, setSaving] = useState(false)
  const formRef = useRef(null)

  const isEdit = !!initial?.id

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e })
  }

  const validate = () => {
    const e = {}
    if (!form.make?.trim())  e.make  = 'Obligatoire'
    if (!form.model?.trim()) e.model = 'Obligatoire'
    if (!form.year || isNaN(Number(form.year))) e.year = 'Année invalide'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Prix invalide'
    if (!form.fuel) e.fuel = 'Obligatoire'
    return e
  }

  /** Scroll the first field with an error into view */
  useEffect(() => {
    const firstKey = Object.keys(errors)[0]
    if (!firstKey) return
    const el = formRef.current?.querySelector(`[data-field="${firstKey}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [errors])

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    onSave({
      ...form,
      year:    Number(form.year),
      price:   Number(form.price),
      mileage: Number(form.mileage) || 0,
      doors:   Number(form.doors) || 4,
    })
  }

  /** Ctrl/Cmd + Enter to submit */
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const addOption = () => {
    const opt = optionInput.trim()
    if (!opt || form.options?.includes(opt)) return
    set('options', [...(form.options ?? []), opt])
    setOptionInput('')
  }

  const removeOption = (opt) => set('options', form.options.filter(o => o !== opt))

  return (
    <form ref={formRef} onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate className="flex flex-col gap-6">

      {/* ── Section 1: Identity ─────────────────────────────────── */}
      <FormSection title="Identification du véhicule">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Marque *" error={errors.make} name="make">
            <input className="input-base" value={form.make} onChange={e => set('make', e.target.value)} placeholder="Porsche" />
          </Field>
          <Field label="Modèle *" error={errors.model} name="model">
            <input className="input-base" value={form.model} onChange={e => set('model', e.target.value)} placeholder="911 GT3" />
          </Field>
          <Field label="Année *" error={errors.year} name="year">
            <input className="input-base" type="number" value={form.year} onChange={e => set('year', e.target.value)} placeholder="2024" min="1990" max="2030" />
          </Field>
          <Field label="Finition">
            <input className="input-base" value={form.trim} onChange={e => set('trim', e.target.value)} placeholder="Pack Sport" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Type de véhicule">
            <select className="input-base" value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="new">Neuf</option>
              <option value="used">Occasion</option>
            </select>
          </Field>
          <Field label="Statut">
            <select className="input-base" value={form.status} onChange={e => set('status', e.target.value)}>
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </Field>
        </div>
      </FormSection>

      {/* ── Section 2: Pricing ─────────────────────────────────── */}
      <FormSection title="Prix">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prix (€) *" error={errors.price} name="price">
            <input
              className="input-base"
              type="number"
              value={form.price}
              onChange={e => set('price', e.target.value)}
              placeholder="150000"
              min="0"
              disabled={form.priceOnRequest}
            />
          </Field>
          <Field label=" ">
            <label className="flex items-center gap-2 h-[42px] cursor-pointer">
              <input
                type="checkbox"
                checked={form.priceOnRequest}
                onChange={e => set('priceOnRequest', e.target.checked)}
                className="w-4 h-4 accent-gold"
              />
              <span className="text-text-secondary font-sans text-sm">Prix sur demande</span>
            </label>
          </Field>
        </div>
      </FormSection>

      {/* ── Section 3: Technical ──────────────────────────────── */}
      <FormSection title="Caractéristiques techniques">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Carburant *" error={errors.fuel} name="fuel">
            <select className="input-base" value={form.fuel} onChange={e => set('fuel', e.target.value)}>
              <option value="">— Sélectionner —</option>
              {FUEL_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Boîte de vitesses">
            <select className="input-base" value={form.transmission} onChange={e => set('transmission', e.target.value)}>
              {TRANS_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Kilométrage (km)">
            <input className="input-base" type="number" value={form.mileage} onChange={e => set('mileage', e.target.value)} placeholder="0" min="0" />
          </Field>
          <Field label="Puissance">
            <input className="input-base" value={form.power} onChange={e => set('power', e.target.value)} placeholder="450 ch" />
          </Field>
          <Field label="Couleur">
            <div className="flex gap-2">
              <input className="input-base flex-1" value={form.color} onChange={e => set('color', e.target.value)} placeholder="Noir Onyx" />
              <input
                type="color"
                value={form.colorHex}
                onChange={e => set('colorHex', e.target.value)}
                title="Couleur HEX"
                className="w-10 h-[42px] rounded-sm border border-border bg-surface-2 cursor-pointer p-0.5"
              />
            </div>
          </Field>
          <Field label="Nombre de portes">
            <select className="input-base" value={form.doors} onChange={e => set('doors', e.target.value)}>
              {[2, 3, 4, 5].map(d => <option key={d} value={d}>{d} portes</option>)}
            </select>
          </Field>
        </div>
      </FormSection>

      {/* ── Section 4: Description ────────────────────────────── */}
      <FormSection title="Description">
        <Field label="Description courte (affichée sur la carte)">
          <textarea
            className="input-base resize-none"
            rows={2}
            value={form.shortDesc}
            onChange={e => set('shortDesc', e.target.value)}
            placeholder="Ex: 510 ch, PDK 7 rapports, pack Clubsport inclus"
            maxLength={120}
          />
          <p className="text-text-muted text-xs mt-1">{form.shortDesc?.length ?? 0}/120 caractères</p>
        </Field>
        <Field label="Description complète (optionnel)">
          <textarea
            className="input-base resize-none"
            rows={4}
            value={form.fullDesc}
            onChange={e => set('fullDesc', e.target.value)}
            placeholder="Description détaillée du véhicule, historique, état, entretien…"
          />
        </Field>
      </FormSection>

      {/* ── Section 5: Options ───────────────────────────────── */}
      <FormSection title="Équipements & options">
        <div className="flex gap-2">
          <input
            className="input-base flex-1"
            value={optionInput}
            onChange={e => setOptionInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addOption() } }}
            placeholder="Ex: Toit ouvrant panoramique"
          />
          <button type="button" onClick={addOption} className="btn-outline text-xs px-3 py-2 shrink-0">
            + Ajouter
          </button>
        </div>
        {form.options?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.options.map(opt => (
              <span key={opt} className="inline-flex items-center gap-1 bg-surface-2 border border-border rounded-sm px-2.5 py-1 text-xs font-sans text-text-secondary">
                {opt}
                <button type="button" onClick={() => removeOption(opt)} className="text-text-muted hover:text-red-400 ml-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </FormSection>

      {/* ── Section 6: Images ────────────────────────────────── */}
      <FormSection title="Photos">
        <ImageManager images={form.images ?? []} onChange={imgs => set('images', imgs)} />
      </FormSection>

      {/* ── Section 7: Toggles ───────────────────────────────── */}
      <FormSection title="Visibilité">
        <div className="grid grid-cols-2 gap-4">
          <Toggle
            label="Mise en avant"
            description="Affiché en priorité sur la homepage"
            checked={form.featured}
            onChange={v => set('featured', v)}
          />
          <Toggle
            label="Certifié"
            description="Badge 'Certifié' visible sur la carte"
            checked={form.certified}
            onChange={v => set('certified', v)}
          />
        </div>
      </FormSection>

      {/* ── Section 8: Admin fields ───────────────────────────── */}
      <FormSection title="Référence interne (optionnel)">
        <div className="grid grid-cols-2 gap-4">
          <Field label="VIN">
            <input className="input-base" value={form.vin} onChange={e => set('vin', e.target.value)} placeholder="WP0ZZZ99ZTS198256" />
          </Field>
          <Field label="Immatriculation">
            <input className="input-base" value={form.registration} onChange={e => set('registration', e.target.value)} placeholder="AB-123-CD" />
          </Field>
        </div>
      </FormSection>

      {/* ── Actions ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
        <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-3 disabled:opacity-50">
          {saving ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Enregistrement…
            </span>
          ) : (isEdit ? 'Enregistrer les modifications' : 'Ajouter le véhicule')}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost flex-1 justify-center py-3">
          Annuler
        </button>
      </div>
    </form>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function FormSection({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-sans font-semibold text-gold tracking-[0.12em] uppercase border-b border-border pb-2">
        {title}
      </h4>
      {children}
    </div>
  )
}

function Field({ label, error, children, name }) {
  return (
    <div data-field={name} className="flex flex-col gap-1.5">
      <label className="text-xs font-sans font-medium text-text-secondary">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs font-sans">{error}</p>}
    </div>
  )
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 p-3 bg-surface-2 border border-border rounded-sm cursor-pointer hover:border-gold/40 transition-colors">
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-9 h-5 rounded-full transition-colors ${checked ? 'bg-gold' : 'bg-surface-3'} border border-border`}>
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
      </div>
      <div>
        <p className="text-text-primary font-sans text-sm font-medium">{label}</p>
        <p className="text-text-muted font-sans text-xs mt-0.5">{description}</p>
      </div>
    </label>
  )
}
