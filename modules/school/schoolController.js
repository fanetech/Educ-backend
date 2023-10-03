const utilsTools  = require('../../utils/utils.tools');
const utilsError  = require('../../utils/utils.errors');
const schoolService = require('./schoolService');
const handleError = require('../../services/handleError');
const { STATUS_CODE } = require('../../services/constant');

module.exports.create = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req)
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc)
    }
    const response = await schoolService.create(req.body)
    return await utilsError.globalSatuts(res, response)
};

module.exports.getOne = async (req, res) => {
    const id = req?.params?.id
    if(!utilsTools.checkParams(id)){
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await schoolService.getOne(req.params.id)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getAll = async (req, res) => {
    const response = await schoolService.getAll()
    return await utilsError.globalSatuts(res, response)
}

module.exports.updateSchool = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req)
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await schoolService.modify(req.params.id, req.body);
    return await utilsError.globalSatuts(res, response);
}

module.exports.remove = async (req, res) => {
    const id = req?.params?.id
    if(!utilsTools.checkParams(id)){
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await schoolService.remove(id)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getSchoolActors = async (req, res) => {
    const schoolId = req?.params?.id;
    if(!utilsTools.checkParams(schoolId)){
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await schoolService.getSchoolActors(schoolId);
    return await utilsError.globalSatuts(res, response);
}

module.exports.addActor = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req)
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc)
    }
    const response = await schoolService.addActor(req.params.id, req.body)
    return await utilsError.globalSatuts(res, response)
};