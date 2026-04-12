import { createClient } from '@supabase/supabase-js'
import ColoniasFelinas from '../components/ColoniasFelinas'
import RefreshButton from '../components/RefreshButton'

export const dynamic = 'force-dynamic'

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

  // Preserve existing gatos_numero values before wiping the table
  const { data: existing } = await supabase
    .from('HACK_CATS_Centro')
    .select('centro_gatuno, gatos_numero')
  const gatosMap = {}
  if (existing) {
    existing.forEach((row) => {
      if (row.centro_gatuno) gatosMap[row.centro_gatuno] = row.gatos_numero
    })
  }

  const rows = Object.entries(centroMap).map(([centro, { count, perfiles }]) => ({
    centro_gatuno: centro,
    voluntarios_numero: count,
    voluntarios_perfiles: perfiles.join('; '),
    gatos_numero: gatosMap[centro] ?? null,
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
            color: '#a78bfa',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          ← Volver
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg
            width="44"
            height="44"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            {/* Orejas */}
            <polygon points="16,50 29,6 46,42" fill="#1a1a1a" />
            <polygon points="84,50 71,6 54,42" fill="#1a1a1a" />
            {/* Relleno interior de orejas */}
            <polygon points="22,46 30,18 43,42" fill="#d97706" />
            <polygon points="78,46 70,18 57,42" fill="#d97706" />
            {/* Cabeza */}
            <circle cx="50" cy="60" r="36" fill="#1a1a1a" />
            {/* Ojos blancos */}
            <ellipse cx="37" cy="54" rx="7" ry="9" fill="white" />
            <ellipse cx="63" cy="54" rx="7" ry="9" fill="white" />
            {/* Pupilas verticales */}
            <ellipse cx="37" cy="55" rx="3" ry="7" fill="#111" />
            <ellipse cx="63" cy="55" rx="3" ry="7" fill="#111" />
            {/* Brillo en los ojos */}
            <circle cx="39" cy="51" r="1.5" fill="white" />
            <circle cx="65" cy="51" r="1.5" fill="white" />
            {/* Nariz */}
            <polygon points="50,67 45,73 55,73" fill="#e11d48" />
            {/* Boca */}
            <path d="M 45 73 Q 50 79 55 73" stroke="#e11d48" strokeWidth="1.5" fill="none" />
            <line x1="42" y1="73" x2="45" y2="73" stroke="#e11d48" strokeWidth="1.5" />
            <line x1="55" y1="73" x2="58" y2="73" stroke="#e11d48" strokeWidth="1.5" />
            {/* Bigotes izquierda */}
            <line x1="4" y1="65" x2="42" y2="70" stroke="white" strokeWidth="1.8" />
            <line x1="2" y1="72" x2="42" y2="73" stroke="white" strokeWidth="1.8" />
            <line x1="4" y1="79" x2="42" y2="76" stroke="white" strokeWidth="1.8" />
            {/* Bigotes derecha */}
            <line x1="96" y1="65" x2="58" y2="70" stroke="white" strokeWidth="1.8" />
            <line x1="98" y1="72" x2="58" y2="73" stroke="white" strokeWidth="1.8" />
            <line x1="96" y1="79" x2="58" y2="76" stroke="white" strokeWidth="1.8" />
          </svg>
          <h1 style={{ margin: 0 }}>Colonias Felinas</h1>
        </div>
        <RefreshButton />
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
