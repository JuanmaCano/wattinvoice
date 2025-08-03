import { calculateInvoice, daysPerMonth } from "../utils/calculateInvoice";
import { formatCurrency, formatKWh } from "../utils/formatNumbers";

export const InvoicePerMonth = ({ consumed, exported, month }) => {
  const days = daysPerMonth(month, 2025);
  const data = calculateInvoice(consumed, exported, days);

  // Etiquetas legibles para la tabla
  const labels = {
    energia: "Energía",
    compensacion: "Compensación",
    bonoSocial: "Bono Social",
    alquilerContador: "Alquiler contador",
    terminoPotencia: "Término potencia",
    impuestoElectrico: "Impuesto eléctrico",
    acumulados: "Acumulados",
    baseImponible: "Base imponible",
    iva: "IVA",
    total: "Total",
    a_pagar: "A pagar",
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-[320px] max-w-lg w-full border border-slate-200 rounded-lg shadow-sm bg-white">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key} className="border-b last:border-b-0">
              <td className="px-4 py-2 font-medium text-slate-600 capitalize">
                {labels[key] || key}
                {key === "energia" && (
                  <span className="ml-1 text-xs text-red-700">
                    {formatKWh(consumed)}
                  </span>
                )}
                {key === "compensacion" && (
                  <span className="ml-1 text-xs text-green-700">
                    {formatKWh(exported)}
                  </span>
                )}
              </td>
              <td
                className={`px-4 py-2 text-right ${
                  key === "a_pagar"
                    ? "font-bold text-green-700"
                    : "text-slate-700"
                }`}
              >
                {key === "compensacion" ? formatCurrency(-value) : formatCurrency(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
