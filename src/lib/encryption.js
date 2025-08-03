import CryptoJS from "crypto-js";

export const encryptPassword = (password, key) => {
  try {
    return CryptoJS.AES.encrypt(password, key).toString();
  } catch (error) {
    console.error("Error al encriptar:", error);
    throw new Error("Error al encriptar la contraseña");
  }
};

export const decryptPassword = (encryptedPassword, key) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Error al desencriptar:", error);
    return "";
  }
};
