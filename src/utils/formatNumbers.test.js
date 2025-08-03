import { formatNumber, formatCurrency, formatKWh, formatPercentage } from './formatNumbers.js';

// Función de prueba simple
function testFormatNumber() {
  console.log('=== Pruebas de formateo de números ===');
  
  // Pruebas de formatNumber
  console.log('formatNumber(123.456):', formatNumber(123.456));
  console.log('formatNumber(123):', formatNumber(123));
  console.log('formatNumber(123.4):', formatNumber(123.4));
  console.log('formatNumber(123.0):', formatNumber(123.0));
  console.log('formatNumber(0):', formatNumber(0));
  console.log('formatNumber(null):', formatNumber(null));
  console.log('formatNumber(undefined):', formatNumber(undefined));
  
  // Pruebas de formatCurrency
  console.log('\nformatCurrency(123.456):', formatCurrency(123.456));
  console.log('formatCurrency(123):', formatCurrency(123));
  console.log('formatCurrency(0.5):', formatCurrency(0.5));
  
  // Pruebas de formatKWh
  console.log('\nformatKWh(123.456):', formatKWh(123.456));
  console.log('formatKWh(123):', formatKWh(123));
  console.log('formatKWh(0.5):', formatKWh(0.5));
  
  // Pruebas de formatPercentage
  console.log('\nformatPercentage(0.21):', formatPercentage(0.21));
  console.log('formatPercentage(0.5):', formatPercentage(0.5));
  console.log('formatPercentage(1):', formatPercentage(1));
  console.log('formatPercentage(0.123):', formatPercentage(0.123));
}

// Ejecutar las pruebas si se ejecuta directamente
if (typeof window !== 'undefined') {
  // En el navegador
  window.testFormatNumber = testFormatNumber;
} else {
  // En Node.js
  testFormatNumber();
} 