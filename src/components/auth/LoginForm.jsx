import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { SocialButton } from "./SocialButton";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithGithub } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (error) {
      setError(
        "Error al iniciar sesión. Por favor, verifica tus credenciales."
      );
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

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Iniciar Sesión
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      <div className="mt-6">
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
      </div>
    </div>
  );
};
