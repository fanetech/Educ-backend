const utilsTools = require("../../utils/utils.tools");
const utilsError = require("../../utils/utils.errors");
const pupilPeriod = require("./PupilPeriod.service");
const handleError = require("../../services/handleError");
const { STATUS_CODE } = require("../../services/constant");

module.exports.create = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req);
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await pupilPeriod.create(req.body);
    return await utilsError.globalSatuts(res, response);
};

module.exports.getOne = async (req, res) => {
    const id = req?.params?.id
    if (!utilsTools.checkParams(id)) {
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await pupilPeriod.getOne(req.params.id)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getAll = async (req, res) => {
    const response = await pupilPeriod.getAll()
    return await utilsError.globalSatuts(res, response)
}

module.exports.remove = async (req, res) => {
    const id = req?.params?.id
    if (!utilsTools.checkParams(id)) {
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await pupilPeriod.remove(id)
    return await utilsError.globalSatuts(res, response)
}