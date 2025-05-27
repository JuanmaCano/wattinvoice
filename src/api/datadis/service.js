// Lógica de negocio para Datadis
import { supabase } from "../config.js";
import { encryptPassword, decryptPassword } from "../../utils/encryption.js";

export const datadisLogin = async (username, password) => {
  try {
    // Encriptar credenciales antes de almacenarlas
    const encryptedPassword = await encryptPassword(password);

    // Almacenar credenciales en Supabase
    const { data, error } = await supabase
      .from("datadis_credentials")
      .upsert(
        {
          username,
          password: encryptedPassword,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "username" }
      )
      .select()
      .single();

    if (error) throw error;

    // Generar token de sesión
    const token = await encryptPassword(
      JSON.stringify({ username, timestamp: Date.now() })
    );

    return {
      success: true,
      token,
      user: { username: data.username },
    };
  } catch (error) {
    console.error("Error en servicio de login:", error);
    return {
      success: false,
      error: "Error al autenticar con Datadis",
    };
  }
};

export const getConsumption = async (cups, startDate, endDate) => {
  try {
    // Obtener credenciales de Supabase
    const { data: credentials, error: credError } = await supabase
      .from("datadis_credentials")
      .select("username, password")
      .single();

    if (credError) throw credError;

    // Desencriptar contraseña para uso futuro con la API de Datadis
    await decryptPassword(credentials.password); // Guardamos la desencriptación para cuando implementemos la API real

    // TODO: Implementar llamada real a la API de Datadis usando las credenciales
    // Por ahora retornamos datos de ejemplo
    const mockData = {
      cups,
      period: { startDate, endDate },
      readings: [
        { date: startDate, value: 100 },
        { date: endDate, value: 150 },
      ],
    };

    return {
      success: true,
      data: mockData,
    };
  } catch (error) {
    console.error("Error en servicio de consumo:", error);
    return {
      success: false,
      error: "Error al obtener datos de consumo",
    };
  }
};
