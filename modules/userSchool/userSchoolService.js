const { userSchoolSchema } = require("./models/userSchoolModel");
const handleError = require("../../services/handleError");
const { realmQuery } = require("../../services/realmQuery");
const { STATUS_CODE, USER_ROLE, SERVER_STATUS, SCHEMA_FIELD, RETURN_STATUS } = require("../../services/constant");
const { schoolSchema } = require("../school/models/schoolModel");
const { BSON } = require("realm");
const { userSchema } = require("../user/model/userModel");

module.exports.create = async (data) => {
    // try {
    //     const { schoolId, userId, role } = data;
    //     const user = await realmQuery.getOne(userSchema.name, userId);
    //     if (!user) {
    //         return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.GET_USER_BY_ID_NOT_FOUND);
    //     }
    //     const userSchool = await realmQuery.getOne(userSchoolSchema.name, schoolId);
    //     console.log("userSchool =>", userSchool)
    //     if(!userSchool){
    //         return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_NOT_FOUND);
    //     }
    //     const actor = realmQuery.add(schoolActorSchema.name, {
    //         schoolId,
    //         userId,
    //         role,
    //         actif: true,
    //     });
    //     if(!actor){
    //         throw new Error("error to create actor");
    //     }
    //     return handleError.errorConstructor(STATUS_CODE.SUCCESS, null, actor);
    // } catch (error) {
    //     console.log("school_addActor_error =>", error)
    //     return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    // }
}

module.exports.getAll = async () => {
    try {
        const userSchools = await realmQuery.getAll(userSchoolSchema.name);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, userSchools);
    } catch (error) {
        console.log("school_getAllActor_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getOne = async (id) => {
    try {
        const userSchool = await realmQuery.getOne(userSchoolSchema.name, id);
        if (!userSchool) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, userSchool);
    } catch (error) {
        console.log("school_getOneActor_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.modify = async (id, data) => {
    try {
        if (data.role) {
            const _role = USER_ROLE[data.role]
            if (!_role) {
                return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, handleError.specificError.INCORRECT_ROLE(USER_ROLE));
            }
        }
        // TODO: check if schoolId exist
        console.log("data.schoolId =>", data.schoolId)
        if (data.schoolId) {
            console.log("data.schoolId =>", data.schoolId)
            const school = await realmQuery.getOne(schoolSchema.name, data.schoolId);
            console.log("school =>", school)
            if (!school) {
                return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_NOT_FOUND);
            }
            data.schoolId = BSON.ObjectId(data.userId);
        }
        const userschool = await realmQuery.upadte(userSchoolSchema.name, id, data);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, userschool);
    } catch (error) {
        console.log("school_updateActor_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.delete = async (id) => {
    try {
        const response = await realmQuery.deleteAndUpdateArray(userSchoolSchema.name, userSchema.name, 'schoolIds', 'userId', id);
        if(!response){
            throw new Error("error to delete actor");
        }
        if(response === RETURN_STATUS.notEmpty){
            return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR_DB, null, handleError.specificError.FIELD_NOT_EMPTY);
          }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, response);
    } catch (error) {
        console.log("school_deleteActor_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getUserSchoolByField = async (data) => {
    try {
        const field = SCHEMA_FIELD[data.field]
        if (!field) {
            throw new Error("get_actor_by_field field no found");
        }
        const userSchools = await realmQuery.getDataByCustomQuery(userSchoolSchema.name, field, BSON.ObjectId(data.value));
        if (!userSchools) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, userSchools);
    } catch (error) {
        console.log("school_getActorByUserId_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}