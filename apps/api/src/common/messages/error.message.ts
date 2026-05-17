import { BAD_REQUEST } from "../types/error.type";

export const msgBAD_REQUEST: Record<BAD_REQUEST, string> = {

    ANY: 'Petición inválida, revisa la ruta o el cuerpo del JSON',
    BODY: 'Petición inválida, revisa el cuerpo JSON de la solicitud',
    PATH: 'Petición inválida, revisa la ruta path en la URL',
    QUERY: 'Petición inválida, revisa los QUERYS en la URL',

};

