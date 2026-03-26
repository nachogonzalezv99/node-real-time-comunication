import { Router } from "express";

const router = Router();

let data = "Initial data";
let clients: any[] = [];

setInterval(() => {
  data = "Update: " + new Date().toISOString();
  clients.forEach(res => res.json({ data }));
  clients = [];
}, 5000);

router.get("/", (req, res) => {
  clients.push(res);
});

export default router;