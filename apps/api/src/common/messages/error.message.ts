export const ERROR_CODES = {
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
    )

    
}