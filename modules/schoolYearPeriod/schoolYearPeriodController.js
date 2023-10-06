const utilsError = require('../../utils/utils.errors');
const utilsTools = require('../../utils/utils.tools');
const schoolYearPeriodService = require('./schoolYearPeriodService');

module.exports.create = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req);
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await schoolYearPeriodService.create(req.body);
    return await utilsError.globalSatuts(res, response);
};

module.exports.getOne = async (req, res) => {
    const id = req?.params?.id
    if (!utilsTools.checkParams(id)) {
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await schoolYearPeriodService.getOne(req.params.id)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getAll = async (req, res) => {
    const response = await schoolYearPeriodService.getAll()
    return await utilsError.globalSatuts(res, response)
}

module.exports.updateSchoolYearPeriod = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req)
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await schoolYearPeriodService.modify(req.params.id, req.body);
    return await utilsError.globalSatuts(res, response);
}

module.exports.remove = async (req, res) => {
    const id = req?.params?.id
    if (!utilsTools.checkParams(id)) {
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await schoolYearPeriodService.remove(id)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getschoolYearPeriodByField = async (req, res) => {
    const response = await schoolYearPeriodService.getschoolYearPeriodByField(req.params)
    return await utilsError.globalSatuts(res, response)
}