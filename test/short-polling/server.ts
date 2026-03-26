import express from 'express'
import { randomUUID } from 'crypto'

const app = express()
app.use(express.json())

type JobStatus = 'pending' | 'success' | 'error'

interface Job {
  id: string
  status: JobStatus
  result?: any
  error?: string
}

const jobs = new Map<string, Job>()

async function processJob(job: Job) {
  try {
    // simulación de trabajo async real
    await new Promise(resolve => setTimeout(resolve, 5000))

    job.status = 'success'
    job.result = { message: 'Trabajo completado' }
  } catch (err) {
    job.status = 'error'
    job.error = 'Falló el proceso'
  }
}

// -------------------- ENDPOINTS --------------------

// Crear job
app.post('/job', (req, res) => {
  const id = randomUUID()

  const job: Job = { id, status: 'pending' }
  jobs.set(id, job)

  processJob(job)

  res.json({ jobId: id })
})

// SHORT POLLING por job (respuesta inmediata)
app.get('/job/:id', (req, res) => {
  const job = jobs.get(req.params.id)
  if (!job) return res.status(404).json({ error: 'Job no existe' })

  // siempre responde inmediatamente
  res.json(job)
})

// -------------------- INICIO SERVIDOR --------------------
const PORT = 3000
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`))