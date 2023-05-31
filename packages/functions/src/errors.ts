export enum errorCodes {
    SUCCESFULL = "00000",
    UNEXPECTED_DOCUMENT_ERROR = "ERD00",
    DOCUMENT_ALREADY_EXISTS_ERROR = "ERD01",
    DOCUMENT_NOT_EXISTS_ERROR = "ERD02",
    UNEXPECTED_ERROR = "ERR00",
    NAME_FORMAT_ERROR = "ERR01",
    EMAIL_FORMAT_ERROR = "ERR02",
    PASSWORD_FORMAT_ERROR = "ERR03",
    CONFIRM_PASSWORD_ERROR = "ERR04",
    INCORRECT_CODE_ERROR = "ERR05",
    MISSING_REQUIRED_DATA_ERROR = "ERR09",
    USER_NOT_EXISTS_ERROR = "ERL01",
    BLOCKED_ACCOUNT_ERROR = "ERL02",
    INCORRECT_PASSWORD_ERROR = "ERL03",
}

export const messagesCode: { [code in errorCodes]: string } = {
    [errorCodes.SUCCESFULL]: "Acción realizada exitosamente",
    [errorCodes.UNEXPECTED_DOCUMENT_ERROR]:
        "UNEXPECTED DATABASE DOCUMENT ERROR",
    [errorCodes.DOCUMENT_ALREADY_EXISTS_ERROR]: "El documento ya existe",
    [errorCodes.DOCUMENT_NOT_EXISTS_ERROR]: "El documento no existe",
    [errorCodes.UNEXPECTED_ERROR]: "UNEXPECTED INTERNAL ERROR",
    [errorCodes.NAME_FORMAT_ERROR]:
        "El nombre de usuario tiene un formato incorrecto",
    [errorCodes.EMAIL_FORMAT_ERROR]:
        "El correo del usuario tiene un formato incorrecto, debe ser del formato: correo@correo.cl",
    [errorCodes.PASSWORD_FORMAT_ERROR]:
        "La contraseña del usuario tiene un formato incorrecto, debe ser alfanumérica",
    [errorCodes.CONFIRM_PASSWORD_ERROR]: "Las contraseñas no son iguales",
    [errorCodes.INCORRECT_CODE_ERROR]: "Código incorrecto",
    [errorCodes.MISSING_REQUIRED_DATA_ERROR]: "Faltan datos requeridos ",
    [errorCodes.USER_NOT_EXISTS_ERROR]: "El usuario no existe",
    [errorCodes.BLOCKED_ACCOUNT_ERROR]:
        "La cuenta está bloqueada, contacte con soporte",
    [errorCodes.INCORRECT_PASSWORD_ERROR]: "Contraseña incorrecta",
};
