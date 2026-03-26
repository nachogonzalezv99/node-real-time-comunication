import { Router } from 'express'

const router = Router()

let content = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  text: `Elemento ${i + 1}`
}))

// Para datos dinámicos
router.get('/', (req, res) => {
  console.log('/cache')

  // * No necesario en express, ya que añade un etag serializando la response,
  // enviando 304 si el content es el mismo

  // const jsonContent = JSON.stringify(content)
  // const etag = crypto.createHash('md5').update(jsonContent).digest('hex')

  // if (req.headers['if-none-match'] === etag) {
  //   return res.status(304).end()
  // }

  // res.setHeader('ETag', etag)

  res.setHeader('Cache-Control', 'public, no-cache, stale-while-revalidate=10, stale-if-error=86400')

  res.json({ content })
})

// Para datos estáticos
router.get('/static', (req, res) => {
  console.log('/cache/static')

  res.setHeader('Cache-Control', 'public, max-age=600 stale-while-revalidate=300, stale-if-error=86400')

  res.json({ content })
})

export default router
