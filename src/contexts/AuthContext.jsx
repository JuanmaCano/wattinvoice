import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useToast } from "../components/ui/ToastProvider";
import {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  resetPassword,
  updatePassword,
} from "../lib/auth";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Verificar sesión actual
    const checkUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        showToast("Error al verificar la sesión", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Suscribirse a cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [showToast]);

  const login = async (email, password) => {
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      showToast(error.message, { type: "error" });
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password) => {
    try {
      const { error } = await signUpWithEmail(email, password);
      if (error) throw error;
      showToast("Registro exitoso. Por favor, verifica tu email.", {
        type: "success",
      });
      return { success: true };
    } catch (error) {
      console.error("Error en registro:", error);
      showToast(error.message, { type: "error" });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      showToast("Sesión cerrada correctamente", { type: "success" });
    } catch (error) {
      console.error("Error en logout:", error);
      showToast("Error al cerrar sesión", { type: "error" });
    }
  };

  const handleResetPassword = async (email) => {
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      showToast("Instrucciones enviadas a tu email", { type: "success" });
      return { success: true };
    } catch (error) {
      console.error("Error al solicitar reset:", error);
      showToast(error.message, { type: "error" });
      return { success: false, error: error.message };
    }
  };

  const handleUpdatePassword = async (newPassword) => {
    try {
      const { error } = await updatePassword(newPassword);
      if (error) throw error;
      showToast("Contraseña actualizada correctamente", { type: "success" });
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      showToast(error.message, { type: "error" });
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    handleResetPassword,
    handleUpdatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export default AuthProvider;
