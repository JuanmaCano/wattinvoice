import { useAuth } from "./contexts/AuthContext";
import { MyInvoices } from "./components/MyInvoices";
import { AuthContainer } from "./components/auth/AuthContainer";

export default function App() {
  const { user, signOut } = useAuth();

  if (!user) {
    return <AuthContainer />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="flex justify-between items-center px-8 py-4 shadow bg-white">
        <h1 className="text-xl font-bold text-blue-700">WattInvoice</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-semibold text-slate-800">{user.email}</div>
          </div>
          <button
            onClick={() => signOut()}
            title="Cerrar sesión"
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-slate-500 hover:text-red-500"
            >
              <path
                fillRule="evenodd"
                d="M7.75 3.5a.75.75 0 0 1 .75-.75h5.5A2.25 2.25 0 0 1 16.25 5v10a2.25 2.25 0 0 1-2.25 2.25h-5.5a.75.75 0 0 1 0-1.5h5.5c.414 0 .75-.336.75-.75V5a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 1-.75-.75zm-2.03 5.22a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.75.75 0 1 1-1.06-1.06l.72-.72H2.75a.75.75 0 0 1 0-1.5h3.69l-.72-.72a.75.75 0 0 1 0-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </header>
      <section className="p-8">
        <MyInvoices />
      </section>
    </main>
  );
}
