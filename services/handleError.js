const { STATUS_CODE } = require("./constant");

module.exports.codeError = [
    { code: STATUS_CODE.SUCCESS, msg: "Opération effectuée avec succès!" },

    { code: STATUS_CODE.UNEXPECTED_ERROR, msg: "Une erreur inattendu c'est produit! Veuillez reessayer!" },

    { code: STATUS_CODE.NOT_DATA, msg: "Pas de données!" },

    { code: STATUS_CODE.DATA_INCORRECT, msg: "donnée incorrect!" },

    { code: STATUS_CODE.DATA_EXIST, msg: "donnée existant!" },

    { code: STATUS_CODE.NOT_FOUND, msg: "document non trouvé!" },

    { code: STATUS_CODE.DATA_REQUIS, msg: "donnée requis!" },
]

module.exports.errorConstructor = (code, data, message) => {

    let response = { send: {entete: {code: null, msgs: ""}, docs: null}, status: 502 }

    response.send.docs = data ?? null

    let error = this.foundError(code)

   

    if (!error) {
        return response;
    }

    if(message){
        response.send.entete.code = error.code
        response.send.entete.msgs = `${error.msg} ${message}.`
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