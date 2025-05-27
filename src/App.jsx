import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { MyInvoices } from "./components/MyInvoices";
import { ProfileForm } from "./components/profile/ProfileForm";
import { Layout } from "./components/layout/Layout";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import { toast } from "react-hot-toast";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obtener el hash de la URL
        const hash = window.location.hash.substring(1);
        if (hash) {
          // Procesar el hash y actualizar la sesión
          const params = new URLSearchParams(hash);
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken) {
            // Actualizar la sesión en Supabase
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) throw error;
          }
        }

        // Redirigir a la página principal
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Error en el callback de autenticación:", error);
        toast.error("Error al procesar la autenticación");
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MyInvoices />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfileForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <LoginForm />
                </AuthRoute>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRoute>
                  <RegisterForm />
                </AuthRoute>
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </Layout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 2000,
              theme: {
                primary: "#4aed88",
              },
            },
            error: {
              duration: 4000,
              theme: {
                primary: "#ff4b4b",
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
};

export default App;
