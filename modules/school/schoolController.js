const utilsTools  = require('../../utils/utils.tools');
const utilsError  = require('../../utils/utils.errors');
const schoolService = require('./schoolService');

module.exports.create = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req)
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc)
    }
    const response = await schoolService.create(req.body)
    return await utilsError.globalSatuts(res, response)
};