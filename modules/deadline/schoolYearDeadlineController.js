const utilsError = require('../../utils/utils.errors');
const utilsTools = require('../../utils/utils.tools');
const schoolYearDeadlineService = require('./schoolYearDeadlineService');

module.exports.create = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req);
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await schoolYearDeadlineService.create(req.body);
    return await utilsError.globalSatuts(res, response);
};

module.exports.getOne = async (req, res) => {
    const id = req?.params?.id
    if (!utilsTools.checkParams(id)) {
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await schoolYearDeadlineService.getOne(req.params.id)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getAll = async (req, res) => {
    const response = await schoolYearDeadlineService.getAll()
    return await utilsError.globalSatuts(res, response)
}

module.exports.updateSchoolYearPeriod = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req)
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await schoolYearDeadlineService.modify(req.params.id, req.body);
    return await utilsError.globalSatuts(res, response);
}

module.exports.remove = async (req, res) => {
    const id = req?.params?.id
    if (!utilsTools.checkParams(id)) {
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await schoolYearDeadlineService.remove(id)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getschoolYearDeadlineByField = async (req, res) => {
    const response = await schoolYearDeadlineService.getschoolYearDeadlineByField(req.params)
    return await utilsError.globalSatuts(res, response)
}