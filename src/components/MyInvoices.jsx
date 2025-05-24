import { useState, useMemo } from "react";
import { InvoicePerMonth } from "./InvoicePerMonth";
import { useAuth } from "../contexts/AuthContext";
import data from "../data/consumo-x-mes.json";

export const MyInvoices = () => {
  const { user } = useAuth();
  const months = data.map((item) => item.mes.split("-")[1]);
  const uniqueMonths = [...new Set(months)];

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  const defaultMonth = uniqueMonths.includes(currentMonth)
    ? currentMonth
    : uniqueMonths[0];

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const selectedData = useMemo(() => {
    return data.find((item) => item.mes.split("-")[1] === selectedMonth);
  }, [selectedMonth]);

  if (!user || user.email !== "juanmacano@gmail.com") {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-sm">
        <p className="text-slate-600">
          Aún no tenemos datos suficientes para mostrar tu facturación
        </p>
      </div>
    );
  }

  return (
    <>
      <select
        className="mb-4 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition min-w-[160px] max-w-xs"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        {uniqueMonths.map((month) => {
          const monthIndex = parseInt(month, 10) - 1;
          const monthLabel = monthNames[monthIndex] || month;
          return (
            <option key={month} value={month}>
              {monthLabel}
            </option>
          );
        })}
      </select>
      <InvoicePerMonth
        consumed={selectedData ? selectedData.consumo_total_kWh : 0}
        exported={selectedData ? selectedData.energia_exportada_kWh : 0}
        month={selectedMonth}
      />
    </>
  );
};
