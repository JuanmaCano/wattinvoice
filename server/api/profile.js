import { supabase } from "../lib/supabase";

export const updateProfile = async ({ user_id, nif, datadis_password }) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user_id,
          nif: nif.toUpperCase().trim(),
          datadis_password,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { data: null, error };
  }
};

export const testAuth = async (userId) => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("datadis_token, datadis_token_updated_at")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    if (!profile?.datadis_token) {
      return {
        data: { isValid: false, expiresAt: null, shouldRenew: false },
        error: null,
      };
    }

    const tokenData = JSON.parse(atob(profile.datadis_token.split(".")[1]));
    const expiresAt = new Date(tokenData.exp * 1000);
    const now = new Date();
    const isValid = now < expiresAt;
    const shouldRenew = isValid && (expiresAt - now) / (1000 * 60 * 60) < 24; // Renovar si expira en menos de 24 horas

    return {
      data: { isValid, expiresAt, shouldRenew },
      error: null,
    };
  } catch (error) {
    console.error("Error testing auth:", error);
    return { data: null, error };
  }
};
