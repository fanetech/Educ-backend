const utilsTools = require("../../utils/utils.tools");
const utilsError = require("../../utils/utils.errors");
const pupilabsenceService = require("./absence.service");
const handleError = require("../../services/handleError");
const { STATUS_CODE } = require("../../services/constant");

module.exports.create = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req);
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await pupilabsenceService.create(req.body);
    return await utilsError.globalSatuts(res, response);
};