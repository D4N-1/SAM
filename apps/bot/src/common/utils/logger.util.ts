import chalk from "chalk";
import type enumContext from "../enums/context.enum.js";

/**
 * Imprime un log en consola con el formato exacto de Sam
 * @param context El contexto o módulo que dispara el log (ej: 'Command Router')
 * @param message El mensaje principal o la acción (ej: 'Mapped Ping Command')
 * @param ms El tiempo de diferencia (ej: Date.now() )
 */
const Logger = {
  
  log: (context: enumContext|string, message: string, startTime?: number|null) => {
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

    const logTag = chalk.cyanBright("LOG");

    const ctx = chalk.yellow(`[${context}]`);

    const msg = chalk.greenBright(message);
    let timeDiff = "";
    if (startTime) {
      const diff = performance.now() - startTime;
      timeDiff = chalk.yellowBright(`+${diff.toFixed(1)}ms`)
    }

    console.log(`${appName} ${pid}  - ${formattedDate}     ${logTag} ${ctx} ${msg} ${timeDiff}`);
  },

  error: (context: enumContext|string, message: string) => {
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

    const logTag = chalk.redBright("ERROR");

    const ctx = chalk.magenta(`[${context}]`);

    const msg = chalk.greenBright(message);

    console.log(`${appName} ${pid}  - ${formattedDate}     ${logTag} ${ctx} ${msg}`);
  }

}

export default Logger;
