export const validateNIF = (nif) => {
  if (!nif) return { isValid: false, error: "El NIF es requerido" };

  // Convertir a mayúsculas y eliminar espacios
  nif = nif.toUpperCase().trim();

  // Patrones de NIF válidos
  const patterns = {
    dni: /^[0-9]{8}[A-Z]$/, // DNI: 8 números + 1 letra
    nie: /^[XYZ][0-9]{7}[A-Z]$/, // NIE: X/Y/Z + 7 números + 1 letra
    cif: /^[A-HJNPQRSUVW][0-9]{7}[0-9A-J]$/, // CIF: Letra + 7 números + número o letra
  };

  // Verificar formato básico
  const isValidFormat = Object.values(patterns).some((pattern) =>
    pattern.test(nif)
  );
  if (!isValidFormat) {
    return {
      isValid: false,
      error:
        "Formato de NIF inválido. Debe ser DNI (8 números + letra), NIE (X/Y/Z + 7 números + letra) o CIF (letra + 7 números + número/letra)",
    };
  }

  // Validación específica para DNI
  if (patterns.dni.test(nif)) {
    const dniNumber = parseInt(nif.slice(0, 8));
    const dniLetter = nif.slice(8);
    const validLetters = "TRWAGMYFPDXBNJZSQVHLCKE";
    const expectedLetter = validLetters[dniNumber % 23];

    if (dniLetter !== expectedLetter) {
      return { isValid: false, error: "Letra de DNI inválida" };
    }
  }

  return { isValid: true, error: null };
};
