const { userSchoolSchema } = require("./models/userSchoolModel");
const handleError = require("../../services/handleError");
const { realmQuery } = require("../../services/realmQuery");
const { STATUS_CODE, USER_ROLE, SERVER_STATUS } = require("../../services/constant");
const { schoolSchema } = require("../school/models/schoolModel");
const { BSON } = require("realm");

// module.exports.create = async (data) => {
//     try {
//         const { schoolId, userId, role } = data;
//         const user = await realmQuery.getOne(schoolSchema.name, userId);
//         if (!user || user.status === SERVER_STATUS.SERVICE_UNAVAILABLE) {
//             return handleError.errorConstructor(STATUS_CODE.NOT_FOUND);
//         }
//         const actor = realmQuery.add(schoolActorSchema.name, {
//             schoolId,
//             userId,
//             role,
//             actif: true,
//         });
//         return handleError.errorConstructor(STATUS_CODE.SUCCESS, null, actor);
//     } catch (error) {
//         console.log("school_addActor_error =>", error)
//         return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
//     }
// }

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
        if (data.schoolId) {
            console.log("data.schoolId =>", data.schoolId)
            const school = await realmQuery.getOne(schoolSchema.name, data.schoolId);
            if (!school || school.status === SERVER_STATUS.SERVICE_UNAVAILABLE) {
                return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.GET_USER_BY_ID_NOT_FOUND);
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
        const response = await realmQuery.delete(userSchoolSchema.name, id);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, response);
    } catch (error) {
        console.log("school_deleteActor_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}