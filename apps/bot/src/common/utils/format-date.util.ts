export function formatUTC(isoString: Date): string {
  const date = new Date(isoString);

  const formatter = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
    });

  return formatter.format(date);
}