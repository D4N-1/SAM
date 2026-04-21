export const ANIME_ERRORS = {
    NOT_FOUND: (type: string, search: string) => {
        return {
            error: 404,
            message: `No se encontró el anime por su ${type} con la busqueda ${search}`
        }
    }
}