const utilsTools = require("../../utils/utils.tools");
const utilsError = require("../../utils/utils.errors");
const handleError = require("../../services/handleError");
const { STATUS_CODE, RETURN_STATUS, SCHEMA_FIELD } = require("../../services/constant");
const { classroomMatterSchema } = require("./models/classroomMatterModel");
const { realmQuery } = require("../../services/realmQuery");
const { customQuery } = require("../../services/customQuery");
const { classroomTeacherSchema } = require("../classroomTeacher/models/classroomTeacherModel");
const { classroomSchema } = require("../classroom/models/classroomModel");
const { getRealm } = require("../../config/realmConfig");

module.exports.create = async (data) => {
    try {
        const { name, classroomId, coef } = data;
        if (!name || !classroomId || !coef) {
            return handleError.errorConstructor(STATUS_CODE.NOT_DATA);
        }
        const matter = await realmQuery.getWithQueryAndId(classroomMatterSchema.name, customQuery.GET_ROW_BY_STRING_ATTRIBUTE_AND_ID('name', name, 'classroomId'), classroomId);
        if (matter.length > 0) {
            return handleError.errorConstructor(
                STATUS_CODE.DATA_EXIST,
                null,
                "Mattière deja existante"
            );
        }
        if (data.teacherId) {
            const teacher = await realmQuery.getOne(classroomTeacherSchema.name, data.teacherId);
            if (!teacher) {
                return handleError.errorConstructor(
                    STATUS_CODE.DATA_EXIST,
                    null,
                    handleError.specificError.TEACHER_NOT_FOUND
                );
            }
            data.teacherId = utilsTools.convertRealmObjectId(data.teacherId)
        }
        const classroom = await realmQuery.getOne(classroomSchema.name, classroomId);
        if (!classroom) {
            return handleError.errorConstructor(
                STATUS_CODE.DATA_EXIST,
                null,
                handleError.specificError.CLASSROOM_NOT_FOUND
            );
        }
        data.classroomId = utilsTools.convertRealmObjectId(classroomId)
        const newMatter = this.handleClassroomMatterAdding(data, classroom)
        if (!newMatter) {
            throw new Error("classroom_create_error");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, newMatter)
    } catch (error) {
        console.log("classroom_matter_create_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.handleClassroomMatterAdding = (data, classroom) => {
    let matter;
    const realm = getRealm();
    realm.write(() => {
        matter = realm.create(classroomMatterSchema.name, data);
        classroom.matterIds.push(matter._id);
    });
    return matter
}

module.exports.getOne = async (id) => {
    try {
        const matter = await realmQuery.getOne(classroomMatterSchema.name, id);
        if (!matter) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.TEACHER_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, matter);
    } catch (error) {
        console.log("classroom_matter_getOne_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getAll = async () => {
    try {
        const matters = await realmQuery.getAll(classroomMatterSchema.name);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, matters);
    } catch (error) {
        console.log("classroom_matter_getAll_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.modify = async (id, data) => {
    try {
        if(data.name && data.classroomId){
            const matter = await realmQuery.getWithQueryAndId(classroomMatterSchema.name, customQuery.GET_ROW_BY_STRING_ATTRIBUTE_AND_ID('name', data.name, 'classroomId'), data.classroomId);
            if (matter.length > 0) {
                return handleError.errorConstructor(
                    STATUS_CODE.DATA_EXIST,
                    null,
                    "Mattière deja existante"
                );
            }
        }
        if (data.teacherId) {
            const teacher = await realmQuery.getOne(classroomTeacherSchema.name, data.teacherId);
            if (!teacher) {
                return handleError.errorConstructor(
                    STATUS_CODE.DATA_EXIST,
                    null,
                    handleError.specificError.TEACHER_NOT_FOUND
                );
            }
            data.teacherId = utilsTools.convertRealmObjectId(data.teacherId)
        }
        if(data.classroomId){
            const classroom = await realmQuery.getOne(classroomSchema.name, data.classroomId);
            if (!classroom) {
                return handleError.errorConstructor(
                    STATUS_CODE.DATA_EXIST,
                    null,
                    handleError.specificError.CLASSROOM_NOT_FOUND
                );
            }
            data.classroomId = utilsTools.convertRealmObjectId(data.classroomId);
        }
        const matterUpdate = await realmQuery.upadte(classroomMatterSchema.name, id, data);
        if (!matterUpdate) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.TEACHER_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, matterUpdate);
    } catch (error) {
        console.log("classroom_matter_update_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.remove = async (id, requireData) => {
    try {
        if (!requireData.classroomId) {
            return handleError.errorConstructor(STATUS_CODE.NOT_DATA);
        }
        const data = await realmQuery.deleteAndUpdateArray(classroomMatterSchema.name, classroomSchema.name, 'matterIds', requireData.classroomId, id, [], true);
        if (!data) {
            throw new Error("classroom matter not deleted or not found");
        }
        if (data === RETURN_STATUS.notEmpty) {
            return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR_DB, null, handleError.specificError.FIELD_NOT_EMPTY);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, data);
    } catch (error) {
        console.log("classroom_matter_remove_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getClassroomMatterByField = async (data) => {
    try {
        const field = SCHEMA_FIELD[data.field]
        if (!field) {
            throw new Error("get_classroom_matter_by_field field no found");
        }
        const datas = await realmQuery.getDataByCustomQuery(classroomMatterSchema.name, field, utilsTools.convertRealmObjectId(data.value));
        if (!datas) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, datas);
    } catch (error) {
        console.log("getClassroomMatterByField_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
  }
