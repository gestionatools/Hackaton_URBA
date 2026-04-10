import { createClient } from '@supabase/supabase-js'
import ColoniasFelinas from '../components/ColoniasFelinas'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )
}

export const metadata = {
  title: 'Colonias Felinas | Hackaton URBA',
}

/**
 * Recalculates HACK_CATS_Centro from the current state of
 * HACK_CATS_Asignaciones + HACK_CATS_Voluntarios, then returns
 * the freshly written rows for display.
 *
 * voluntarios_numero  = number of rows in Asignaciones for that centro
 * voluntarios_perfiles = ';'-joined voluntario_preferencias values
 */
async function syncCentros(supabase, voluntarios, asignaciones) {
  // Build NIF → voluntario lookup (voluntario_nif is lowercase in that table)
  const volMap = {}
  voluntarios.forEach((v) => {
    if (v.voluntario_nif) volMap[v.voluntario_nif] = v
  })

  // Aggregate per centro_gatuno
  const centroMap = {}
  asignaciones.forEach((asig) => {
    const key = asig.centro_gatuno || 'Sin centro'
    if (!centroMap[key]) centroMap[key] = { count: 0, perfiles: [] }
    centroMap[key].count++
    const vol = volMap[asig['voluntario_NIF']]
    if (vol?.voluntario_preferencias) {
      centroMap[key].perfiles.push(vol.voluntario_preferencias)
    }
  })

  const rows = Object.entries(centroMap).map(([centro, { count, perfiles }]) => ({
    centro_gatuno: centro,
    voluntarios_numero: count,
    voluntarios_perfiles: perfiles.join('; '),
  }))

  // Wipe table and re-insert computed values
  await supabase.from('HACK_CATS_Centro').delete().gte('id', 0)
  if (rows.length > 0) {
    await supabase.from('HACK_CATS_Centro').insert(rows)
  }

  // Return the freshly written data
  const { data } = await supabase.from('HACK_CATS_Centro').select('*')
  return data ?? []
}

export default async function ColoniasFelinasPage() {
  const supabase = getSupabase()

  // Fetch source tables in parallel
  const [voluntariosRes, asignacionesRes] = await Promise.all([
    supabase.from('HACK_CATS_Voluntarios').select('*'),
    supabase.from('HACK_CATS_Asignaciones').select('*'),
  ])

  const fetchError =
    voluntariosRes.error?.message || asignacionesRes.error?.message || null

  let centros = []
  let syncError = null

  if (!fetchError) {
    try {
      centros = await syncCentros(
        supabase,
        voluntariosRes.data ?? [],
        asignacionesRes.data ?? []
      )
    } catch (e) {
      syncError = e.message
    }
  }

  const errorMsg = fetchError || syncError || null

  return (
    <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
        <a
          href="/"
          style={{
            textDecoration: 'none',
            color: '#7c3aed',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          ← Volver
        </a>
        <h1 style={{ margin: 0 }}>Colonias Felinas</h1>
      </div>

      {errorMsg ? (
        <p style={{ color: 'red' }}>Error: {errorMsg}</p>
      ) : (
        <ColoniasFelinas
          voluntarios={voluntariosRes.data ?? []}
          asignaciones={asignacionesRes.data ?? []}
          centros={centros}
        />
      )}
    </main>
  )
}
