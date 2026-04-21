/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'www.pruebas.concepto.integraciones.com' }],
          destination: '/prova-conceito-integracoes',
        },
      ],
    }
  },
}

module.exports = nextConfig
