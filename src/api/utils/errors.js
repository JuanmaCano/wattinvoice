export class APIError extends Error {
  constructor(message, status = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const handleError = (error, res) => {
  console.error(error);

  if (error instanceof APIError) {
    return res.status(error.status).json({
      success: false,
      error: error.message,
      code: error.code,
    });
  }

  return res.status(500).json({
    success: false,
    error: "Error interno del servidor",
    code: "INTERNAL_ERROR",
  });
};
