export const metadata = {
  title: 'Hackaton URBA',
  description: 'Visor de datos urbanísticos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ background: '#0f172a', color: '#f1f5f9', margin: 0 }}>{children}</body>
    </html>
  )
}
