import { Server } from "ws";
import { Server as HTTPServer } from "http";

export function setupWebSocket(server: HTTPServer) {
  const wss = new Server({ server });

  wss.on("connection", ws => {
    console.log("Client connected");

    const interval = setInterval(() => {
      ws.send(JSON.stringify({ time: new Date() }));
    }, 2000);

    ws.on("close", () => clearInterval(interval));
  });
}