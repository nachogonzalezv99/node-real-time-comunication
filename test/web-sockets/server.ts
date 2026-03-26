import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import express from 'express';

const app = express();
app.use(express.json());

type JobStatus = 'pending' | 'success' | 'error';

interface Job {
  id: string;
  status: JobStatus;
  result?: any;
}

// Jobs en memoria
const jobs = new Map<string, Job>();

// Simula trabajo async
async function processJob(job: Job, broadcast: (job: Job) => void) {
  await new Promise(resolve => setTimeout(resolve, 5000));
  job.status = 'success';
  job.result = { message: 'Trabajo completado' };

  broadcast(job); // avisar a todos los clientes conectados
}

// POST /job crea job
app.post('/job', (req, res) => {
  const id = randomUUID();
  const job: Job = { id, status: 'pending' };
  jobs.set(id, job);

  processJob(job, (job) => {
    // esto se sobrescribirá en el WebSocketServer
  });

  res.json({ jobId: id });
});

// Servidor HTTP
const server = app.listen(3000, () => console.log('Servidor escuchando en puerto 3000'));

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Cliente WS conectado');

  // Enviar jobs actuales al conectar
  for (const job of jobs.values()) {
    ws.send(JSON.stringify(job));
  }

  // Función para enviar job a todos los clientes
  const broadcast = (job: Job) => {
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(job));
      }
    });
  };

  // Sobrescribimos processJob broadcast para este WS
  jobs.forEach(job => {
    if (job.status === 'pending') {
      processJob(job, broadcast);
    }
  });

  ws.on('message', (msg) => {
    console.log('Mensaje del cliente WS:', msg.toString());
  });

  ws.on('close', () => {
    console.log('Cliente WS desconectado');
  });
});