import chalk from "chalk";

/**
 * Imprime un log en consola con el formato exacto de Sam
 * @param context El contexto o módulo que dispara el log (ej: 'Command Router')
 * @param message El mensaje principal o la acción (ej: 'Mapped Ping Command')
 * @param ms El tiempo de diferencia (ej: Date.now() )
 */
export async function Logger(context: string, message: string, startTime?: number, error?: boolean) {
  const appName = chalk.cyanBright("[Sam]");
  
  const pid = chalk.greenBright(process.pid);
  
  const now = new Date();
  const formattedDate = now.toLocaleString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).replace(/\//g, "/");
  
  const logTag = error ? chalk.redBright("ERROR") : chalk.cyanBright("LOG");
  
  const ctx = error ? chalk.magenta(`[${context}]`) : chalk.yellow(`[${context}]`);
  
  const msg = chalk.greenBright(message);
  let timeDiff = "";
  if (startTime) {
    const diff = performance.now() - startTime;
    timeDiff = chalk.yellowBright(`+${diff.toFixed(1)}ms`)
  }

  console.log(`${appName} ${pid}  - ${formattedDate}     ${logTag} ${ctx} ${msg} ${timeDiff}`);
}