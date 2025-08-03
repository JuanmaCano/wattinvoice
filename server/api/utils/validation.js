import { APIError } from "./errors.js";

export const validateRequired = (data, fields) => {
  const missing = fields.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new APIError(
      `Campos requeridos: ${missing.join(", ")}`,
      400,
      "VALIDATION_ERROR"
    );
  }
};

export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new APIError("Fechas inválidas", 400, "VALIDATION_ERROR");
  }

  if (start > end) {
    throw new APIError(
      "La fecha de inicio debe ser anterior a la fecha de fin",
      400,
      "VALIDATION_ERROR"
    );
  }

  // Limitar a máximo 1 año
  const oneYear = 365 * 24 * 60 * 60 * 1000;
  if (end - start > oneYear) {
    throw new APIError(
      "El rango de fechas no puede ser mayor a 1 año",
      400,
      "VALIDATION_ERROR"
    );
  }
};
