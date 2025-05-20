import { useState, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { InvoicePerMonth } from "./InvoicePerMonth";
import data from "../data/consumo-x-mes.json";

export const MyInvoices = () => {
  const { user } = useUser();

  const months = data.map((item) => item.mes.split("-")[1]);
  const uniqueMonths = [...new Set(months)];

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  const defaultMonth = uniqueMonths.includes(currentMonth)
    ? currentMonth
    : uniqueMonths[0];

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  // TODO: solo habilitado para mi, de momento
  const id = "user_2wxlvJyCAvhqo3G92Sm4oiA4xgH";

  const notAllowed = !user || user.id != id;

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

  if (notAllowed) {
    return (
      <p>
        <span className="font-bold">{user.fullName}, </span> aún no tenemos
        datos para estimar tu facturación
      </p>
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
