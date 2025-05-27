import { getProfile, updateProfileToken } from "../services/profile.js";
import { validateDatadisCredentials } from "../services/datadis.js";
import { isTokenNearExpiration } from "../../utils/jwt.js";

export const datadisLoginHandler = async (req, res) => {
  try {
    const { nif, password, userId } = req.body;

    if (!nif || !password || !userId) {
      return res.status(400).json({
        error: "NIF, contraseña y userId son requeridos",
      });
    }

    const profile = await getProfile(userId);

    if (!profile) {
      return res.status(404).json({
        error: "Perfil no encontrado",
        details:
          "Debe crear primero el perfil antes de configurar las credenciales de Datadis",
      });
    }

    // Si el token existe y no está próximo a expirar, lo devolvemos
    if (
      profile.datadis_token &&
      !isTokenNearExpiration(profile.datadis_token)
    ) {
      return res.json({
        success: true,
        message: "Token válido existente",
        token: profile.datadis_token,
        shouldRenew: false,
      });
    }

    // Si el token no existe o está próximo a expirar, obtenemos uno nuevo
    const token = await validateDatadisCredentials(nif, password);
    await updateProfileToken(userId, token);

    res.json({
      success: true,
      message: "Token actualizado correctamente",
      token,
      shouldRenew: true,
    });
  } catch (error) {
    const statusCode = error.message.includes(
      "Credenciales de Datadis inválidas"
    )
      ? 401
      : 500;

    res.status(statusCode).json({
      error: "Error al validar las credenciales",
      details: error.message,
    });
  }
};
