# Instrucciones base — Next.js + Supabase + Vercel

Plantilla para crear una app mínima que despliega en Vercel y visualiza una tabla de Supabase.

---

## Stack

| Tecnología | Versión |
|---|---|
| Next.js | 15.1.9 (App Router) |
| React | 19.1.4 |
| react-dom | 19.1.4 |
| @supabase/supabase-js | ^2.47.0 |
| Node.js | >=20.9.0 |

> **Versiones de seguridad mínimas:** `next@15.1.9` y `react@19.1.4` corrigen CVE-2025-66478 (RCE crítico CVSS 10.0). No usar versiones anteriores.

---

## Estructura de archivos

```
raíz/
├── app/
│   ├── layout.js       ← layout raíz obligatorio (App Router)
│   └── page.js         ← página principal con conexión a Supabase
├── next.config.js
├── package.json
└── .gitignore
```

---

## 1. package.json

```json
{
  "name": "<!-- INSERTAR NOMBRE DE LA APP -->",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.47.0",
    "next": "15.1.9",
    "react": "19.1.4",
    "react-dom": "19.1.4"
  },
  "engines": {
    "node": ">=20.9.0"
  }
}
```

---

## 2. next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
```

---

## 3. app/layout.js

```js
export const metadata = {
  title: '<!-- INSERTAR TÍTULO DE LA APP -->',
  description: '<!-- INSERTAR DESCRIPCIÓN -->',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
```

---

## 4. app/page.js

Server Component que conecta a Supabase y muestra la tabla.

```js
import { createClient } from '@supabase/supabase-js'

async function getData() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )

  // INSERTAR AQUÍ EL NOMBRE DE LA TABLA (esquema public por defecto)
  const { data, error } = await supabase.from('NOMBRE_DE_LA_TABLA').select('*')
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

  // INSERTAR AQUÍ LAS COLUMNAS DE LA TABLA (en el mismo orden que el schema)
  const columns = [
    'columna_1',
    'columna_2',
    'columna_3',
    // ...
  ]

  return (
    <main style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      {/* INSERTAR AQUÍ EL TÍTULO VISIBLE */}
      <h1>NOMBRE DE LA TABLA</h1>
      {errorMsg && <p style={{ color: 'red' }}>Error: {errorMsg}</p>}
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
              {rows.map((row, i) => (
                // INSERTAR AQUÍ EL NOMBRE DE LA COLUMNA PRIMARY KEY en lugar de 'i'
                <tr key={row.id ?? i}>
                  {columns.map((col) => (
                    <td key={col} style={{ border: '1px solid #ccc', padding: '4px 8px', whiteSpace: 'nowrap' }}>
                      {row[col] ?? ''}
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
```

---

## 5. .gitignore

```
node_modules/
.next/
.env
.env.local
```

> El archivo debe llamarse `.gitignore` (con punto), no `gitignore`.

---

## 6. Supabase — configuración

### Base de datos

<!-- INSERTAR AQUÍ EL NOMBRE DE LA BDD EN SUPABASE -->

### Tabla utilizada

<!-- INSERTAR AQUÍ EL NOMBRE DE LA TABLA, p.ej. public."NOMBRE_TABLA" -->

### Schema de la tabla

```sql
-- INSERTAR AQUÍ EL CREATE TABLE completo
-- Ejemplo:
create table public."NOMBRE_TABLA" (
  "ID" bigint not null,
  columna_texto text null,
  columna_numero double precision null,
  constraint NOMBRE_TABLA_pkey primary key ("ID")
) TABLESPACE pg_default;
```

### Variables de entorno requeridas

| Variable | Dónde obtenerla |
|---|---|
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon/public key |

> Estas variables **nunca** deben commitearse. Añadirlas en `.env.local` para desarrollo local y en Vercel para producción.

---

## 7. Deploy en Vercel

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. En **Settings → Environment Variables** añadir:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Framework preset: **Next.js** (detectado automáticamente)
4. Branch de producción: `main`
5. Hacer push → Vercel lanza el build automáticamente

### Errores comunes

| Error | Causa | Solución |
|---|---|---|
| `Cannot find module` al instalar | Versión de Next.js inexistente en npm | Verificar que la versión existe en npmjs.com |
| `Vulnerable version of Next.js detected` | CVE-2025-66478 | Usar `next>=15.1.9` y `react>=19.1.4` |
| Página en blanco sin error | `page.js` en la raíz en vez de `app/` | Mover a `app/page.js` y añadir `app/layout.js` |
| `Error: supabase...` en runtime | Variables de entorno no configuradas en Vercel | Añadirlas en Project Settings → Environment Variables |

---

## 8. Desarrollo local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo de variables de entorno local
echo "SUPABASE_URL=https://xxxx.supabase.co" >> .env.local
echo "SUPABASE_ANON_KEY=eyJ..." >> .env.local

# 3. Arrancar servidor de desarrollo
npm run dev
# → http://localhost:3000
```

---

## Notas de seguridad

- **CVE-2025-66478** (CVSS 10.0): RCE via React Server Components en versiones anteriores. Corregido en `next@15.1.9` + `react@19.1.4`. No existe workaround, solo actualizar.
- La `SUPABASE_ANON_KEY` es pública por diseño (seguridad basada en RLS), pero la `service_role` key **nunca** debe exponerse.
- Activar Row Level Security (RLS) en Supabase si la tabla contiene datos sensibles.
