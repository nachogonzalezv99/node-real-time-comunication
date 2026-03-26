import { useEffect, useState } from "react";

export default function ShortPolling() {
  const [data, setData] = useState("");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("http://localhost:3000/polling");
      const json = await res.json();
      setData(json.data);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return <h1>{data}</h1>;
}