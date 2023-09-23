const utilsTools = require('../../utils/utils.tools');
const handleError = require('../../services/handleError');
const { STATUS_CODE, USER_ROLE } = require('../../services/constant');
const { realmQuery } = require('../../services/realmQuery');
const { userSchema } = require('./model/userModel');
const utilsError = require('../../utils/utils.errors');
const { customQuery } = require('../../services/customQuery');

module.exports.getById = async (id) => {
    try {
        if (!utilsTools.checkParams(id)) {
            throw new Error("id is required");
        }
        const user = await realmQuery.getOne(userSchema.name, id);
        if (!user) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.GET_USER_BY_ID_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, user);
    } catch (error) {
        console.log("userService.getById error => ", error);
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }

}

module.exports.getAllUser = async () => {
    const response = await realmQuery.getAll(userSchema.name)
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, response);
}

module.exports.updateUser = async (data, id) => {
    try {
        if (data.role) {
            const _role = USER_ROLE[data.role]
            if (!_role) {
                return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, handleError.specificError.INCORRECT_ROLE(USER_ROLE));
            }
        }
        if (data.number || data.email) {
            const userExist = await realmQuery.getWithQuery(userSchema.name, customQuery.GET_USER_BY_EMAIL_AND_NUMBER(data.email, data.number));
            if (userExist.length > 0) {
                return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, handleError.specificError.REGISTER_EMAIL_OR_NUMBER_NO_EXIST);
            }
        }
        const response = await realmQuery.upadte(userSchema.name, id, data);
        if (!response) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.GET_USER_BY_ID_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, response);
    } catch (error) {
        console.log("userService.updateUser error => ", error);
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.remove = async (id) => {
    try {
        const response = await realmQuery.delete(userSchema.name, id);
        if(!response){
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.GET_USER_BY_ID_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, response);        
    } catch (error) {
        console.log("userService.remove error => ", error);
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}