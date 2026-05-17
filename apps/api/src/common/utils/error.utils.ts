import { msgBAD_REQUEST } from "../messages/error.message";
import { BAD_REQUEST } from "../types/error.type";

export const ERROR_CODE = {

    BAD_REQUEST: (where: BAD_REQUEST, text?: string) => (
        {
            statusCode: 400,
            error: 'Bad Request',
            message: text || msgBAD_REQUEST[where]
        }
    ),

    UNAUTHORIZED: () => (
        {
            statusCode: 401,
            error: 'Unauthorized',
            message: 'Credenciales invalidas, por favor, inicia sesión',
        }
    ),

    FORBIDDEN: () => (
        {
            statusCode: 403,
            error: 'Forbidden',
            message: 'No tienes permiso para acceder a este metodo'
        }
    ),
    NOT_FOUND: () => (
        {
            statusCode: 404,
            error: 'Not Found',
            message: 'No se encontró el recurso de la petición'
        }
    ),
    CONFLICT: () => (
        {
            statusCode: 409,
            error: 'Conflict',
            message: 'No se puede crear, hay un conflicto con un recurso del servidor'
        }
    )
}