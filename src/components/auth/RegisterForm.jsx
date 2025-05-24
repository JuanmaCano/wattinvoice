import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { SocialButton } from "./SocialButton";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp, signInWithGoogle, signInWithGithub } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (error) {
      setError("Error al crear la cuenta. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch (error) {
      setError("Error al iniciar sesión con Google.");
    }
  };

  const handleGithubSignIn = async () => {
    setError("");
    try {
      await signInWithGithub();
    } catch (error) {
      setError("Error al iniciar sesión con GitHub.");
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-medium text-slate-900">¡Cuenta creada!</h3>
        <p className="mt-2 text-sm text-slate-600">
          Por favor, verifica tu correo electrónico para activar tu cuenta.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700"
        >
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-slate-700"
        >
          Confirmar contraseña
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-500">O continúa con</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SocialButton provider="google" onClick={handleGoogleSignIn}>
          Google
        </SocialButton>
        <SocialButton provider="github" onClick={handleGithubSignIn}>
          GitHub
        </SocialButton>
      </div>
    </form>
  );
};
