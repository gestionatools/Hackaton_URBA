import { createClient } from '@supabase/supabase-js'
import ViewSwitcher from './components/ViewSwitcher'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )
}

async function getAllData() {
  const supabase = getSupabase()
  const [parcelas, ordenes] = await Promise.all([
    supabase.from('HACK_URBA_1').select('*'),
    supabase.from('HACK_URBA_Ordenes_ejecucion').select('*'),
  ])
  if (parcelas.error) throw new Error(parcelas.error.message)
  if (ordenes.error) throw new Error(ordenes.error.message)
  return { parcelas: parcelas.data, ordenes: ordenes.data }
}

export default async function Home() {
  let parcelas = []
  let ordenes = []
  let errorMsg = null

  try {
    const data = await getAllData()
    parcelas = data.parcelas
    ordenes = data.ordenes
  } catch (e) {
    errorMsg = e.message
  }

  return (
    <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>HACK_URBA</h1>
      {errorMsg && (
        <p style={{ color: 'red' }}>Error: {errorMsg}</p>
      )}
      {!errorMsg && (
        <ViewSwitcher rowsParcelas={parcelas} rowsOrdenes={ordenes} />
      )}
    </main>
  )
}
