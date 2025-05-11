import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignIn,
  SignUp,
  UserProfile,
  OrganizationSwitcher,
  OrganizationProfile,
  OrganizationList,
  CreateOrganization,
  Waitlist,
  GoogleOneTap,
  useUser
} from "@clerk/clerk-react";

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="flex justify-between items-center px-8 py-4 shadow bg-white">
        <h1 className="text-xl font-bold text-blue-700">WattInvoice</h1>
        <SignedIn>
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <UserInfo />
          </div>
        </SignedIn>
        <SignedOut>
          <SignIn />
        </SignedOut>
      </header>
      {/* ...aquí iría el resto de la app... */}
    </main>
  );
}

// Componente auxiliar para mostrar info del usuario logueado
function UserInfo() {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div className="text-right">
      <div className="font-semibold text-slate-800">{user.fullName || user.username}</div>
      <div className="text-xs text-slate-500">{user.primaryEmailAddress?.emailAddress}</div>
    </div>
  );
}
