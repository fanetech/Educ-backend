const userService = require('./userService');
const utilsError = require('../../utils/utils.errors')
const utilsTools = require('../../utils/utils.tools');

module.exports.getUserById = async (req, res) => {
    const response = await userService.getById(req.params.id);
    return await utilsError.globalSatuts(res, response);
};

module.exports.updateUser = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req)

    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc)
    }
    const response = await userService.updateUser(req.body, req.params.id);
    return await utilsError.globalSatuts(res, response);
};

module.exports.getAllUser = async (req, res) => {
    const response = await userService.getAllUser();
    return await utilsError.globalSatuts(res, response);
};

module.exports.remove = async (req, res) => {
    const response = await userService.remove(req.params.id);
    return await utilsError.globalSatuts(res, response);
};

module.exports.getuserSchools = async (req, res) => {
    const userId = req?.params?.id;
    if(!utilsTools.checkParams(userId)){
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await userService.getuserSchools(userId);
    return await utilsError.globalSatuts(res, response);
};