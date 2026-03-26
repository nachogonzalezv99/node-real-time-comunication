const evtSource = new EventSource('http://localhost:3000/jobs/stream');

evtSource.addEventListener('job-update', (event) => {
  const job = JSON.parse(event.data);
  console.log('Job actualizado:', job);
});

evtSource.onerror = (err) => {
  console.error('Error SSE:', err);
};