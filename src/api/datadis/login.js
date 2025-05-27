import { datadisLogin } from "./service.js";
import { validateRequired } from "../utils/validation.js";
import { handleError } from "../utils/errors.js";

export const datadisLoginHandler = async (req, res) => {
  try {
    validateRequired(req.body, ["username", "password"]);
    const result = await datadisLogin(req.body.username, req.body.password);
    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};
