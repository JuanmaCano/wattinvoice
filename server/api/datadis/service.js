/* eslint-disable no-undef */
// Lógica de negocio para Datadis
import { supabase } from "../config.js";
import { APIError } from "../utils/errors.js";
import { encryptPassword, decryptPassword } from "../../utils/encryption.js";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const ENCRYPTION_KEY = process.env.VITE_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  console.error("ENCRYPTION_KEY no está definida en las variables de entorno");
  process.exit(1);
}

export async function datadisLogin(nif, encryptedPassword, userId) {
  console.log("Iniciando proceso de login para NIF:", nif);

  try {
    // Desencriptar la contraseña para enviarla a Datadis
    console.log("Desencriptando contraseña...");
    const password = decryptPassword(encryptedPassword, ENCRYPTION_KEY);

    // Llamar a la API de Datadis para obtener el token
    console.log("Llamando a la API de Datadis...");
    const formData = new FormData();
    formData.append("username", nif);
    formData.append("password", password);

    const response = await fetch(
      "https://datadis.es/nikola-auth/tokens/login",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      console.error(
        "Error en la respuesta de Datadis:",
        response.status,
        response.statusText
      );
      throw new APIError("Error al autenticar con Datadis", 401);
    }

    const token = await response.text();
    console.log("Token obtenido exitosamente");

    // Encriptar la contraseña antes de guardarla
    console.log("Encriptando contraseña para guardar...");
    const newEncryptedPassword = encryptPassword(password, ENCRYPTION_KEY);

    // Guardar el token y la contraseña encriptada en la tabla profiles
    console.log("Guardando token y contraseña en profiles...");
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        datadis_password: newEncryptedPassword,
        datadis_token: token,
        datadis_token_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Error al guardar token:", updateError);
      throw new APIError("Error al guardar el token", 500);
    }

    console.log("Token y contraseña guardados exitosamente");
    return {
      success: true,
      token,
    };
  } catch (error) {
    console.error("Error en datadisLogin:", error);
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError("Error en el proceso de login", 500);
  }
}

export const getConsumption = async (cups, startDate, endDate) => {
  try {
    // Obtener el token de Datadis del perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("datadis_token")
      .single();

    if (profileError) throw profileError;
    if (!profile?.datadis_token) {
      throw new Error("No hay token de Datadis disponible");
    }

    // Primero obtenemos el suministro para tener el distributor
    const { data: supply, error: supplyError } = await supabase
      .from("supplies")
      .select("distributor_code")
      .eq("cups", cups)
      .single();

    if (supplyError) throw supplyError;
    if (!supply) {
      throw new Error("No se encontró el suministro");
    }

    // Llamar a la API de Datadis para obtener el consumo
    const response = await fetch(
      `https://datadis.es/api-private/api/get-consumption-data?cups=${cups}&distributor=${supply.distributor_code}&startDate=${startDate}&endDate=${endDate}&measurementType=0`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${profile.datadis_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error en la API de Datadis: ${response.statusText}`);
    }

    const consumptionData = await response.json();

    // Actualizar la fecha de última actualización en la tabla supplies
    const { error: updateError } = await supabase
      .from("supplies")
      .update({
        last_consumption_update: new Date().toISOString(),
        consumption_data: consumptionData,
      })
      .eq("cups", cups);

    if (updateError) throw updateError;

    return {
      success: true,
      data: {
        cups,
        period: { startDate, endDate },
        readings: consumptionData,
      },
    };
  } catch (error) {
    console.error("Error en servicio de consumo:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getSupplies = async (userId) => {
  try {
    // Obtener el token de Datadis del perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("datadis_token")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;
    if (!profile?.datadis_token) {
      throw new Error("No hay token de Datadis disponible");
    }

    // Llamar a la API de Datadis
    const response = await fetch(
      "https://datadis.es/api-private/api/get-supplies",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${profile.datadis_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error en la API de Datadis: ${response.statusText}`);
    }

    const supplies = await response.json();

    // Guardar los suministros en la base de datos
    const { error: upsertError } = await supabase.from("supplies").upsert(
      supplies.map((supply) => ({
        user_id: userId,
        cups: supply.cups,
        address: supply.address,
        postal_code: supply.postalCode,
        province: supply.province,
        municipality: supply.municipality,
        distributor: supply.distributor,
        valid_date_from: supply.validDateFrom,
        valid_date_to: supply.validDateTo || null,
        point_type: supply.pointType,
        distributor_code: supply.distributorCode,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "user_id,cups" }
    );

    if (upsertError) throw upsertError;

    return {
      success: true,
      data: supplies,
    };
  } catch (error) {
    console.error("Error al obtener suministros:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
