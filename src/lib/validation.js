export const validateNIF = (nif) => {
  if (!nif) {
    return { isValid: false, error: "El NIF es requerido" };
  }

  // Eliminar espacios y convertir a mayúsculas
  const cleanNIF = nif.trim().toUpperCase();

  // Validar formato básico (8 números + letra o X/K + 7 números + letra)
  const nifRegex = /^[0-9]{8}[A-Z]|[XK][0-9]{7}[A-Z]$/;
  if (!nifRegex.test(cleanNIF)) {
    return {
      isValid: false,
      error: "El formato del NIF no es válido",
    };
  }

  // Validar letra de control
  const letter = cleanNIF.slice(-1);
  const number = cleanNIF.slice(0, -1).replace(/^[XK]/, "0");
  const mod = number % 23;
  const validLetters = "TRWAGMYFPDXBNJZSQVHLCKE";
  const validLetter = validLetters.charAt(mod);

  if (letter !== validLetter) {
    return {
      isValid: false,
      error: "La letra del NIF no es válida",
    };
  }

  return { isValid: true, error: null };
};
