import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useProfileForm } from "../../hooks/useProfileForm";

const TokenStatus = ({ status }) => {
  if (!status.exists) {
    return (
      <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
        No hay token de autenticación activo
      </div>
    );
  }

  if (!status.isValid) {
    return (
      <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
        Token expirado. Por favor, prueba la autenticación de nuevo.
      </div>
    );
  }

  const timeLeft = new Date(status.expiresAt) - new Date();
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
      <div className="font-medium">Token de autenticación activo</div>
      <div className="mt-1">
        Expira en {hoursLeft}h {minutesLeft}m
      </div>
      <div className="mt-1 text-xs opacity-75">
        Válido hasta: {new Date(status.expiresAt).toLocaleString()}
      </div>
      {status.shouldRenew && (
        <div className="mt-2 text-amber-700">
          El token está próximo a expirar. Se recomienda renovarlo.
        </div>
      )}
    </div>
  );
};

export const ProfileForm = () => {
  const { user } = useAuth();
  const {
    formData,
    loading,
    success,
    error,
    showPassword,
    nifError,
    validationErrors,
    authTestLoading,
    tokenStatus,
    setShowPassword,
    handleChange,
    handleSubmit,
    handleAuthTest,
    isFormValid,
  } = useProfileForm();

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
            value={user?.email}
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

        <div className="flex flex-col md:flex-row items-center justify-between pt-4 gap-4">
          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              loading || !isFormValid()
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            type="button"
            onClick={handleAuthTest}
            disabled={
              authTestLoading ||
              !isFormValid() ||
              (tokenStatus.isValid && !tokenStatus.shouldRenew)
            }
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
              authTestLoading ||
              !isFormValid() ||
              (tokenStatus.isValid && !tokenStatus.shouldRenew)
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-[#6B46C1] hover:bg-[#553C9A]"
            }`}
            title={
              tokenStatus.isValid && !tokenStatus.shouldRenew
                ? "El token actual es válido y no necesita renovación"
                : undefined
            }
          >
            {authTestLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Renovando...
              </span>
            ) : (
              "Renovar token de Datadis"
            )}
          </button>
        </div>
      </form>

      <TokenStatus status={tokenStatus} />
    </div>
  );
};
