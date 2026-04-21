/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/prova-conceito-integracoes',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
