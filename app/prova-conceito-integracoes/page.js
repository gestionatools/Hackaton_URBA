import { createClient } from '@supabase/supabase-js'
import ProvaConceito from '../components/ProvaConceito'
import RefreshButton from '../components/RefreshButton'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Prova de conceito integrações | Hackaton URBA',
}

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )
}

export default async function ProvaConceitoPage() {
  const supabase = getSupabase()

  const { data, error } = await supabase.from('PT_Urbanismo_Insertar').select('*')

  const errorMsg = error?.message ?? null

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
          ← Voltar
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" stroke="#7c3aed" strokeWidth="2" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#7c3aed" strokeWidth="2" />
          </svg>
          <h1 style={{ margin: 0 }}>Prova de conceito integrações</h1>
        </div>
        <RefreshButton />
      </div>

      {errorMsg ? (
        <p style={{ color: 'red' }}>Erro: {errorMsg}</p>
      ) : (
        <ProvaConceito rows={data ?? []} />
      )}
    </main>
  )
}
