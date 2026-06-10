import { formatUTC } from "../../../../common/utils/format-date.util.js";

export async function getTelemtry() {

    let data: any = {};

    data.uptime = Math.round( process.uptime() )

    data.prefix = '!';

    data.date = formatUTC(new Date());

    data.mode = 'Todos';


    return data;

    /*
    {uptime}: El tiempo que lleva el bot encendido (ej: 2h 15m 30s).

{ping} o {speed}: La velocidad de respuesta del bot en milisegundos (calculando la diferencia entre que llegó el mensaje y se procesó).

{ram}: El consumo de memoria actual (ej: 120MB / 512MB).

{platform} / {os}: El sistema donde corre (ej: Linux / Alpine).

2. Variables de Estadísticas (Uso del Bot)
Ideales para mostrar qué tan activo es el bot.

{totalUsers}: Total de usuarios registrados en tu base de datos.

{totalChats}: Chats totales en los que está el bot (Privados + Grupos).

{cmdCount}: El total de comandos disponibles en el bot.

{executedCmds}: Cuántos comandos se han ejecutado desde el último encendido.

3. Variables de Contexto (Tiempo y Versión)
{prefix}: El prefijo actual del bot (ej: . o /).

{version}: La versión actual de tu proyecto (ej: v1.2.0).

{date} / {time}: La fecha y hora actual del servidor.

4. Variables de Personalización (Modo)
{mode}: Si el bot está en modo Público (responde a todos) o Privado (solo responde al dueño).
*/
}