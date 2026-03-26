interface Job {
  id: string
  status: 'pending' | 'success' | 'error'
  result?: any
  error?: string
}

// Función de polling
async function waitForJob(jobId: string, interval = 2000): Promise<Job> {
  while (true) {
    try {
      const res = await fetch(`/job/${jobId}`)
      if (!res.ok) throw new Error('Job no encontrado')

      const job: Job = await res.json()

      // si el job terminó, retornamos
      if (job.status !== 'pending') {
        return job
      }

      // si sigue pendiente, esperar interval antes de preguntar otra vez
      await new Promise(r => setTimeout(r, interval))
    } catch (err) {
      console.error('Error en short polling:', err)
      // reintento tras pequeño delay
      await new Promise(r => setTimeout(r, interval))
    }
  }
}

// Uso
async function run() {
  // crear job
  const { jobId } = await fetch('/job', { method: 'POST' }).then(r => r.json())

  console.log('Job creado con id:', jobId)

  // esperar resultado con short polling
  const result = await waitForJob(jobId)

  console.log('Resultado final del job:', result)
}

run()
