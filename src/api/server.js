/* eslint-env node */
/* global process */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { datadisLoginHandler } from "./handlers/datadis.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: resolve(__dirname, "../../.env") });

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
});
app.use(limiter);

// Rutas API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Rutas
app.post("/api/datadis/login", datadisLoginHandler);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor API corriendo en http://localhost:${port}`);
});

export default app;
