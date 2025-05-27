import { getConsumption } from "./service.js";
import { validateRequired, validateDateRange } from "../utils/validation.js";
import { handleError } from "../utils/errors.js";

export const datadisConsumptionHandler = async (req, res) => {
  try {
    validateRequired(req.query, ["cups", "startDate", "endDate"]);
    validateDateRange(req.query.startDate, req.query.endDate);

    const result = await getConsumption(
      req.query.cups,
      req.query.startDate,
      req.query.endDate
    );

    res.json(result);
  } catch (error) {
    handleError(error, res);
  }
};
