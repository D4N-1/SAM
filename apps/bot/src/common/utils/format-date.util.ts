// 1. Formateo estricto a UTC+0
export function formatUTC(isoString: string | Date): string {
  const date = new Date(isoString);

  const formatter = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC', // Fuerzo la zona a UTC (+0)
  });

  return formatter.format(date);
}

// 2. Formateo a la zona horaria local de la computadora/servidor
export function formatLocal(isoString: string | Date): string {
  const date = new Date(isoString);

  const formatter = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    // Al omitir 'timeZone', Intl detecta automáticamente 
    // la zona horaria del sistema donde se ejecuta el código
  });

  return formatter.format(date);
}