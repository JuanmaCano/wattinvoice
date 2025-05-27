import { supabaseAdmin } from "../config/supabase.js";

export const getProfile = async (userId) => {
  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("datadis_token, datadis_token_updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Error al verificar el perfil: ${error.message}`);
  }

  return profile;
};

export const updateProfileToken = async (userId, token) => {
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      datadis_token: token,
      datadis_token_updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    throw new Error(`Error al actualizar el token: ${error.message}`);
  }
};
