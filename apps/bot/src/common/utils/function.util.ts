/**
 * Selecciona un elemento de forma aleatoria a partir de un array de datos.
 *
 * @template T - El tipo de los elementos contenidos en el array.
 * @param {T[]} arr - El array del cual se extraerá el elemento.
 * @returns {T | undefined} El elemento seleccionado aleatoriamente, o `undefined` si el array está vacío.
 * 
 * @example
 * const numeros = [1, 2, 3, 4, 5];
 * const numeroAleatorio = random(numeros); // Devuelve un número del 1 al 5
 * 
 * const vacio: string[] = [];
 * const resultado = random(vacio); // Devuelve undefined
 */
export function random <T> (arr: T[]): T | undefined {
    if (!arr.length) return undefined;
    return arr[Math.floor( Math.random() * arr.length)];
}

/**
 * Detiene la ejecución del código de forma asíncrona durante un tiempo determinado.
 * Utiliza una Promesa que se resuelve tras el uso de un temporizador.
 *
 * @param {number} ms - La cantidad de milisegundos que se debe pausar la ejecución (ej: 1000 = 1 segundo).
 * @returns {Promise<void>} Una promesa que se resuelve una vez transcurrido el tiempo indicado.
 * 
 * @example
 * console.log("Inicio de la pausa");
 * await wait(2000); // Pausa el flujo por 2 segundos
 * console.log("Fin de la pausa, pasaron 2 segundos");
 */
export async function wait(ms: number): Promise<void> {
    return new Promise((res) => setTimeout(res, ms))
}