import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import ShortPolling from "./pages/short-polling";
import LongPolling from "./pages/long-polling";
import SSE from "./pages/sse";
import WebSocketPage from "./pages/web-socket";
import Cache from "./pages/cache";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Short</Link> | 
        <Link to="/long">Long</Link> | 
        <Link to="/sse">SSE</Link> | 
        <Link to="/ws">WebSocket</Link> | 
        <Link to="/cache">Cache</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ShortPolling />} />
        <Route path="/long" element={<LongPolling />} />
        <Route path="/sse" element={<SSE />} />
        <Route path="/ws" element={<WebSocketPage />} />
        <Route path="/cache" element={<Cache />} />
      </Routes>
    </BrowserRouter>
  );
}