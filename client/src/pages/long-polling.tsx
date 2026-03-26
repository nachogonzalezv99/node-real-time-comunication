import { useEffect, useState } from "react";

export default function LongPolling() {
  const [data, setData] = useState("");

  const poll = async () => {
    const res = await fetch("http://localhost:3000/long-polling");
    const json = await res.json();
    setData(json.data);
    poll();
  };

  useEffect(() => {
    poll();
  }, []);

  return <h1>{data}</h1>;
}