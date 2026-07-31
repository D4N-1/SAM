import { DTO } from "./generic.dto";

export const API_PARAM = {
  UUID: {
    name: 'uuid',
    required: true,
    description: 'El identificador unico asignado',
    example: DTO.UUID,
    type: 'string'
  },
  LID: {
    name: 'lid',
    required: true,
    description: 'El identificador unico asignado por Whatsapp',
    example: DTO.LID,
    type: 'string'
  },
  OPT_UUID: {
    name: 'uuid',
    required: false,
    description: 'El identificador unico asignado',
    example: DTO.UUID,
    type: 'string'
  },

  UID: {
    name: 'uid',
    required: true,
    description: 'El identificador unico',
    example: DTO.UID,
    type: 'string'
  },
  OPT_UID: {
    name: 'uid',
    required: false,
    description: 'El identificador unico',
    example: DTO.UID,
    type: 'string'
  },

  NAME: {
    name: 'name',
    require: true,
    description: 'El nombre único',
    example: DTO.NAME,
    type: 'string'
  },
  OPT_NAME: {
    name: 'name',
    require: false,
    description: 'El nombre único',
    example: DTO.NAME,
    type: 'string'
  }
}