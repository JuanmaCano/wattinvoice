import fetch from "node-fetch";
import FormData from "form-data";

export const validateDatadisCredentials = async (nif, password) => {
  const formData = new FormData();
  formData.append("username", nif);
  formData.append("password", password);

  const response = await fetch("https://datadis.es/nikola-auth/tokens/login", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Credenciales de Datadis inválidas");
  }

  return response.text();
};

export const calculateTokenAge = (updatedAt) => {
  if (!updatedAt) return 25; // Si no hay token, forzamos la actualización

  return (
    (new Date().getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60)
  );
};
