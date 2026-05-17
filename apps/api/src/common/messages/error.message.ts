import { BAD_REQUEST } from "../types/error.type";

export const msgBAD_REQUEST: Record<BAD_REQUEST, string> = {

    ANY: 'Petición inválida, no se logró determinar que atributo es incorrecto',
    BODY: 'Petición inválida, revisa el cuerpo JSON (Request Body) de la solicitud',
    PATH: 'Petición inválida, revisa la URL path de tu petición',
    QUERY: 'Petición inválida, revisa los QUERYS (Query Parameters) en la URL',

};

export const msgWRONG_PASSWORD: string = 'Contraseña incorrecta, verifica e intenta de nuevo'

