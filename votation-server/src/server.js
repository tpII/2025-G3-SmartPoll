import { generateTAV, verifyTAV } from './utils/tav.ts'
import { setVoterTav, getVoterTav } from './redis.js';
import { TTL } from './utils/consts.js';
import express from 'express';
import cors from 'cors';
import { blockchainGateway } from './importAdminIdentity.js';
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
app.use(cors({ origin: '*' }));

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
app.post("/authorize-voter", async (req, res) => {
  const { tav, signature } = generateTAV();

  await setVoterTav(tav, signature, TTL);

  clients.forEach(client => {
    client.write(`data: ${JSON.stringify({ enabled: true, tav })}\n\n`);
  });

  res.send({ ok: true });
});

app.post("/vote", async (req, res) => {
  const { tav, candidateId } = req.body;

  const voter = await getVoterTav(tav);

  const isValid = voter && verifyTAV(tav, voter.signature);

  if (!isValid) {
    return res.status(400).send({ ok: false, error: "Invalid TAV or signature" });
  }

  console.log(`Voto recibido para el candidato ${candidateId} con TAV ${tav}`);

  try {
    await blockchainGateway(tav, "election1", candidateId);
  } catch (error) {
    console.error("Error en la transacción:", error);
    return res.status(500).send({ ok: false, error: "Error en la transacción" });
  }

  res.send({ ok: true });
})

app.listen(8080, "0.0.0.0", () => console.log("Webserver running on 8080"));
