import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import CryptoJS from "crypto-js";

// Clave de encriptación - en producción debería estar en variables de entorno
const ENCRYPTION_KEY =
  import.meta.env.VITE_ENCRYPTION_KEY || "clave_temporal_para_desarrollo";

// Función para validar NIF español
const validateNIF = (nif) => {
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

export const ProfileForm = () => {
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

  // Función para encriptar la contraseña
  const encryptPassword = (password) => {
    if (!password) return null;
    return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();
  };

  // Función para desencriptar la contraseña
  const decryptPassword = (encryptedPassword) => {
    if (!encryptedPassword) return "";
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Error al desencriptar la contraseña:", error);
      return "";
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            datadis_password: data.datadis_password
              ? decryptPassword(data.datadis_password)
              : "",
            nif: data.nif || "",
          });
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error.message);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Función para validar todos los campos
  const validateFields = () => {
    const errors = {
      datadis_password: "",
    };

    // Validar contraseña de Datadis
    if (!formData.datadis_password) {
      errors.datadis_password = "La contraseña de Datadis es requerida";
    }

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error) && !nifError;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación específica para NIF
    if (name === "nif") {
      const { isValid, error } = validateNIF(value);
      setNifError(error || "");
    }

    // Limpiar error de validación cuando el usuario empieza a escribir
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

    // Validar todos los campos antes de enviar
    if (!validateFields()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    // Validar NIF antes de enviar
    const { isValid, error } = validateNIF(formData.nif);
    if (!isValid) {
      setError(error);
      setLoading(false);
      return;
    }

    try {
      const encryptedPassword = encryptPassword(formData.datadis_password);

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        datadis_password: encryptedPassword,
        nif: formData.nif.toUpperCase().trim(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSuccess(true);
      setFormData((prev) => ({ ...prev, datadis_password: "" }));
    } catch (error) {
      if (error.code === "23505") {
        setError("Este NIF ya está registrado en el sistema");
      } else {
        setError("Error al guardar los cambios. Por favor, intenta de nuevo.");
      }
      console.error("Error al actualizar el perfil:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el formulario es válido
  const isFormValid = () => {
    return (
      formData.datadis_password !== "" &&
      !nifError &&
      !Object.values(validationErrors).some((error) => error)
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Tu perfil</h2>
        <p className="mt-1 text-sm text-slate-600">
          Actualiza tus credenciales de Datadis
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
          Perfil actualizado correctamente
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            disabled
            className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg shadow-sm text-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="nif"
            className="block text-sm font-medium text-slate-700"
          >
            NIF/NIE/CIF <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nif"
            name="nif"
            value={formData.nif}
            onChange={handleChange}
            placeholder="Ej: 12345678A, X1234567B, A12345678"
            className={`mt-1 block w-full px-3 py-2 border ${
              nifError ? "border-red-300" : "border-slate-300"
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          />
          {nifError && <p className="mt-1 text-sm text-red-600">{nifError}</p>}
          <p className="mt-1 text-sm text-slate-500">
            Introduce tu DNI, NIE o CIF sin espacios
          </p>
        </div>

        <div>
          <label
            htmlFor="datadis_password"
            className="block text-sm font-medium text-slate-700"
          >
            Contraseña de Datadis <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="datadis_password"
              name="datadis_password"
              value={formData.datadis_password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`mt-1 block w-full px-3 py-2 border ${
                validationErrors.datadis_password
                  ? "border-red-300"
                  : "border-slate-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
          {validationErrors.datadis_password && (
            <p className="mt-1 text-sm text-red-600">
              {validationErrors.datadis_password}
            </p>
          )}
          <p className="mt-1 text-sm text-slate-500">
            Esta contraseña se guardará de forma segura y encriptada
          </p>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};
