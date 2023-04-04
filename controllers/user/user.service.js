const userModel = require("../../models/user.model");
const { STATUS_CODE } = require("../../services/constant");
const utilsTools = require('../../utils/utils.tools')
const handleError = require('../../services/handleError')


module.exports.getById = async (id) => {
    
    if(!utilsTools.checkParams(id)){
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR); 
    }
    const user = await userModel
        .findById(id)
        .select({ password: false });

    if (!user) {
        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "utilisateur");
    }

    return handleError.errorConstructor(STATUS_CODE.SUCCESS, user);
}