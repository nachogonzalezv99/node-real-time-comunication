import express from 'express';
import { randomUUID } from 'crypto';

const app = express();
app.use(express.json());

type JobStatus = 'pending' | 'success' | 'error';

interface Job {
  id: string;
  status: JobStatus;
  result?: any;
}

// jobs en memoria
const jobs = new Map<string, Job>();

// SSE: para cada cliente mantenemos un array de conexiones
const sseClients: Set<express.Response> = new Set();

// Simula trabajo async
async function processJob(job: Job) {
  await new Promise(resolve => setTimeout(resolve, 5000));
  job.status = 'success';
  job.result = { message: 'Trabajo completado' };

  // notificar todos los clientes SSE
  for (const res of sseClients) {
    res.write(`event: job-update\ndata: ${JSON.stringify(job)}\n\n`);
  }
}

// POST /job crea job
app.post('/job', (req, res) => {
  const id = randomUUID();
  const job: Job = { id, status: 'pending' };
  jobs.set(id, job);

  processJob(job);

  res.json({ jobId: id });
});

// GET /jobs/stream → SSE
app.get('/jobs/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  // enviamos todos los jobs actuales al cliente al conectar
  for (const job of jobs.values()) {
    res.write(`event: job-update\ndata: ${JSON.stringify(job)}\n\n`);
  }

  // registramos la conexión
  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

app.listen(3000, () => console.log('Servidor SSE escuchando en puerto 3000'));