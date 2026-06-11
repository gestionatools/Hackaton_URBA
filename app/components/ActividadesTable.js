'use client'

import { useState, useMemo } from 'react'

const styles = {
  panel: {
    border: '1px solid #334155',
    borderRadius: '6px',
    marginBottom: '1rem',
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.6rem 1rem',
    background: '#1e293b',
    color: '#f1f5f9',
    cursor: 'pointer',
    userSelect: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  panelBody: {
    padding: '1rem',
    borderTop: '1px solid #334155',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '0.75rem 1.25rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  label: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: 500,
  },
  input: {
    padding: '4px 6px',
    fontSize: '0.8rem',
    border: '1px solid #475569',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box',
    background: '#0f172a',
    color: '#f1f5f9',
  },
  badge: {
    fontSize: '0.72rem',
    background: '#16a34a',
    color: '#fff',
    borderRadius: '10px',
    padding: '1px 7px',
    marginLeft: '8px',
    fontWeight: 600,
  },
  chevron: {
    fontSize: '0.8rem',
    transition: 'transform 0.2s',
  },
  resetBtn: {
    marginTop: '0.85rem',
    padding: '5px 14px',
    fontSize: '0.8rem',
    background: '#1e293b',
    border: '1px solid #475569',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#f1f5f9',
  },
}

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'created_at', label: 'Fecha creación' },
  { key: 'referencia_catastral', label: 'Referencia catastral' },
  { key: 'actividad_tipo', label: 'Tipo actividad' },
  { key: 'actividad_fechainicio', label: 'Fecha inicio' },
  { key: 'actividad_IAE', label: 'IAE' },
]

export default function ActividadesTable({ rows }) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState({})

  if (!rows || rows.length === 0) return <p>Sin datos de actividades.</p>

  const setFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }))

  const resetFilters = () => setFilters({})

  const activeCount = Object.values(filters).filter(v => v !== '').length

  const filtered = useMemo(() => {
    return rows.filter(row => {
      for (const { key } of COLUMNS) {
        const val = filters[key]
        if (val && !String(row[key] ?? '').toLowerCase().includes(val.toLowerCase())) return false
      }
      return true
    })
  }, [rows, filters])

  return (
    <>
      <div style={styles.panel}>
        <div style={styles.panelHeader} onClick={() => setOpen(o => !o)} role="button" aria-expanded={open}>
          <span>
            Filtros
            {activeCount > 0 && <span style={styles.badge}>{activeCount}</span>}
          </span>
          <span style={{ ...styles.chevron, transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
        </div>

        {open && (
          <div style={styles.panelBody}>
            <div style={styles.grid}>
              {COLUMNS.map(({ key, label }) => (
                <div key={key} style={styles.fieldGroup}>
                  <label style={styles.label}>{label}</label>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder="buscar..."
                    value={filters[key] ?? ''}
                    onChange={e => setFilter(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button style={styles.resetBtn} onClick={resetFilters}>Limpiar filtros</button>
          </div>
        )}
      </div>

      <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 0.5rem' }}>
        {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        {filtered.length !== rows.length && ` de ${rows.length}`}
      </p>

      {filtered.length === 0 ? (
        <p>Sin resultados para los filtros aplicados.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr>
                {COLUMNS.map(({ key, label }) => (
                  <th
                    key={key}
                    style={{ border: '1px solid #334155', padding: '4px 8px', background: '#052e16', color: '#bbf7d0', whiteSpace: 'nowrap' }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id ?? i}>
                  {COLUMNS.map(({ key }) => (
                    <td key={key} style={{ border: '1px solid #334155', padding: '4px 8px', whiteSpace: 'nowrap', color: '#f1f5f9' }}>
                      {row[key] ?? ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
