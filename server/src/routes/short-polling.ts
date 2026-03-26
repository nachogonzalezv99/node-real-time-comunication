import { Router } from 'express'

const router = Router()

let data = 'Initial data'

setInterval(() => {
  data = 'Update: ' + new Date().toISOString()
}, 5000)

router.get('/', (req, res) => {
  res.json({ data })
})

export default router
