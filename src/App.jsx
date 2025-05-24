import { MyInvoices } from "./components/MyInvoices";

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="flex justify-between items-center px-8 py-4 shadow bg-white">
        <h1 className="text-xl font-bold text-blue-700">WattInvoice</h1>
      </header>
      <section className="p-8">
        <MyInvoices />
      </section>
    </main>
  );
}
