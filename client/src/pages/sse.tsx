import { useEffect, useState } from "react";

export default function SSE() {
  const [data, setData] = useState("");

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/sse");

    eventSource.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setData(parsed.time);
    };

    return () => eventSource.close();
  }, []);

  return <h1>{data}</h1>;
}