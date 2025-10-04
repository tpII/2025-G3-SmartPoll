import {generateTAV }  from './utils/tav.ts'
import express from 'express';
const app = express()
let clients = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  console.log("Client connected");
  clients.push(res);

  req.on("close", () => {
    clients = clients.filter(c => c !== res);
  });
});

// Endpoint que habilita la votación
app.post("/authorize-voter", (req, res) => {
  const {tav, signature} = generateTAV();

  clients.forEach(client => {
    client.write(`data: ${JSON.stringify({ tav, signature })}\n\n`);
  });

  res.send({ ok: true });
});

app.listen(8080, () => console.log("SSE server running on 8080"));
