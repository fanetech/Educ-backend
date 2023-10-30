const { STATUS_CODE, SERVER_STATUS } = require("./constant");

module.exports.codeError = [
    { code: STATUS_CODE.SUCCESS, msg: "Opération effectuée avec succès!" },
    { code: STATUS_CODE.UNEXPECTED_ERROR, msg: "Une erreur inattendu c'est produit! Veuillez reessayer!" },
    { code: STATUS_CODE.UNEXPECTED_ERROR_DB, msg: "Une erreur c'est produit sur vos données!" },
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
    SCHOOL_CREATE_MISSING_DATA: "nom de établissement, slogan ou un fondateur",
    GET_USER_BY_ID_NOT_FOUND: "utilisateur non trouvé!",
    USER_REQUIREMENT_EXCEPTION_SCHOOL_CREATE: "pour le titulaire de l'etablissement, veuillez mettre à jour votre profile: nom, prénom, numéro de téléphone, email, adresse, role=fondateur",
    DATA_REQUIRED: "données indispensable incorect",
    SCHOOL_NOT_FOUND: "etablissement non trouvé!",
    SCHOOL_YEAR_NOT_FOUND: "Année scolaire non trouvé",
    CLASSROOM_NOT_FOUND: "classe non trouvé",
    ACTOR_NOT_FOUND: "acteur non trouvé!",
    SCHOOL_YEAR_PERIOD_NOT_FOUND: "période scolaire non trouvé!",
    SCHOOL_YEAR_DEADLINE_NOT_FOUND: "éheance scolaire non trouvé!",
    SCHOOL_YEAR_PERIOD_NDIVISION_ERROR: "nDivision ne doit pas être supérieur au nDivision de l'année scolaire!",
    FIELD_NOT_EMPTY: "cette action nécessite la suppression de certaines données!",
    TEACHER_NOT_FOUND: "enseignant non trouvé!",
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
        response.status = SERVER_STATUS.SUCCESS;

    } else if (STATUS_CODE.UNEXPECTED_ERROR && code < STATUS_CODE.NOT_DATA) {
        response.status = SERVER_STATUS.UNEXPECTED_ERROR;

    } else if (code >= STATUS_CODE.NOT_DATA) {
        response.status = SERVER_STATUS.NOT_DATA;

    } else {
        response.status = SERVER_STATUS.SERVICE_UNAVAILABLE;
    }
    return response
}

module.exports.foundError = (code) => {
    return this.codeError.find(d => d.code === code)
}