import { randomUUID } from 'crypto'
import app from 'express'
type JobStatus = 'pending' | 'success' | 'error'

interface Job {
  id: string
  status: JobStatus
  result?: any
  error?: string
}

const jobs = new Map<string, Job>()

// clientes esperando por jobId
const listeners = new Map<string, ((job: Job) => void)[]>()

function notifyListeners(job: Job) {
  const jobListeners = listeners.get(job.id) || []

  jobListeners.forEach(listener => listener(job))

  listeners.delete(job.id)
}

async function processJob(job: Job) {
  try {
    // aquí iría tu lógica real
    await new Promise(resolve => setTimeout(resolve, 5000))

    job.status = 'success'
    job.result = { message: 'Trabajo completado' }
  } catch (err) {
    job.status = 'error'
    job.error = 'Falló el proceso'
  }

  notifyListeners(job)
}

app.post('/job', (req, res) => {
  const id = randomUUID()

  const job: Job = {
    id,
    status: 'pending'
  }

  jobs.set(id, job)

  // simular proceso async real (ej: worker)
  processJob(job)

  res.json({ jobId: id })
})

app.get('/job/:id', (req, res) => {
  const job = jobs.get(req.params.id)

  if (!job) {
    return res.status(404).json({ error: 'Job no existe' })
  }

  // 🔥 CASO 1: ya terminó → responder inmediato
  if (job.status !== 'pending') {
    return res.json(job)
  }

  // 🔥 CASO 2: sigue pendiente → long polling real
  const timeout = setTimeout(() => {
    // timeout de seguridad (ej: 30s)
    res.status(204).end()
  }, 30000)

  const listener = (updatedJob: Job) => {
    clearTimeout(timeout)
    res.json(updatedJob)
  }

  if (!listeners.has(job.id)) {
    listeners.set(job.id, [])
  }

  listeners.get(job.id)!.push(listener)

  // limpieza si el cliente se desconecta
  req.on('close', () => {
    clearTimeout(timeout)
    const arr = listeners.get(job.id) || []
    listeners.set(
      job.id,
      arr.filter(l => l !== listener)
    )
  })
})
