import { msgBAD_REQUEST } from "../messages/error.message";
import { BAD_REQUEST } from "../types/error.type";
import { CREATED_MODULES } from "../types/module.type";

export const ERROR_CODE = {

    BAD_REQUEST: (where: BAD_REQUEST, text?: string) => (
        {
            statusCode: 400,
            error: 'Bad Request',
            message: text || msgBAD_REQUEST[where]
        }
    ),

    UNAUTHORIZED: (text?: string) => (
        {
            statusCode: 401,
            error: 'Unauthorized',
            message: text || 'Credenciales invalidas, por favor, inicia sesión',
        }
    ),

    FORBIDDEN: (text?: string) => (
        {
            statusCode: 403,
            error: 'Forbidden',
            message: text || 'No tienes permiso suficiente para acceder a este metodo'
        }
    ),
    NOT_FOUND: (type: CREATED_MODULES, text?: string) => (
        {
            statusCode: 404,
            error: 'Not Found',
            message: text || `No se encontró ese ${type}`
        }
    ),
    CONFLICT: (type: CREATED_MODULES, text?: string) => (
        {
            statusCode: 409,
            error: 'Conflict',
            message: text || `No se puede crear, ya existe un ${type} con esos datos`
        }
    )
}