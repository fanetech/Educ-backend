const { getRealm } = require("../../config/realmConfig");
const { STATUS_CODE, RETURN_STATUS, SCHEMA_FIELD, TEACHER_ROLE } = require("../../services/constant");
const handleError = require("../../services/handleError");
const { realmQuery } = require("../../services/realmQuery");
const utilsTools = require("../../utils/utils.tools");
const { schoolActorSchema } = require("../schoolActor/models/schoolActorModel");
const { classroomTeacherSchema } = require("./models/classroomTeacherModel");
const { classroomSchema } = require("../classroom/models/classroomModel");

module.exports.create = async (data) => {
    try {
        const { actorId, classroomId, role } = data;
        if (!actorId || !classroomId || !role) {
            return handleError.errorConstructor(STATUS_CODE.NOT_DATA);
        }
        const actor = await realmQuery.getOne(schoolActorSchema.name, actorId);
        if (!actor) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.ACTOR_NOT_FOUND);
        }
        const classroom = await realmQuery.getOne(classroomSchema.name, classroomId);
        if (!classroom) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.CLASSROOM_NOT_FOUND);
        }
        const roleExist = TEACHER_ROLE.find(roleUsed => roleUsed === role);
        if (!roleExist) {
            return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, handleError.specificError.ROLE_NOT_EXIST);
        }
        let newTeacher = this.handleClassroomTeacherAdding({
            actorId: utilsTools.convertRealmObjectId(actorId),
            role: roleExist
        }, classroom)
        if (!newTeacher) {
            throw new Error("classroom_create_error");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, newTeacher)
    } catch (error) {
        console.log("classroom_teacher_create_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.handleClassroomTeacherAdding = (data, classroom) => {
    let teacher;
    const realm = getRealm();
    realm.write(() => {
        teacher = realm.create(classroomTeacherSchema.name, data);
        classroom.teacherIds.push(teacher._id);
    });
    return teacher
}

module.exports.getOne = async (id) => {
    try {
        const teacher = await realmQuery.getOne(classroomTeacherSchema.name, id);
        if (!teacher) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.TEACHER_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, teacher);
    } catch (error) {
        console.log("classroom_teacher_getOne_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getAll = async () => {
    try {
        const teacher = await realmQuery.getAll(classroomTeacherSchema.name);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, teacher);
    } catch (error) {
        console.log("classroom_teacher_getAll_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.modify = async (id, data) => {
    try {
        if (data.actorId) {
            const actor = await realmQuery.getOne(schoolActorSchema.name, data.actorId);
            if (!actor) {
                return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.ACTOR_NOT_FOUND);
            }
            data.actorId = utilsTools.convertRealmObjectId(data.actorId);
        }
        if (data.role) {
            const roleExist = TEACHER_ROLE.find(roleUsed => roleUsed === data.role);
            if (!roleExist) {
                return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, handleError.specificError.ROLE_NOT_EXIST);
            }
        }
        const teacherUpdate = await realmQuery.upadte(classroomTeacherSchema.name, id, data);
        if (!teacherUpdate) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.TEACHER_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, teacherUpdate);
    } catch (error) {
        console.log("classroom_teacher_update_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.remove = async (id, requireData) => {
    try {
        if (!requireData.classroomId) {
            return handleError.errorConstructor(STATUS_CODE.NOT_DATA);
        }
        const data = await realmQuery.deleteAndUpdateArray(classroomTeacherSchema.name, classroomSchema.name, 'teacherIds', requireData.classroomId, id, [], true);
        if (!data) {
            throw new Error("classroom teacher not deleted or not found");
        }
        if (data === RETURN_STATUS.notEmpty) {
            return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR_DB, null, handleError.specificError.FIELD_NOT_EMPTY);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, data);
    } catch (error) {
        console.log("classroom_teacher_remove_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}
