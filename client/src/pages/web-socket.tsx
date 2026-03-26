import { useEffect, useState } from "react";

export default function WebSocketPage() {
  const [data, setData] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setData(parsed.time);
    };

    return () => ws.close();
  }, []);

  return <h1>{data}</h1>;
}