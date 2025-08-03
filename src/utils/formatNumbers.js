/**
 * Formatea un número para mostrar máximo dos decimales
 * @param {number} value - El número a formatear
 * @param {string} currency - La moneda (por defecto '€')
 * @param {string} unit - La unidad (por defecto vacía)
 * @returns {string} El número formateado
 */
export const formatNumber = (value, currency = '', unit = '') => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  // Si el número es entero, no mostrar decimales
  if (Number.isInteger(value)) {
    return `${value}${unit}${currency}`;
  }

  // Formatear con máximo dos decimales
  const formatted = Number(value).toFixed(2);
  
  // Remover ceros innecesarios al final
  const cleanFormatted = formatted.replace(/\.?0+$/, '');
  
  return `${cleanFormatted}${unit}${currency}`;
};

/**
 * Formatea un número como moneda (euros)
 * @param {number} value - El número a formatear
 * @returns {string} El número formateado como moneda
 */
export const formatCurrency = (value) => {
  return formatNumber(value, ' €');
};

/**
 * Formatea un número como kWh
 * @param {number} value - El número a formatear
 * @returns {string} El número formateado con unidad kWh
 */
export const formatKWh = (value) => {
  return formatNumber(value, '', ' kWh');
};

/**
 * Formatea un número como porcentaje
 * @param {number} value - El número a formatear (debe estar en decimal, ej: 0.21 para 21%)
 * @returns {string} El número formateado como porcentaje
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  const percentage = value * 100;
  const formatted = Number(percentage).toFixed(2);
  const cleanFormatted = formatted.replace(/\.?0+$/, '');
  
  return `${cleanFormatted}%`;
}; 