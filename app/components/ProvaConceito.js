'use client'

import { useState, useMemo } from 'react'

const COLOR = '#7c3aed'

const COLUMNS = [
  { key: 'ExpedienteCodigo',        label: 'Código do Expediente' },
  { key: 'ExpedienteFechaApertura', label: 'Data de Abertura' },
  { key: 'ExpedienteAsunto',        label: 'Assunto' },
  { key: 'Documento_URL',           label: 'Documento' },
]

function ensureAbsolute(url) {
  if (!url) return url
  if (/^https?:\/\//i.test(url)) return url
  return 'https://' + url
}

function DocIcon({ url }) {
  if (!url) return <span style={{ color: '#aaa' }}>—</span>
  return (
    <a href={ensureAbsolute(url)} target="_blank" rel="noopener noreferrer" title="Ver documento" style={{ color: COLOR, display: 'inline-flex', alignItems: 'center' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    </a>
  )
}

function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d)) return value
  const date = d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  return `${date} - ${time}`
}

export default function ProvaConceito({ rows = [] }) {
  const [filters, setFilters] = useState({ ExpedienteCodigo: '', ExpedienteAsunto: '' })
  const [open, setOpen] = useState(false)

  const activeCount = Object.values(filters).filter(Boolean).length

  const filtered = useMemo(() => {
    return rows.filter(row => {
      if (filters.ExpedienteCodigo && !String(row.ExpedienteCodigo ?? '').toLowerCase().includes(filters.ExpedienteCodigo.toLowerCase())) return false
      if (filters.ExpedienteAsunto && !String(row.ExpedienteAsunto ?? '').toLowerCase().includes(filters.ExpedienteAsunto.toLowerCase())) return false
      return true
    })
  }, [rows, filters])

  const thStyle = {
    padding: '8px 12px',
    textAlign: 'left',
    fontWeight: 700,
    fontSize: '0.8rem',
    borderBottom: `2px solid ${COLOR}`,
    whiteSpace: 'nowrap',
    background: '#ede9fe',
    color: '#5b21b6',
  }

  const tdStyle = {
    padding: '7px 12px',
    fontSize: '0.8rem',
    borderBottom: '1px solid #e5e7eb',
    verticalAlign: 'middle',
  }

  return (
    <div>
      {/* Alternância de filtros */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            padding: '5px 14px',
            fontSize: '0.8rem',
            fontWeight: 600,
            borderRadius: '6px',
            cursor: 'pointer',
            border: `2px solid ${COLOR}`,
            background: open ? COLOR : '#f5f3ff',
            color: open ? '#fff' : COLOR,
          }}
        >
          {open ? 'Ocultar filtros' : 'Filtros'}
          {activeCount > 0 && (
            <span style={{
              marginLeft: '6px',
              background: open ? '#fff' : COLOR,
              color: open ? COLOR : '#fff',
              borderRadius: '999px',
              padding: '1px 7px',
              fontSize: '0.7rem',
              fontWeight: 700,
            }}>
              {activeCount}
            </span>
          )}
        </button>
        <span style={{ fontSize: '0.8rem', color: '#555' }}>
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Painel de filtros */}
      {open && (
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
          padding: '0.75rem 1rem',
          background: '#f5f3ff',
          borderRadius: '8px',
          border: `1px solid #ddd6fe`,
        }}>
          {[
            { key: 'ExpedienteCodigo', label: 'Código do Expediente' },
            { key: 'ExpedienteAsunto', label: 'Assunto' },
          ].map(({ key, label }) => (
            <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.78rem', fontWeight: 600, color: '#5b21b6' }}>
              {label}
              <input
                value={filters[key]}
                onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
                placeholder={`Filtrar ${label}…`}
                style={{
                  padding: '4px 8px',
                  fontSize: '0.78rem',
                  borderRadius: '5px',
                  border: '1px solid #c4b5fd',
                  minWidth: '180px',
                }}
              />
            </label>
          ))}
          {activeCount > 0 && (
            <button
              onClick={() => setFilters({ ExpedienteCodigo: '', ExpedienteAsunto: '' })}
              style={{
                alignSelf: 'flex-end',
                padding: '4px 12px',
                fontSize: '0.78rem',
                borderRadius: '5px',
                border: '1px solid #f87171',
                background: '#fff',
                color: '#ef4444',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Limpar
            </button>
          )}
        </div>
      )}

      {/* Tabela */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '600px' }}>
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th key={col.key} style={thStyle}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} style={{ ...tdStyle, textAlign: 'center', color: '#999', padding: '2rem' }}>
                  Sem resultados
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr key={row.id ?? i} style={{ background: i % 2 === 0 ? '#fff' : '#faf5ff' }}>
                  <td style={tdStyle}>{row.ExpedienteCodigo ?? '—'}</td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{formatDate(row.ExpedienteFechaApertura)}</td>
                  <td style={tdStyle}>{row.ExpedienteAsunto ?? '—'}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <DocIcon url={row.Documento_URL} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
