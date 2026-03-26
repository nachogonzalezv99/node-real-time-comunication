const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  console.log('Conectado a WS');
};

ws.onmessage = (event) => {
  const job = JSON.parse(event.data);
  console.log('Job actualizado:', job);
};

// Enviar mensaje al servidor
ws.send(JSON.stringify({ action: 'ping' }));