import { createClient } from '@supabase/supabase-js'

async function getData() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )
  const { data, error } = await supabase.from('HACK_URBA_1').select('*')
  if (error) throw new Error(error.message)
  return data
}

export default async function Home() {
  let rows = []
  let errorMsg = null

  try {
    rows = await getData()
  } catch (e) {
    errorMsg = e.message
  }

  const columns = [
    'ID', 'referencia_catastral', 'municipio', 'clase_suelo', 'categoria_suelo',
    'ambito_planeamiento', 'ambito_codigo', 'unidad_ejecucion', 'zonificacion',
    'subzonificacion', 'ordenanza', 'instrumento_planeamiento',
    'edificabilidad_m2m2', 'ocupacion_maxima_pct', 'altura_max_plantas',
    'superficie_parcela_m2', 'licencia_urbanistica', 'longitud', 'latitud', 'doc_url',
  ]

  return (
    <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>HACK_URBA_1</h1>
      {errorMsg && (
        <p style={{ color: 'red' }}>Error: {errorMsg}</p>
      )}
      {!errorMsg && rows.length === 0 && <p>Sin datos.</p>}
      {rows.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    style={{ border: '1px solid #ccc', padding: '4px 8px', background: '#f0f0f0', whiteSpace: 'nowrap' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.ID}>
                  {columns.map((col) => (
                    <td key={col} style={{ border: '1px solid #ccc', padding: '4px 8px', whiteSpace: 'nowrap' }}>
                      {col === 'doc_url' && row[col]
                        ? <a href={row[col]} target="_blank" rel="noreferrer">ver</a>
                        : row[col] ?? ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
