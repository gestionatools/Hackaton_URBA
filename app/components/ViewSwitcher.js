'use client'

import { useState } from 'react'
import DataTable from './DataTable'
import OrdenesTable from './OrdenesTable'

const VIEWS = {
  parcelas: 'Datos Urbanísticos',
  ordenes: 'Órdenes de ejecución realizadas',
}

export default function ViewSwitcher({ rowsParcelas, rowsOrdenes }) {
  const [view, setView] = useState('parcelas')

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {Object.entries(VIEWS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            style={{
              padding: '7px 18px',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '6px',
              cursor: 'pointer',
              border: view === key ? '2px solid #3b82f6' : '2px solid #ccc',
              background: view === key ? '#3b82f6' : '#f0f4f8',
              color: view === key ? '#fff' : '#333',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'parcelas' && <DataTable rows={rowsParcelas} />}
      {view === 'ordenes' && <OrdenesTable rows={rowsOrdenes} />}
    </>
  )
}
