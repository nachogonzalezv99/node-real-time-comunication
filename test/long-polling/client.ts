async function fetchWithTimeout(url: string, timeout = 15000) {
  const controller = new AbortController()

  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(url, { signal: controller.signal })
    return res
  } finally {
    clearTimeout(id)
  }
}

async function waitForJob(jobId: string) {
  while (true) {
    try {
      const res = await fetchWithTimeout(`/job/${jobId}`, 20000)

      if (res.status === 204) {
        continue
      }

      const job = await res.json()

      if (job.status === 'pending') {
        continue
      }

      return job
    } catch (err) {
      // 🔥 clave: distinguir abort vs error real
      console.warn('Retry por error o timeout', err)

      await new Promise(r => setTimeout(r, 1000))
    }
  }
}

// uso
const { jobId } = await fetch('/job', { method: 'POST' }).then(r => r.json())

const result = await waitForJob(jobId)
console.log('Resultado final:', result)
