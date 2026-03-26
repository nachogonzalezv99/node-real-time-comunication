import { useState } from "react";

export default function Cache() {
  const [data, setData] = useState([]);

  const fetchData = async () => {

    const res = await fetch("http://localhost:3000/cache");
    if (res.status === 304) {
      // setData(["Not Modified (cache)"]);
      return;
    }
    if (res.status === 500) {
      // setData(["Not Modified (cache)"]);
      return;
    }
    const json = await res.json();
    setData(json.content);
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch</button>
      <div>
        {Array.isArray(data) ? (
          data.slice(100).map(item => (
            <p key={item.id}>{item.text}</p>
          ))
        ) : (
          <p>{data}</p>
        )}
      </div>
    </div>
  );
}