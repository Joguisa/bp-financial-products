import { HTTP_STATUS, HttpStatusCode } from './http-status.constants';

export const HTTP_ERROR_MESSAGES: Partial<Record<HttpStatusCode, string>> = {
    [HTTP_STATUS.NETWORK_ERROR]: 'No se puede conectar con el servidor. Verifique su conexión.',

    [HTTP_STATUS.BAD_REQUEST]: 'Datos inválidos. Verifique la información ingresada.',

    [HTTP_STATUS.NOT_FOUND]: 'El recurso solicitado no fue encontrado.',

    [HTTP_STATUS.CONFLICT]: 'El recurso ya existe o hay un conflicto con los datos.',

    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Error interno del servidor. Intente más tarde.'
};