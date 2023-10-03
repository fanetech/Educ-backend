const { realmQuery } = require("../../services/realmQuery");
const handleError = require("../../services/handleError");
const { STATUS_CODE, SERVER_STATUS, USER_ROLE, SCHEMA_FIELD } = require("../../services/constant");
const { schoolActorSchema } = require("./models/schoolActorModel");
const { userSchema } = require("../user/model/userModel");
const { BSON } = require("realm");

module.exports.create = async (data) => {
    try {
        const { schoolId, userId, role } = data;
        const user = await realmQuery.getOne(schoolSchema.name, userId);
        if (!user) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.GET_USER_BY_ID_NOT_FOUND);
        }
        const actor = realmQuery.add(schoolActorSchema.name, {
            schoolId,
            userId,
            role,
            actif: true,
        });
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, null, actor);
    } catch (error) {
        console.log("school_addActor_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getAll = async () => {
    try {
        const actors = await realmQuery.getAll(schoolActorSchema.name);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, actors);
    } catch (error) {
        console.log("school_getAllActor_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getOne = async (id) => {
    try {
        const actor = await realmQuery.getOne(schoolActorSchema.name, id);
        if(!actor){
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.ACTOR_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, actor);
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
        if (data.userId) {
            const user = await realmQuery.getOne(userSchema.name, data.userId);
            if (!user) {
                return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.GET_USER_BY_ID_NOT_FOUND);
            }
            data.userId = BSON.ObjectId(data.userId);
        }
        const actor = await realmQuery.upadte(schoolActorSchema.name, id, data);
        if(!actor){
            throw new Error("Actor not updated");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, actor);
    } catch (error) {
        console.log("school_updateActor_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.delete = async (id) => {
    try {
        const actor = await realmQuery.delete(schoolActorSchema.name, id);
        if(!actor){
            throw new Error("Actor not deleted or not found");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, actor);
    } catch (error) {
        console.log("school_deleteActor_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getActorByField = async (data) => {
    try {
        const field = SCHEMA_FIELD[data.field]
        if(!field){
            throw new Error("get_actor_by_field field no found");
        }
        const userActorInSchool = await realmQuery.getDataByCustomQuery(schoolActorSchema.name, field, BSON.ObjectId(data.value));
        if(!userActorInSchool){
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, userActorInSchool);
    } catch (error) {
        console.log("school_getActorByUserId_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}