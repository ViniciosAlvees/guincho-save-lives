import { describe, expect, it } from 'vitest'
import { youtubeLink } from './pitch'

describe('links públicos do Pitch', () => {
  it.each(['https://youtu.be/abcdefghijk', 'https://www.youtube.com/watch?v=abcdefghijk&feature=share'])('normaliza somente o vídeo permitido', url => {
    expect(youtubeLink(url)).toBe('https://www.youtube.com/watch?v=abcdefghijk')
  })
  it.each([null, '', 'javascript:alert(1)', 'http://youtu.be/abcdefghijk', 'https://youtube.com.evil.test/watch?v=abcdefghijk', 'https://user:password@youtube.com/watch?v=abcdefghijk', 'https://youtube.com/redirect?q=evil', 'https://youtu.be/invalid'])('rejeita links indevidos ou incompletos', url => {
    expect(youtubeLink(url)).toBeNull()
  })
})
