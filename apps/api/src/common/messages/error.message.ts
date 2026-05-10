import type { interfaceErrorCodes } from "../types/error.type";

export const ERROR_CODE = {
    BAD_REQUEST: (): interfaceErrorCodes => (
        {
            statusCode: 400,
            error: 'Bad Request',
            message: 'Petición inválida, revisa la ruta o el cuerpo del JSON'
        }
    ),
    UNAUTHORIZED: (): interfaceErrorCodes => (
        {
            statusCode: 401,
            error: 'Unauthorized',
            message: 'Credenciales invalidas, por favor, inicia sesión',
        }
    ),

    FORBIDDEN: (): interfaceErrorCodes => (
        {
            statusCode: 403,
            error: 'Forbidden',
            message: 'No tienes permiso para acceder a este metodo'
        }
    ),
    NOT_FOUND: (): interfaceErrorCodes => (
        {
            statusCode: 404,
            error: 'Not Found',
            message: 'No se encontró el recurso de la petición'
        }
    ),
    CONFLICT: (): interfaceErrorCodes => (
        {
            statusCode: 409,
            error: 'Conflict',
            message: 'El recurso tiene un conflicto con el registrado en el servidor'
        }
    )

    
}