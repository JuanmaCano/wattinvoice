import { createClient } from "@supabase/supabase-js";
import { config } from "./config";

const { url, anonKey } = config.supabase;

if (!url || !anonKey) {
  throw new Error("Faltan las variables de entorno de Supabase");
}

export const supabase = createClient(url, anonKey);
