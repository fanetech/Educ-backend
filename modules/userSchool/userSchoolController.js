const utilsError = require('../../utils/utils.errors');
const userSchoolService = require('./userSchoolService');
const utilsTools = require('../../utils/utils.tools');
const handleError = require('../../services/handleError');
const { STATUS_CODE } = require('../../services/constant');

module.exports.create = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req);
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await userSchoolService.create(req.body);
    return await utilsError.globalSatuts(res, response);
}

module.exports.getAll = async (req, res) => {
    const response = await userSchoolService.getAll()
    return await utilsError.globalSatuts(res, response)
};

module.exports.getOne = async (req, res) => {
    const id = req?.params?.id;
    if(!utilsTools.checkParams(id)){
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await userSchoolService.getOne(id)
    return await utilsError.globalSatuts(res, response)
};

module.exports.modify = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req);
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await userSchoolService.modify(req.params.id, req.body);
    return await utilsError.globalSatuts(res, response);
}

module.exports.delete = async (req, res) => {
    const id = req?.params?.id
    if(!utilsTools.checkParams(id)){
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await userSchoolService.delete(id)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getUserSchoolByField = async (req, res) => {
    const response = await userSchoolService.getUserSchoolByField(req.params)
    return await utilsError.globalSatuts(res, response)
}