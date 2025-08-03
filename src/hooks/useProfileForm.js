import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { encryptPassword, decryptPassword } from "../lib/encryption";
import { validateNIF } from "../lib/validation";
import { ENCRYPTION_KEY } from "../config/constants";
import { getTokenExpiration, isTokenNearExpiration } from "../lib/jwt";
import { getConsumption } from "../lib/datadis";

export const useProfileForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    datadis_password: "",
    nif: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [nifError, setNifError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    datadis_password: "",
  });
  const [authTestLoading, setAuthTestLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState({
    exists: false,
    expiresAt: null,
    isValid: false,
    shouldRenew: false,
  });
  const [updateConsumptionLoading, setUpdateConsumptionLoading] =
    useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, datadis_token, datadis_token_updated_at")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          datadis_password: data.datadis_password
            ? decryptPassword(data.datadis_password, ENCRYPTION_KEY)
            : "",
          nif: data.nif || "",
        });

        if (data.datadis_token) {
          const expiresAt = getTokenExpiration(data.datadis_token);
          const now = new Date();
          const isValid = now < expiresAt;
          const shouldRenew =
            isValid && isTokenNearExpiration(data.datadis_token);

          setTokenStatus({
            exists: true,
            expiresAt,
            isValid,
            shouldRenew,
          });
        }
      }
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
      toast.error("Error al cargar el perfil");
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const validateFields = () => {
    const errors = {
      datadis_password: "",
    };

    if (!formData.datadis_password) {
      errors.datadis_password = "La contraseña de Datadis es requerida";
    }

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error) && !nifError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nif") {
      const { error } = validateNIF(value);
      setNifError(error || "");
    }

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    const { isValid, error: nifValidationError } = validateNIF(formData.nif);
    if (!isValid) {
      setError(nifValidationError);
      setLoading(false);
      return;
    }

    try {
      const encryptedPassword = encryptPassword(
        formData.datadis_password,
        ENCRYPTION_KEY
      );

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        datadis_password: encryptedPassword,
        nif: formData.nif.toUpperCase().trim(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSuccess(true);
      setFormData((prev) => ({ ...prev, datadis_password: "" }));
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      const errorMessage =
        error.code === "23505"
          ? "Este NIF ya está registrado en el sistema"
          : "Error al guardar los cambios. Por favor, intenta de nuevo.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthTest = async () => {
    if (!validateFields()) return;

    setAuthTestLoading(true);

    try {
      const response = await fetch("/api/datadis/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nif: formData.nif.toUpperCase().trim(),
          password: formData.datadis_password,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            datadis_token: data.token,
            datadis_token_updated_at: new Date().toISOString(),
          })
          .eq("id", user?.id);

        if (updateError) {
          console.error("Error al guardar el token:", updateError);
          toast.error("Error al guardar el token de autenticación", {
            duration: 5000,
            position: "top-center",
          });
          return;
        }

        const expiresAt = getTokenExpiration(data.token);
        const now = new Date();
        const isValid = now < expiresAt;
        const shouldRenew = isValid && isTokenNearExpiration(data.token);

        setTokenStatus({
          exists: true,
          expiresAt,
          isValid,
          shouldRenew,
        });

        const message = data.shouldRenew
          ? `Token actualizado (válido hasta ${expiresAt.toLocaleString()})`
          : `Token válido (válido hasta ${expiresAt.toLocaleString()})`;

        toast.success(message, {
          duration: 4000,
          position: "top-center",
        });
      } else {
        toast.error(data.error || "Error al validar las credenciales", {
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      toast.error("Error al conectar con el servidor", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setAuthTestLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.datadis_password !== "" &&
      !nifError &&
      !Object.values(validationErrors).some((error) => error)
    );
  };

  const handleUpdateConsumption = async () => {
    if (!tokenStatus.isValid) {
      toast.error(
        "Necesitas un token válido de Datadis para actualizar el consumo"
      );
      return;
    }

    setUpdateConsumptionLoading(true);

    try {
      // Obtener los suministros del usuario
      const { data: supplies, error: suppliesError } = await supabase
        .from("supplies")
        .select("cups, distributor_code")
        .eq("user_id", user.id);

      if (suppliesError) throw suppliesError;
      if (!supplies?.length) {
        toast.error("No hay suministros disponibles para actualizar");
        return;
      }

      // Actualizar cada suministro
      for (const supply of supplies) {
        const startDate = "2025-01-01";
        const endDate = "2025-05-31"; // Mayo 2025

        const result = await getConsumption(supply.cups, startDate, endDate);

        if (!result.success) {
          console.error(
            `Error actualizando consumo para ${supply.cups}:`,
            result.error
          );
          toast.error(`Error actualizando consumo para ${supply.cups}`);
          continue;
        }
      }

      toast.success("Datos de consumo actualizados correctamente");
    } catch (error) {
      console.error("Error actualizando consumo:", error);
      toast.error("Error al actualizar los datos de consumo");
    } finally {
      setUpdateConsumptionLoading(false);
    }
  };

  return {
    formData,
    loading,
    success,
    error,
    showPassword,
    nifError,
    validationErrors,
    authTestLoading,
    tokenStatus,
    updateConsumptionLoading,
    setShowPassword,
    handleChange,
    handleSubmit,
    handleAuthTest,
    isFormValid,
    handleUpdateConsumption,
  };
};
