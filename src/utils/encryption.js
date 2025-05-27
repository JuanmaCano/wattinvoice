import CryptoJS from "crypto-js";

export const encryptPassword = (password, key) => {
  if (!password) return null;
  return CryptoJS.AES.encrypt(password, key).toString();
};

export const decryptPassword = (encryptedPassword, key) => {
  if (!encryptedPassword) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Error al desencriptar la contraseña:", error);
    return "";
  }
};
