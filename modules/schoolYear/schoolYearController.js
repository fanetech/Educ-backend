const utilsTools = require("../../utils/utils.tools");
const utilsError = require("../../utils/utils.errors");
const schoolYearService = require("./schoolYearService");
const handleError = require("../../services/handleError")

module.exports.create = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req);
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await schoolYearService.create(req.body);
    return await utilsError.globalSatuts(res, response);
};

module.exports.getOne = async (req, res) => {
    const id = req?.params?.id
    if(!utilsTools.checkParams(id)){
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await schoolYearService.getOne(req.params.id)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getAll = async (req, res) => {
    const response = await schoolYearService.getAll()
    return await utilsError.globalSatuts(res, response)
}

module.exports.updateSchoolYear = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req)
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await schoolYearService.modify(req.params.id, req.body);
    return await utilsError.globalSatuts(res, response);
}

module.exports.remove = async (req, res) => {
    const id = req?.params?.id
    if(!utilsTools.checkParams(id)){
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await schoolYearService.remove(id)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getUserSchoolByField = async (req, res) => {
    const response = await schoolYearService.getschoolYearByField(req.params)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getSchoolYearPeriods = async (req, res) => {
    const schoolYearId = req?.params?.schoolYearId;
    if(!utilsTools.checkParams(schoolYearId)){
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await schoolYearService.getSchoolYearPeriods(schoolYearId);
    return await utilsError.globalSatuts(res, response);
}

module.exports.getSchoolYearDeadline = async (req, res) => {
    const schoolYearId = req?.params?.schoolYearId;
    if(!utilsTools.checkParams(schoolYearId)){
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await schoolYearService.getSchoolYearDeadlines(schoolYearId);
    return await utilsError.globalSatuts(res, response);
}

module.exports.getSchoolYearClassroom = async (req, res) => {
    const schoolYearId = req?.params?.schoolYearId;
    if(!utilsTools.checkParams(schoolYearId)){
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await schoolYearService.getSchoolYearClassroom(schoolYearId);
    return await utilsError.globalSatuts(res, response);
}