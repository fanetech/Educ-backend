const utilsTools = require("../../utils/utils.tools");
const utilsError = require("../../utils/utils.errors");
const classroomService = require("./classroomService");
const handleError = require("../../services/handleError");
const { STATUS_CODE } = require("../../services/constant");

module.exports.create = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req);
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await classroomService.create(req.body);
    return await utilsError.globalSatuts(res, response);
};

module.exports.getOne = async (req, res) => {
    const id = req?.params?.id
    if (!utilsTools.checkParams(id)) {
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await classroomService.getOne(req.params.id)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getAll = async (req, res) => {
    const response = await classroomService.getAll()
    return await utilsError.globalSatuts(res, response)
}

module.exports.updateClassroom = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req)
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await classroomService.modify(req.params.id, req.body);
    return await utilsError.globalSatuts(res, response);
}

module.exports.remove = async (req, res) => {
    const id = req?.params?.id
    if (!utilsTools.checkParams(id)) {
        return await utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, handleError.specificError.DATA_REQUIRED));
    }
    const response = await classroomService.remove(id)
    return await utilsError.globalSatuts(res, response)
}

module.exports.getClassroomByField = async (req, res) => {
    const response = await classroomService.getClassroomByField(req.params)
    return await utilsError.globalSatuts(res, response)
}

module.exports.addClassroomDeadline = async (req, res) => {
    const reqAnalityc = utilsTools.checkRequest(req);
    if (reqAnalityc !== 1) {
        return await utilsError.globalSatuts(res, reqAnalityc);
    }
    const response = await classroomService.addClassroomDeadline(req.body, req.params.id);
    return await utilsError.globalSatuts(res, response);
}