'use client'

import { useState } from 'react'
import DataTable from './DataTable'
import OrdenesTable from './OrdenesTable'
import ActividadesTable from './ActividadesTable'
import RefreshButton from './RefreshButton'

const VIEWS = {
  parcelas:    { label: 'Datos Urbanísticos',               color: '#3b82f6' },
  ordenes:     { label: 'Órdenes de ejecución realizadas',  color: '#f59e0b' },
  actividades: { label: 'Actividades',                       color: '#16a34a' },
}

export default function ViewSwitcher({ rowsParcelas, rowsOrdenes, rowsActividades }) {
  const [view, setView] = useState('parcelas')

  const activeColor = VIEWS[view].color

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(VIEWS).map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            style={{
              padding: '7px 18px',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '6px',
              cursor: 'pointer',
              border: view === key ? `2px solid ${color}` : '2px solid #ccc',
              background: view === key ? color : '#f0f4f8',
              color: view === key ? '#fff' : '#333',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
        <a
          href="/colonias-felinas"
          style={{
            padding: '7px 18px',
            fontSize: '0.85rem',
            fontWeight: 600,
            borderRadius: '6px',
            border: '2px solid #7c3aed',
            background: '#f0f4f8',
            color: '#7c3aed',
            textDecoration: 'none',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          Colonias Felinas →
        </a>
        <RefreshButton />
      </div>

      {view === 'parcelas'    && <DataTable rows={rowsParcelas} />}
      {view === 'ordenes'     && <OrdenesTable rows={rowsOrdenes} />}
      {view === 'actividades' && <ActividadesTable rows={rowsActividades} />}
    </>
  )
}
