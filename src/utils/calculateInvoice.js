/**
 * Calcula el número de días en un mes específico
 * @param {string} month - Mes en formato "MM"
 * @param {number} year - Año
 * @returns {number} Número de días en el mes
 */
export const daysPerMonth = (month, year) => {
  return new Date(year, parseInt(month), 0).getDate();
};

/**
 * Calcula los importes de la factura eléctrica
 * @param {number} consumed - kWh consumidos
 * @param {number} exported - kWh exportados
 * @param {number} days - Número de días en el periodo
 * @returns {Object} Importes de la factura
 */
export const calculateInvoice = (consumed, exported, days) => {
  // Precios por kWh (€/kWh)
  const PRECIO_ENERGIA = 0.174;
  const PRECIO_COMPENSACION = 0.054;
  const PRECIO_POTENCIA = 0.113;
  const PRECIO_ALQUILER = 0.0266;

  // Cálculos
  const energia = consumed * PRECIO_ENERGIA;
  const compensacion = exported * PRECIO_COMPENSACION;
  const bonoSocial = -40.0; // Bono social mensual
  const alquilerContador = days * PRECIO_ALQUILER;
  const terminoPotencia = days * PRECIO_POTENCIA;

  // Impuestos y totales
  const impuestoElectrico = (energia + terminoPotencia) * 0.051126963;
  const acumulados = bonoSocial;
  const baseImponible =
    energia +
    compensacion +
    bonoSocial +
    alquilerContador +
    terminoPotencia +
    impuestoElectrico +
    acumulados;
  const iva = baseImponible * 0.21;
  const total = baseImponible + iva;
  const a_pagar = total;

  return {
    energia,
    compensacion,
    bonoSocial,
    alquilerContador,
    terminoPotencia,
    impuestoElectrico,
    acumulados,
    baseImponible,
    iva,
    total,
    a_pagar,
  };
};
