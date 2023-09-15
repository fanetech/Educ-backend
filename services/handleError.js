const { STATUS_CODE } = require("./constant");

module.exports.codeError = [
    { code: STATUS_CODE.SUCCESS, msg: "Opération effectuée avec succès!" },

    { code: STATUS_CODE.UNEXPECTED_ERROR, msg: "Une erreur inattendu c'est produit! Veuillez reessayer!" },

    { code: STATUS_CODE.NOT_DATA, msg: "Pas de données!" },

    { code: STATUS_CODE.DATA_INCORRECT, msg: "Donnée incorrect!" },

    { code: STATUS_CODE.DATA_EXIST, msg: "Donnée existant!" },

    { code: STATUS_CODE.NOT_FOUND, msg: "Document non trouvé!" },

    { code: STATUS_CODE.DATA_REQUIS, msg: "Donnée requis!" },
]

module.exports.specificError = {
    REGISTER_EMAIL_OR_NUMBER_NO_EXIST: "email ou numéro de téléphone existant!",
    ID_DATA_REQUIRED: "identifiants requis!",
    PASSWORD_ERROR: "mot de passe court!",
    INCORRECT_ROLE: (roleUsed) => "role incorect. utiliser " + Object.values(roleUsed).toString(),
    USER_LOGIN_DATA_ERROR: "identifiants incorrect!",
}

module.exports.errorConstructor = (code, data, message) => {
    let response = { send: {entete: {code: null, msg: ""}, docs: null}, status: 502 }
    response.send.docs = data ?? null
    let error = this.foundError(code)
    if (!error) {
        return response;
    }

    if(message){
        response.send.entete.code = error.code
        response.send.entete.msg = `${error.msg} ${message}.`
    }else {
        response.send.entete = error
    }

    if (code >= STATUS_CODE.SUCCESS && code <= STATUS_CODE.SUCCESS) {
        response.status = 200;

    } else if (STATUS_CODE.UNEXPECTED_ERROR && code < STATUS_CODE.NOT_DATA) {
        response.status = 500;

    } else if (code >= STATUS_CODE.NOT_DATA) {
        response.status = 400;

    } else {
        response.status = 503;
    }
    return response
}

module.exports.foundError = (code) => {
    return this.codeError.find(d => d.code === code)
}