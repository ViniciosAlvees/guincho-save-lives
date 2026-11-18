import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const publicEnv = loadEnv(mode, process.cwd(), 'VITE_')
  const allowed = new Set(['VITE_APP_MODE', 'VITE_API_BASE_URL', 'VITE_PYTHON_API_BASE_URL'])
  const unsafe = Object.keys(publicEnv).filter(key =>
    /PASSWORD|PASSWD|SECRET|TOKEN|PRIVATE|API_KEY|DATABASE|JDBC|ORACLE|(?:^|_)DB(?:_|$)/i.test(key)
    || (!allowed.has(key) && !key.startsWith('VITE_VERCEL_')),
  )
  if (unsafe.length) throw new Error(`Variáveis públicas não autorizadas: ${unsafe.join(', ')}. Credenciais devem existir somente no backend, sem prefixo VITE_.`)
  for (const variable of ['VITE_API_BASE_URL', 'VITE_PYTHON_API_BASE_URL']) {
    const value = publicEnv[variable]?.trim()
    if (!value || value === '/api/python') continue
    try {
      const url = new URL(value)
      const local = url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
      if (url.username || url.password || (url.protocol !== 'https:' && !local)) throw new Error()
    } catch { throw new Error(`${variable} deve usar HTTPS (ou HTTP local), sem usuário ou senha na URL, ou /api/python.`) }
  }

  return {
    plugins: [react(), tailwindcss()],
    build: { sourcemap: false },
    server: {
      proxy: {
        '/api/python': {
          target: 'https://python-guincho-save.vercel.app',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/python/, ''),
          proxyTimeout: 90000,
        },
      },
    },
  }
})
