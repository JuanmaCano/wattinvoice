export default function EnergyBillTable({ data, month }) {
  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold text-center mb-4 capitalize">
        {month}
      </h2>
      <table className="w-full text-sm text-gray-700">
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="py-1 pr-4 text-left font-medium">{item.label}</td>
              <td
                className={`py-1 text-right ${
                  item.highlight === "positive"
                    ? "text-green-600 font-semibold"
                    : item.highlight === "negative"
                    ? "text-red-600 font-semibold"
                    : ""
                }`}
              >
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
