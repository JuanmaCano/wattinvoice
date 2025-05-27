/* eslint-env node */
/* global process */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde la raíz del proyecto
const envPath = resolve(process.cwd(), ".env");
console.log("Intentando cargar variables de entorno desde:", envPath);

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("Error al cargar .env:", result.error);
  throw new Error("No se pudo cargar el archivo .env");
}

console.log("Variables de entorno cargadas:", {
  hasUrl: !!process.env.VITE_SUPABASE_URL,
  hasAnonKey: !!process.env.VITE_SUPABASE_ANON_KEY,
  hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Variables de entorno faltantes:", {
    supabaseUrl: !!supabaseUrl,
    serviceRoleKey: !!serviceRoleKey,
  });
  throw new Error("Faltan las variables de entorno de Supabase (backend)");
}

// Inicializar cliente de Supabase con service_role key
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
