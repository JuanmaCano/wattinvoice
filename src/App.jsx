import EnergyBill from "./EnergyBill.jsx";

const billData = [
  { label: "Monedero acumulado", value: "0,00 €" },
  { label: "potencia contratada", value: "23,97 €" },
  { label: "Bono social", value: "0,40 €" },
  { label: "Alquiler x días", value: "0,83 €" },
  { label: "Impuesto eléctrico", value: "1,86 €" },
  { label: "De la red kWh", value: "247,764", highlight: "positive" },
  { label: "", value: "31,42 €" },
  { label: "Excedentes kWh", value: "195,185", highlight: "negative" },
  { label: "", value: "-19,52 €" },
  { label: "Acumulados en esta factura", value: "0,00 €" },
  { label: "Base Imponible", value: "38,96 €" },
  { label: "Iva 21%", value: "8,18 €" },
  { label: "Total", value: "47,14 €", highlight: "positive" },
  { label: "Monedero", value: "0" },
  { label: "TOTAL A PAGAR", value: "47,14 €", highlight: "positive" },
];

function App() {
  return <EnergyBill data={billData} month="enero 2025" />;
}

export default App;
