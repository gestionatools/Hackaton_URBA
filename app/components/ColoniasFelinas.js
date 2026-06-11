'use client'

import { useState } from 'react'

const PURPLE = '#7c3aed'

// ─── Voluntarios ──────────────────────────────────────────────────────────────

function VoluntarioItem({ voluntario }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ border: '1px solid #334155', borderRadius: '6px', marginBottom: '0.4rem', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: open ? '#2d1f4e' : '#1e293b',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#f1f5f9',
        }}
      >
        <span style={{ color: '#94a3b8', minWidth: '130px', fontFamily: 'monospace' }}>
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
            background: '#0f172a',
            fontSize: '0.875rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '0.5rem',
            borderTop: '1px solid #334155',
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

// ─── Asignaciones por centro ──────────────────────────────────────────────────

function AsignacionCentroItem({ centro, asignaciones, voluntariosMap }) {
  const [open, setOpen] = useState(false)
  const count = asignaciones.length

  return (
    <div style={{ border: '1px solid #334155', borderRadius: '6px', marginBottom: '0.4rem', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: open ? '#2d1f4e' : '#1e293b',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#f1f5f9',
        }}
      >
        <span>{centro}</span>
        <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.85rem' }}>
          ({count} voluntario{count !== 1 ? 's' : ''})
        </span>
        <span style={{ marginLeft: 'auto', color: PURPLE, fontSize: '0.75rem' }}>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div style={{ background: '#1e293b', borderTop: '1px solid #334155' }}>
          {asignaciones.map((asig) => {
            const v = voluntariosMap[asig['voluntario_NIF']] || {}
            return (
              <div
                key={asig.id}
                style={{
                  padding: '0.6rem 1rem',
                  borderBottom: '1px solid #334155',
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

// ─── Barra indicadora de gatos ────────────────────────────────────────────────

function GatosBar({ value }) {
  const num = value ?? 0
  const pct = Math.min(num, 100)
  const overLimit = num > 100
  const barColor = overLimit ? '#dc2626' : '#f59e0b'
  const labelOnBar = pct > 40

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, minWidth: 0 }}>
      <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>🐱 Gatos:</span>
      <div
        style={{
          flex: 1,
          height: '16px',
          background: '#374151',
          borderRadius: '8px',
          overflow: 'visible',
          position: 'relative',
          minWidth: '60px',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            minWidth: num > 0 ? '16px' : '0',
            height: '100%',
            background: barColor,
            borderRadius: '8px',
            position: 'relative',
          }}
        >
          {labelOnBar && (
            <span
              style={{
                position: 'absolute',
                right: '6px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#fff',
                whiteSpace: 'nowrap',
              }}
            >
              {num}
            </span>
          )}
        </div>
        {!labelOnBar && (
          <span
            style={{
              position: 'absolute',
              left: `calc(${pct}% + 6px)`,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#e2e8f0',
              whiteSpace: 'nowrap',
            }}
          >
            {num}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Centros (tabla HACK_CATS_Centro) ─────────────────────────────────────────

function CentroInfoItem({ centro }) {
  const [open, setOpen] = useState(false)

  const perfiles = centro.voluntarios_perfiles
    ? centro.voluntarios_perfiles
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  return (
    <div style={{ border: '1px solid #334155', borderRadius: '6px', marginBottom: '0.4rem', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: open ? '#2d1f4e' : '#1e293b',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#f1f5f9',
        }}
      >
        <span style={{ whiteSpace: 'nowrap' }}>{centro.centro_gatuno || '—'}</span>
        <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
          ({centro.voluntarios_numero ?? 0} voluntario{centro.voluntarios_numero !== 1 ? 's' : ''})
        </span>
        <GatosBar value={centro.gatos_numero} />
        <span style={{ color: PURPLE, fontSize: '0.75rem', flexShrink: 0 }}>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: '#0f172a',
            fontSize: '0.875rem',
            borderTop: '1px solid #334155',
          }}
        >
          <div style={{ marginBottom: '0.4rem' }}>
            <strong>Nº voluntarios:</strong> {centro.voluntarios_numero ?? '—'}
          </div>
          <div style={{ marginBottom: '0.4rem' }}>
            <strong>Nº gatos:</strong> {centro.gatos_numero ?? '—'}
          </div>
          <div>
            <strong>Perfiles:</strong>{' '}
            {perfiles.length === 0 ? (
              <span style={{ color: '#64748b' }}>Sin perfiles registrados</span>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                {perfiles.map((p, i) => (
                  <span
                    key={i}
                    style={{
                      background: '#3b0764',
                      color: '#d8b4fe',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ColoniasFelinas({ voluntarios, asignaciones, centros }) {
  const [view, setView] = useState('voluntarios')

  const voluntariosMap = {}
  voluntarios.forEach((v) => {
    if (v.voluntario_nif) voluntariosMap[v.voluntario_nif] = v
  })

  const centrosAgrupados = {}
  asignaciones.forEach((a) => {
    const centro = a.centro_gatuno || 'Sin centro'
    if (!centrosAgrupados[centro]) centrosAgrupados[centro] = []
    centrosAgrupados[centro].push(a)
  })

  const tabs = [
    { key: 'voluntarios', label: 'Voluntarios' },
    { key: 'asignaciones', label: 'Asignaciones por centro' },
    { key: 'centros', label: 'Centros' },
  ]

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
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
              border: view === key ? `2px solid ${PURPLE}` : '2px solid #334155',
              background: view === key ? PURPLE : '#1e293b',
              color: view === key ? '#fff' : '#cbd5e1',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'voluntarios' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
            {voluntarios.length} voluntario{voluntarios.length !== 1 ? 's' : ''} registrado{voluntarios.length !== 1 ? 's' : ''}
          </p>
          {voluntarios.map((v) => (
            <VoluntarioItem key={v.id} voluntario={v} />
          ))}
          {voluntarios.length === 0 && (
            <p style={{ color: '#64748b' }}>Sin datos de voluntarios.</p>
          )}
        </div>
      )}

      {view === 'asignaciones' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
            {Object.keys(centrosAgrupados).length} centro{Object.keys(centrosAgrupados).length !== 1 ? 's' : ''} gatuño{Object.keys(centrosAgrupados).length !== 1 ? 's' : ''}
          </p>
          {Object.entries(centrosAgrupados).map(([centro, asigs]) => (
            <AsignacionCentroItem
              key={centro}
              centro={centro}
              asignaciones={asigs}
              voluntariosMap={voluntariosMap}
            />
          ))}
          {Object.keys(centrosAgrupados).length === 0 && (
            <p style={{ color: '#64748b' }}>Sin asignaciones registradas.</p>
          )}
        </div>
      )}

      {view === 'centros' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
            {centros.length} centro{centros.length !== 1 ? 's' : ''} gatuño{centros.length !== 1 ? 's' : ''} — datos recalculados al cargar la página
          </p>
          {centros.map((c) => (
            <CentroInfoItem key={c.id} centro={c} />
          ))}
          {centros.length === 0 && (
            <p style={{ color: '#64748b' }}>Sin centros registrados.</p>
          )}
        </div>
      )}
    </>
  )
}
