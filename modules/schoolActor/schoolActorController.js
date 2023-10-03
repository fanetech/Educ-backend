const utilsError = require('../../utils/utils.errors');
const utilsTools = require('../../utils/utils.tools');
const SchoolActorService = require('./schoolActorService');
const handleError = require('../../services/handleError');
const { STATUS_CODE } = require('../../services/constant');

module.exports.create = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req)
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc)
    }
    const response = await SchoolActorService.create(req.body)
    return await utilsError.globalSatuts(res, response)
};

module.exports.getAll = async (req, res) => {
    const response = await SchoolActorService.getAll()
    return await utilsError.globalSatuts(res, response)
};

module.exports.getOne = async (req, res) => {
    const id = req?.params?.id
    if(!utilsTools.checkParams(id)){
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await SchoolActorService.getOne(id)
    return await utilsError.globalSatuts(res, response)
};

module.exports.modify = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req);
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await SchoolActorService.modify(req.params.id, req.body);
    return await utilsError.globalSatuts(res, response);
}

module.exports.delete = async (req, res) => {
    const id = req?.params?.id
    if(!utilsTools.checkParams(id)){
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await SchoolActorService.delete(id)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getActorByField = async (req, res) => {
    const response = await SchoolActorService.getActorByField(req.params)
    return await utilsError.globalSatuts(res, response)
}