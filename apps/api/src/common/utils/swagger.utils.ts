import { CREATED_MODULES } from "../types/module.type";

export const SWAGGER = {

    SUMMARY: {
        ALL: (type: CREATED_MODULES) => `Lista todos los ${type}`,
        CREATE: (type: CREATED_MODULES) => `Crea un nuevo ${type}`,
        FIND: (type: CREATED_MODULES) => `Obtiene un ${type}`,
        EDIT: (type: CREATED_MODULES) => `Edita un ${type}`,
        DELETE: (type: CREATED_MODULES) => `Elimina un ${type}`,
        RECOVER: (type: CREATED_MODULES) => `Recupera un ${type}`
    },
    OK: {
        ALL: (type: CREATED_MODULES) => `Todos los ${type} existentes`,
        CREATE: (type: CREATED_MODULES) => `${type} creado con exito`,
        FIND: (type: CREATED_MODULES) => `${type} encontrado con exito`,
        EDIT: (type: CREATED_MODULES) => `${type} editado con exito`,
        DELETE: (type: CREATED_MODULES) => `${type} eliminado con exito`,
        RECOVER: (type: CREATED_MODULES) => `${type} recuperado con exito`
    }
}