import express from "express";
import { datadisLogin } from "./service.js";
import { validateRequired } from "../utils/validation.js";
import { handleError, APIError } from "../utils/errors.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    console.log("Recibida petición de login:", {
      nif: req.body.nif,
      password: "[REDACTED]",
    });

    // Validar campos requeridos
    if (!req.body.nif || !req.body.password) {
      console.log("Error de validación: campos requeridos faltantes");
      throw new APIError("NIF y contraseña son requeridos", 400);
    }

    // Validar que el usuario está autenticado
    if (!req.user?.id) {
      console.log("Error: usuario no autenticado");
      throw new APIError("Usuario no autenticado", 401);
    }

    console.log("Iniciando proceso de login...");
    const result = await datadisLogin(
      req.body.nif,
      req.body.password,
      req.user.id
    );

    if (!result.success) {
      console.log("Error en el login:", result.error);
      throw new APIError("Error al autenticar con Datadis", 401);
    }

    console.log("Login exitoso para NIF:", req.body.nif);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
