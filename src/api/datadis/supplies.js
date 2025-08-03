import { getSupplies } from "./service.js";
import { handleError } from "../utils/errors.js";

export const datadisSuppliesHandler = async (req, res) => {
  try {
    // El userId viene del middleware de autenticación
    const userId = req.user.id;

    const result = await getSupplies(userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};
