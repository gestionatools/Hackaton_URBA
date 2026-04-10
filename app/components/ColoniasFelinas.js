'use client'

import { useState } from 'react'

const PURPLE = '#7c3aed'

function VoluntarioItem({ voluntario }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '6px', marginBottom: '0.4rem', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: open ? '#f3e8ff' : '#fafafa',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 600,
        }}
      >
        <span style={{ color: '#6b7280', minWidth: '130px', fontFamily: 'monospace' }}>
          {voluntario.voluntario_nif || '—'}
        </span>
        <span>{voluntario.voluntario_nombre || '—'}</span>
        <span style={{ marginLeft: 'auto', color: PURPLE, fontSize: '0.75rem' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: '#fff',
            fontSize: '0.875rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '0.5rem',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <div><strong>Teléfono:</strong> {voluntario.voluntario_tlf || '—'}</div>
          <div><strong>Preferencias:</strong> {voluntario.voluntario_preferencias || '—'}</div>
          <div>
            <strong>Registrado:</strong>{' '}
            {voluntario.created_at
              ? new Date(voluntario.created_at).toLocaleDateString('es-ES')
              : '—'}
          </div>
        </div>
      )}
    </div>
  )
}

function CentroItem({ centro, asignaciones, voluntariosMap }) {
  const [open, setOpen] = useState(false)
  const count = asignaciones.length

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '6px', marginBottom: '0.4rem', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: open ? '#f3e8ff' : '#fafafa',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 600,
        }}
      >
        <span>{centro}</span>
        <span style={{ color: '#6b7280', fontWeight: 400, fontSize: '0.85rem' }}>
          ({count} voluntario{count !== 1 ? 's' : ''})
        </span>
        <span style={{ marginLeft: 'auto', color: PURPLE, fontSize: '0.75rem' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
          {asignaciones.map((asig) => {
            const v = voluntariosMap[asig['voluntario_NIF']] || {}
            return (
              <div
                key={asig.id}
                style={{
                  padding: '0.6rem 1rem',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '0.4rem',
                }}
              >
                <div>
                  <strong>NIF:</strong>{' '}
                  <span style={{ fontFamily: 'monospace' }}>{asig['voluntario_NIF'] || '—'}</span>
                </div>
                <div><strong>Nombre:</strong> {v.voluntario_nombre || '—'}</div>
                <div><strong>Teléfono:</strong> {v.voluntario_tlf || '—'}</div>
                <div><strong>Preferencias:</strong> {v.voluntario_preferencias || '—'}</div>
                <div>
                  <strong>Asignado:</strong>{' '}
                  {asig.fecha_asignacion
                    ? new Date(asig.fecha_asignacion).toLocaleDateString('es-ES')
                    : '—'}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ColoniasFelinas({ voluntarios, asignaciones }) {
  const [view, setView] = useState('voluntarios')

  const voluntariosMap = {}
  voluntarios.forEach((v) => {
    if (v.voluntario_nif) voluntariosMap[v.voluntario_nif] = v
  })

  const centros = {}
  asignaciones.forEach((a) => {
    const centro = a.centro_gatuno || 'Sin centro'
    if (!centros[centro]) centros[centro] = []
    centros[centro].push(a)
  })

  const tabs = [
    { key: 'voluntarios', label: 'Voluntarios' },
    { key: 'asignaciones', label: 'Asignaciones por centro' },
  ]

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            style={{
              padding: '7px 18px',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '6px',
              cursor: 'pointer',
              border: view === key ? `2px solid ${PURPLE}` : '2px solid #ccc',
              background: view === key ? PURPLE : '#f0f4f8',
              color: view === key ? '#fff' : '#333',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'voluntarios' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.75rem' }}>
            {voluntarios.length} voluntario{voluntarios.length !== 1 ? 's' : ''} registrado{voluntarios.length !== 1 ? 's' : ''}
          </p>
          {voluntarios.map((v) => (
            <VoluntarioItem key={v.id} voluntario={v} />
          ))}
          {voluntarios.length === 0 && (
            <p style={{ color: '#999' }}>Sin datos de voluntarios.</p>
          )}
        </div>
      )}

      {view === 'asignaciones' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.75rem' }}>
            {Object.keys(centros).length} centro{Object.keys(centros).length !== 1 ? 's' : ''} gatuño{Object.keys(centros).length !== 1 ? 's' : ''}
          </p>
          {Object.entries(centros).map(([centro, asigs]) => (
            <CentroItem
              key={centro}
              centro={centro}
              asignaciones={asigs}
              voluntariosMap={voluntariosMap}
            />
          ))}
          {Object.keys(centros).length === 0 && (
            <p style={{ color: '#999' }}>Sin asignaciones registradas.</p>
          )}
        </div>
      )}
    </>
  )
}
