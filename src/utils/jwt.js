import { jwtDecode } from "jwt-decode";

export const decodeDatadisToken = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};

export const getTokenExpiration = (token) => {
  const decoded = decodeDatadisToken(token);
  if (!decoded || !decoded.exp) return null;
  return new Date(decoded.exp * 1000);
};

export const isTokenExpired = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  return new Date() >= expiration;
};

export const isTokenNearExpiration = (token, hoursThreshold = 4) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;

  const now = new Date();
  const timeUntilExpiration = expiration - now;
  const hoursUntilExpiration = timeUntilExpiration / (1000 * 60 * 60);

  return hoursUntilExpiration <= hoursThreshold;
};
