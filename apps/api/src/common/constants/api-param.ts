import { DTO } from "./generic.dto";

export const API_PARAM = {
  UUID: {
    name: 'uuid',
    required: true,
    description: 'El identificador unico asignado',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String
  },

  UID: {
    name: 'uid',
    required: true,
    description: 'El identificador unico',
    example: DTO.UID,
    type: String
  }
}