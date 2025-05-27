import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
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
        toast.error("Error al verificar la sesión");
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
  }, []);

  const login = async (email, password) => {
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password) => {
    try {
      const { error } = await signUpWithEmail(email, password);
      if (error) throw error;
      toast.success("Registro exitoso. Por favor, verifica tu email.");
      return { success: true };
    } catch (error) {
      console.error("Error en registro:", error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error("Error al cerrar sesión");
        return;
      }
      toast.success("Sesión cerrada correctamente");
    } catch {
      toast.error("Error al cerrar sesión");
    }
  };

  const handleResetPassword = async (email) => {
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      toast.success("Instrucciones enviadas a tu email");
      return { success: true };
    } catch (error) {
      console.error("Error al solicitar reset:", error);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const handleUpdatePassword = async (newPassword) => {
    try {
      const { error } = await updatePassword(newPassword);
      if (error) throw error;
      toast.success("Contraseña actualizada correctamente");
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      toast.error(error.message);
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
