/* eslint-env node */
/* global process */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { corsConfig, rateLimitConfig } from "./config.js";
import datadisRouter from "./datadis/login.js";
import { datadisConsumptionHandler } from "./datadis/consumption.js";
import { datadisSuppliesHandler } from "./datadis/supplies.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors(corsConfig));
app.use(helmet());
app.use(express.json());

// Rate limiting
app.use(rateLimit(rateLimitConfig));

// Rutas API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Rutas de Datadis
app.use("/api/datadis", datadisRouter);
app.get("/api/datadis/consumption", datadisConsumptionHandler);
app.get("/api/datadis/supplies", datadisSuppliesHandler);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor API corriendo en http://localhost:${port}`);
});

export default app;
