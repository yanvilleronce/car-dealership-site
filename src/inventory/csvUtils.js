/**
 * csvUtils.js
 * ─────────────────────────────────────────────────────────────────────────────
 * CSV import/export utilities for non-technical staff.
 *
 * Import workflow:
 *   Staff opens CSV template → fills in vehicles → uploads → preview → confirm
 *
 * Export workflow:
 *   Admin panel → "Exporter CSV" → opens in Excel/Sheets
 *
 * The CSV column order is designed to match what staff naturally fill left→right:
 *   make, model, year, type, price, mileage, fuel, transmission, power, color,
 *   status, featured, certified, shortDesc, image1, image2, trim, doors, vin
 */

import { createEmptyVehicle, VEHICLE_STATUSES } from './inventoryService'

// ─── Column definitions ───────────────────────────────────────────────────────
// label = CSV column header (human-readable French)
// key   = inventory schema key
// required = must be non-empty for a valid row
// parse = transform raw string to correct JS type

export const CSV_COLUMNS = [
  { label: 'Marque',          key: 'make',          required: true,  parse: String },
  { label: 'Modèle',          key: 'model',         required: true,  parse: String },
  { label: 'Année',           key: 'year',          required: true,  parse: Number },
  { label: 'Type',            key: 'type',          required: true,  parse: v => v.toLowerCase().includes('neuf') || v === 'new' ? 'new' : 'used' },
  { label: 'Prix (€)',        key: 'price',         required: true,  parse: v => Number(String(v).replace(/[^0-9.]/g, '')) },
  { label: 'Kilométrage',     key: 'mileage',       required: false, parse: v => Number(String(v).replace(/[^0-9]/g, '')) || 0 },
  { label: 'Carburant',       key: 'fuel',          required: true,  parse: String },
  { label: 'Boîte',           key: 'transmission',  required: false, parse: String },
  { label: 'Puissance',       key: 'power',         required: false, parse: String },
  { label: 'Couleur',         key: 'color',         required: false, parse: String },
  { label: 'Statut',          key: 'status',        required: false, parse: parseStatus },
  { label: 'Mise en avant',   key: 'featured',      required: false, parse: parseBool },
  { label: 'Certifié',        key: 'certified',     required: false, parse: parseBool },
  { label: 'Description',     key: 'shortDesc',     required: false, parse: String },
  { label: 'Image 1',         key: 'image1',        required: false, parse: String },
  { label: 'Image 2',         key: 'image2',        required: false, parse: String },
  { label: 'Finition',        key: 'trim',          required: false, parse: String },
  { label: 'Portes',          key: 'doors',         required: false, parse: v => Number(v) || 4 },
  { label: 'VIN',             key: 'vin',           required: false, parse: String },
]

// ─── Parse helpers ────────────────────────────────────────────────────────────
function parseStatus(v) {
  const s = String(v).toLowerCase().trim()
  if (s.includes('vendu') || s === 'sold')     return VEHICLE_STATUSES.SOLD
  if (s.includes('réservé') || s === 'reserved') return VEHICLE_STATUSES.RESERVED
  if (s.includes('masqué') || s === 'hidden') return VEHICLE_STATUSES.HIDDEN
  return VEHICLE_STATUSES.AVAILABLE
}

function parseBool(v) {
  const s = String(v).toLowerCase().trim()
  return ['oui', 'yes', 'true', '1', 'x', '✓'].includes(s)
}

// ─── CSV → JSON ───────────────────────────────────────────────────────────────

/**
 * parseCSV(text: string) → { vehicles: Vehicle[], errors: string[] }
 *
 * Accepts comma or semicolon delimited CSV.
 * First row must be the header row matching CSV_COLUMNS labels.
 * Returns parsed vehicles and any row-level validation errors.
 */
export function parseCSV(text) {
  const errors = []
  const vehicles = []

  // Detect delimiter
  const delimiter = text.includes(';') ? ';' : ','

  // Split into lines, strip BOM and carriage returns
  const lines = text
    .replace(/^\uFEFF/, '')       // BOM
    .replace(/\r/g, '')           // CRLF
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'))

  if (lines.length < 2) {
    return { vehicles: [], errors: ['Le fichier CSV est vide ou ne contient pas de données.'] }
  }

  // Parse header
  const headers = splitCSVLine(lines[0], delimiter).map(h => h.trim().replace(/"/g, ''))
  const colMap = buildColumnMap(headers)

  if (!colMap.has('make') && !colMap.has('Marque')) {
    errors.push('En-têtes de colonnes invalides. Utilisez le modèle CSV fourni.')
    return { vehicles, errors }
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1
    const cells = splitCSVLine(lines[i], delimiter).map(c => c.trim().replace(/^"|"$/g, ''))

    if (cells.every(c => !c)) continue // skip blank rows

    const raw = {}
    headers.forEach((h, idx) => { raw[h] = cells[idx] ?? '' })

    // Validate required fields
    const rowErrors = []
    for (const col of CSV_COLUMNS) {
      if (col.required) {
        const val = raw[col.label] ?? raw[col.key] ?? ''
        if (!val.trim()) rowErrors.push(`Ligne ${rowNum}: colonne "${col.label}" obligatoire manquante.`)
      }
    }
    if (rowErrors.length) {
      errors.push(...rowErrors)
      continue
    }

    // Build vehicle object
    const base = createEmptyVehicle()
    for (const col of CSV_COLUMNS) {
      const rawVal = raw[col.label] ?? raw[col.key] ?? ''
      if (rawVal !== undefined && rawVal !== '') {
        try {
          base[col.key] = col.parse(rawVal)
        } catch {
          errors.push(`Ligne ${rowNum}: valeur invalide pour "${col.label}": ${rawVal}`)
        }
      }
    }

    // Handle images: collect image1, image2 into the images array
    const images = [base.image1, base.image2].filter(Boolean)
    delete base.image1
    delete base.image2
    base.images = images.length ? images : []

    // Auto-generate id from make/model/year + row index
    base.id = [base.make, base.model, base.year, i]
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    base.addedDate = new Date().toISOString().slice(0, 10)
    vehicles.push(base)
  }

  return { vehicles, errors }
}

// ─── JSON → CSV ───────────────────────────────────────────────────────────────

/** Export vehicles array to CSV string */
export function exportToCSV(vehicles) {
  const headers = CSV_COLUMNS.map(c => c.label)
  const rows = vehicles.map(v => {
    return CSV_COLUMNS.map(col => {
      let val = ''
      if (col.key === 'image1') val = v.images?.[0] ?? ''
      else if (col.key === 'image2') val = v.images?.[1] ?? ''
      else if (col.key === 'featured' || col.key === 'certified') val = v[col.key] ? 'Oui' : 'Non'
      else if (col.key === 'status') val = statusToFrench(v.status)
      else val = v[col.key] ?? ''
      return `"${String(val).replace(/"/g, '""')}"`
    }).join(',')
  })
  return [headers.join(','), ...rows].join('\n')
}

/** Generate the blank template CSV that staff download and fill in */
export function generateCSVTemplate() {
  const headers = CSV_COLUMNS.map(c => c.label)

  const exampleRow = CSV_COLUMNS.map(col => {
    const examples = {
      make: 'Porsche',
      model: '911',
      year: '2024',
      type: 'Neuf',
      price: '150000',
      mileage: '0',
      fuel: 'Essence',
      transmission: 'PDK',
      power: '450 ch',
      color: 'Noir',
      status: 'Disponible',
      featured: 'Oui',
      certified: 'Non',
      shortDesc: 'Exemple de description courte',
      image1: 'https://example.com/photo.jpg',
      image2: '',
      trim: 'GT3',
      doors: '2',
      vin: '',
    }
    return `"${examples[col.key] ?? ''}"`
  })

  const instructions = [
    '# MODÈLE D\'IMPORT AUTOMOBILE RENNAIS',
    '# Supprimez cette ligne et la ligne d\'exemple avant d\'importer.',
    '# Colonnes obligatoires : Marque, Modèle, Année, Type, Prix (€), Carburant',
    '# Type: "Neuf" ou "Occasion"',
    '# Statut: "Disponible", "Vendu", "Réservé" ou "Masqué"',
    '# Mise en avant / Certifié: "Oui" ou "Non"',
  ].join('\n')

  return `${instructions}\n${headers.join(',')}\n${exampleRow.join(',')}`
}

// ─── Download helpers ─────────────────────────────────────────────────────────

export function downloadCSV(content, filename = 'inventaire.csv') {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadJSON(content, filename = 'inventory.json') {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Private helpers ──────────────────────────────────────────────────────────

function splitCSVLine(line, delimiter = ',') {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === delimiter && !inQuotes) {
      result.push(current); current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}

function buildColumnMap(headers) {
  const map = new Map()
  headers.forEach((h, i) => {
    map.set(h, i)
    // Also map by key for flexibility
    const col = CSV_COLUMNS.find(c => c.label === h)
    if (col) map.set(col.key, i)
  })
  return map
}

function statusToFrench(status) {
  const map = { available: 'Disponible', sold: 'Vendu', reserved: 'Réservé', hidden: 'Masqué' }
  return map[status] ?? 'Disponible'
}
