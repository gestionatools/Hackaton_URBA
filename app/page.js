import { createClient } from '@supabase/supabase-js'
import ViewSwitcher from './components/ViewSwitcher'

export const dynamic = 'force-dynamic'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )
}

async function getAllData() {
  const supabase = getSupabase()
  const [parcelas, ordenes, actividades, urbanismo] = await Promise.all([
    supabase.from('HACK_URBA_1').select('*'),
    supabase.from('HACK_URBA_Ordenes_ejecucion').select('*'),
    supabase.from('HACK_URBA_ACTIVIDADES').select('*'),
    supabase.from('PT_Urbanismo_Insertar').select('*'),
  ])
  if (parcelas.error) throw new Error(parcelas.error.message)
  if (ordenes.error) throw new Error(ordenes.error.message)
  if (actividades.error) throw new Error(actividades.error.message)
  if (urbanismo.error) throw new Error(urbanismo.error.message)
  return { parcelas: parcelas.data, ordenes: ordenes.data, actividades: actividades.data, urbanismo: urbanismo.data }
}

export default async function Home() {
  let parcelas = []
  let ordenes = []
  let actividades = []
  let urbanismo = []
  let errorMsg = null

  try {
    const data = await getAllData()
    parcelas = data.parcelas
    ordenes = data.ordenes
    actividades = data.actividades
    urbanismo = data.urbanismo
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
        <ViewSwitcher rowsParcelas={parcelas} rowsOrdenes={ordenes} rowsActividades={actividades} rowsUrbanismo={urbanismo} />
      )}
    </main>
  )
}
