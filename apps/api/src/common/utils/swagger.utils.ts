import { CREATED_MODULES } from "../types/module.type";

export const SWAGGER = {

    SUMMARY: {
        ALL: (type: CREATED_MODULES) => `Lista todos los ${type}`,
        COUNT: (type: CREATED_MODULES) => `Cuenta la cantidad de entidades de ${type}`,
        CREATE: (type?: CREATED_MODULES) => `Crea un nuevo ${type}`,
        FIND: (type: CREATED_MODULES) => `Obtiene un ${type}`,
        EDIT: (type: CREATED_MODULES) => `Edita un ${type}`,
        DELETE: (type: CREATED_MODULES) => `Elimina un ${type}`,
        RECOVER: (type: CREATED_MODULES) => `Recupera un ${type}`
    },
    OK: {
        ALL: (type: CREATED_MODULES) => `Todos los ${type} existentes`,
        COUNT: (type: CREATED_MODULES) => `Cuantos ${type} existen`,
        CREATE: (type: CREATED_MODULES) => `${type} creado con exito`,
        FIND: (type: CREATED_MODULES) => `${type} encontrado con exito`,
        EDIT: (type: CREATED_MODULES) => `${type} editado con exito`,
        DELETE: (type: CREATED_MODULES) => `${type} eliminado con exito`,
        RECOVER: (type: CREATED_MODULES) => `${type} recuperado con exito`
    },
    NOT_FOUND: (type: CREATED_MODULES) => `No existe ese ${type}`,
    CONFLICT: (type: CREATED_MODULES) => `Ya existe ese ${type}`,
    BAD_RQUEST: () => `Petición inválida, revisa el mensaje del error para obtener mas información`,
    UNAUTHORIZED: () => `No estas autenticado, por favor, inicia sesión`

}