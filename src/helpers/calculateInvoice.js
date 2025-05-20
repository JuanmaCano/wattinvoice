export const calculateInvoice = (consumption, exported, days = 30) => {
  const precioCompra = 0.12681;
  const precioVenta = 0.1;
  const bonoSocialDia = 0.012742;
  const alquilerContadorDia = 0.02678571;
  const potenciaContratada = 4.6;
  const precioPotenciaP1 = 0.103406;
  const precioPotenciaP3 = 0.064702;
  const impuestoElectricoPct = 0.0511269632;

  const energia = consumption * precioCompra;
  const compensacion = exported * precioVenta;
  const bonoSocial = days * bonoSocialDia;
  const alquilerContador = days * alquilerContadorDia;
  const terminoPotencia =
    days * potenciaContratada * precioPotenciaP1 +
    days * potenciaContratada * precioPotenciaP3;

  const impuestoElectrico =
    (bonoSocial + terminoPotencia) * impuestoElectricoPct;

  const acumulados = energia < compensacion ? energia - compensacion : 0;

  let pago_por_energia = 0;
  if (acumulados > 0) {
    pago_por_energia = energia - compensacion;
  }

  const baseImponible =
    terminoPotencia +
    bonoSocial +
    alquilerContador +
    impuestoElectrico +
    pago_por_energia;

  const iva = baseImponible * 0.21;
  const total = baseImponible + pago_por_energia + iva;
  const monedero = acumulados < 0 ? Math.abs(acumulados) : 0;
  const a_pagar = total - monedero;

  return {
    bonoSocial: bonoSocial.toFixed(2),
    alquilerContador: alquilerContador.toFixed(2),
    impuestoElectrico: impuestoElectrico.toFixed(2),
    terminoPotencia: terminoPotencia.toFixed(2),
    energia: energia.toFixed(2),
    compensacion: compensacion.toFixed(2),
    acumulados: acumulados.toFixed(2),
    baseImponible: baseImponible.toFixed(2),
    iva: iva.toFixed(2),
    total: total.toFixed(2),
    a_pagar: a_pagar.toFixed(2),
  };
};

export const daysPerMonth = (month, anio = 2025) => {
  const monthNum = parseInt(month, 10);
  return new Date(anio, monthNum, 0).getDate();
};
