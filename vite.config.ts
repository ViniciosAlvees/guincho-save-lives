import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const publicEnv = loadEnv(mode, process.cwd(), 'VITE_')
  const allowed = new Set(['VITE_APP_MODE', 'VITE_API_BASE_URL'])
  const unsafe = Object.keys(publicEnv).filter(key =>
    /PASSWORD|PASSWD|SECRET|TOKEN|PRIVATE|API_KEY|DATABASE|JDBC|ORACLE|(?:^|_)DB(?:_|$)/i.test(key)
    || (!allowed.has(key) && !key.startsWith('VITE_VERCEL_')),
  )
  if (unsafe.length) throw new Error(`Variáveis públicas não autorizadas: ${unsafe.join(', ')}. Credenciais devem existir somente no backend, sem prefixo VITE_.`)
  if (publicEnv.VITE_API_BASE_URL?.trim()) {
    try {
      const url = new URL(publicEnv.VITE_API_BASE_URL.trim())
      const local = url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
      if (url.username || url.password || (url.protocol !== 'https:' && !local)) throw new Error()
    } catch { throw new Error('VITE_API_BASE_URL deve usar HTTPS (ou HTTP local), sem usuário ou senha na URL.') }
  }

  return {
    plugins: [react(), tailwindcss()],
    build: { sourcemap: false },
  }
})
