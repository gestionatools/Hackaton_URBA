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

export default async function ColoniasFelinasPage() {
  const supabase = getSupabase()

  const [voluntariosRes, asignacionesRes] = await Promise.all([
    supabase.from('HACK_CATS_Voluntarios').select('*'),
    supabase.from('HACK_CATS_Asignaciones').select('*'),
  ])

  const errorMsg = voluntariosRes.error?.message || asignacionesRes.error?.message || null

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
        />
      )}
    </main>
  )
}
