'use client'

import { useState, useMemo } from 'react'

const styles = {
  panel: {
    border: '1px solid #ccc',
    borderRadius: '6px',
    marginBottom: '1rem',
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.6rem 1rem',
    background: '#f0f4f8',
    cursor: 'pointer',
    userSelect: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  panelBody: {
    padding: '1rem',
    borderTop: '1px solid #ccc',
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
    color: '#555',
    fontWeight: 500,
  },
  input: {
    padding: '4px 6px',
    fontSize: '0.8rem',
    border: '1px solid #bbb',
    borderRadius: '4px',
    width: '100%',
    boxSizing: 'border-box',
  },
  badge: {
    fontSize: '0.72rem',
    background: '#f59e0b',
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
    background: '#e8ecf0',
    border: '1px solid #bbb',
    borderRadius: '4px',
    cursor: 'pointer',
  },
}

export default function OrdenesTable({ rows }) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState({})

  if (!rows || rows.length === 0) return <p>Sin datos de órdenes de ejecución.</p>

  // Auto-detect columns from first row
  const columns = Object.keys(rows[0])

  const setFilter = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }))

  const resetFilters = () => setFilters({})

  const activeCount = Object.values(filters).filter(v => v !== '').length

  const filtered = useMemo(() => {
    return rows.filter(row => {
      for (const col of columns) {
        const val = filters[col]
        if (val && !String(row[col] ?? '').toLowerCase().includes(val.toLowerCase())) return false
      }
      return true
    })
  }, [rows, filters, columns])

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
              {columns.map(col => (
                <div key={col} style={styles.fieldGroup}>
                  <label style={styles.label}>{col}</label>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder="buscar..."
                    value={filters[col] ?? ''}
                    onChange={e => setFilter(col, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button style={styles.resetBtn} onClick={resetFilters}>Limpiar filtros</button>
          </div>
        )}
      </div>

      <p style={{ fontSize: '0.82rem', color: '#555', margin: '0 0 0.5rem' }}>
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
                {columns.map(col => (
                  <th
                    key={col}
                    style={{ border: '1px solid #ccc', padding: '4px 8px', background: '#fef3c7', whiteSpace: 'nowrap' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.ID ?? row.id ?? i}>
                  {columns.map(col => (
                    <td key={col} style={{ border: '1px solid #ccc', padding: '4px 8px', whiteSpace: 'nowrap' }}>
                      {row[col] ?? ''}
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
