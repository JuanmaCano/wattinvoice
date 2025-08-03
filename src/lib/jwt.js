import { jwtDecode } from "jwt-decode";

export const getTokenExpiration = (token) => {
  try {
    const decoded = jwtDecode(token);
    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return new Date(0); // Token inválido
  }
};

export const isTokenNearExpiration = (token, thresholdHours = 24) => {
  try {
    const expirationDate = getTokenExpiration(token);
    const now = new Date();
    const hoursUntilExpiration = (expirationDate - now) / (1000 * 60 * 60);
    return hoursUntilExpiration <= thresholdHours;
  } catch (error) {
    console.error("Error al verificar la expiración del token:", error);
    return true; // Si hay error, asumimos que el token está próximo a expirar
  }
};
