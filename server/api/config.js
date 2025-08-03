/* eslint-disable no-undef */
/* eslint-env node */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde la raíz del proyecto
dotenv.config({ path: resolve(__dirname, "../../.env") });

// Configuración de Supabase para el servidor
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Faltan las variables de entorno VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuración de CORS
export const corsConfig = {
  origin: process.env.VITE_FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

// Configuración de rate limiting
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
};
