export enum errorCodes {
    SUCCESFULL = "00000",
    UNEXPECTED_DOCUMENT_ERROR = "ERD00",
    DOCUMENT_ALREADY_EXISTS_ERROR = "ERD01",
    DOCUMENT_NOT_EXISTS_ERROR = "ERD02",
    UNEXPECTED_ERROR = "ERR00",
    MISSING_REQUIRED_DATA_ERROR = "ERR1",
    NAME_FORMAT_ERROR = "ERR02",
    EMAIL_FORMAT_ERROR = "ERR03",
    PASSWORD_FORMAT_ERROR = "ERR04",
    CONFIRM_PASSWORD_ERROR = "ERR05",
    INCORRECT_CODE_ERROR = "ERR06",
    PHONE_FORMAT_ERROR = "ERR07",
    DIRECTION_FORMAT_ERROR = "ERR08",
    TIME_FORMAT_ERROR = "ERR09",
    STRING_FORMAT_ERROR = "ERR10",
    COMMENT_FORMAT_ERROR = "ERR11",
    USER_NOT_EXISTS_ERROR = "ERL01",
    BLOCKED_ACCOUNT_ERROR = "ERL02",
    UNACTIVATED_ACCOUNT_ERROR = "ERL03",
    INCORRECT_PASSWORD_ERROR = "ERL04",
    VENDOR_NOT_EXISTS_ERROR = "ERL05",
    VENDOR_PERMISSION_ERROR = "ERL06",
    ACTION_DONE_ERROR = "ERL09",
    ADMIN_NOT_EXISTS_ERROR = "ERL10",
    INCORRECT_INTEGER_FORMAT = "ERS00",
}

export const messagesCode: { [code in errorCodes]: string } = {
    [errorCodes.SUCCESFULL]: "Acción realizada exitosamente",
    [errorCodes.UNEXPECTED_DOCUMENT_ERROR]:
        "UNEXPECTED DATABASE DOCUMENT ERROR",
    [errorCodes.DOCUMENT_ALREADY_EXISTS_ERROR]: "El documento ya existe",
    [errorCodes.DOCUMENT_NOT_EXISTS_ERROR]: "El documento no existe",
    [errorCodes.UNEXPECTED_ERROR]: "UNEXPECTED INTERNAL ERROR",
    [errorCodes.MISSING_REQUIRED_DATA_ERROR]: "Faltan datos requeridos ",
    [errorCodes.NAME_FORMAT_ERROR]:
        "El nombre de usuario tiene un formato incorrecto",
    [errorCodes.EMAIL_FORMAT_ERROR]:
        "El correo del usuario tiene un formato incorrecto, debe ser del formato: correo@correo.cl",
    [errorCodes.PASSWORD_FORMAT_ERROR]:
        "La contraseña del usuario tiene un formato incorrecto, debe ser alfanumérica",
    [errorCodes.CONFIRM_PASSWORD_ERROR]: "Las contraseñas no son iguales",
    [errorCodes.INCORRECT_CODE_ERROR]: "Código incorrecto",
    [errorCodes.PHONE_FORMAT_ERROR]:
        "El formato del teléfono es incorrecto. Ej:+11111111111",
    [errorCodes.DIRECTION_FORMAT_ERROR]:
        "El formato de la dirección es incorrecto o falta información",
    [errorCodes.TIME_FORMAT_ERROR]:
        "El formato del horario es incorrecto o falta información",
    [errorCodes.STRING_FORMAT_ERROR]:
        "La cadena de texto no debe tener caracteres especiales",
    [errorCodes.COMMENT_FORMAT_ERROR]:
        "La cadena de texto no debe tener caracteres especiales y ser menor a 254 caracteres",
    [errorCodes.USER_NOT_EXISTS_ERROR]: "El usuario no existe",
    [errorCodes.BLOCKED_ACCOUNT_ERROR]:
        "La cuenta está bloqueada, contacte con soporte",
    [errorCodes.UNACTIVATED_ACCOUNT_ERROR]:
        "La cuenta no ha sido activada, contacte con soporte",
    [errorCodes.INCORRECT_PASSWORD_ERROR]: "Contraseña incorrecta",
    [errorCodes.VENDOR_NOT_EXISTS_ERROR]: "El vendedor no existe",
    [errorCodes.VENDOR_PERMISSION_ERROR]:
        "El vendedor no tiene los permisos adecuados",
    [errorCodes.INCORRECT_INTEGER_FORMAT]:
        "El número debe ser un entero. Ej: 100",
    [errorCodes.ACTION_DONE_ERROR]:
        "La acción ya ha sido realizada anteriormente",
    [errorCodes.ADMIN_NOT_EXISTS_ERROR]: "La cuenta de administrador no existe",
};
