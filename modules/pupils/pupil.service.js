const { getRealm } = require("../../config/realmConfig");
const { STATUS_CODE, RETURN_STATUS, SCHEMA_FIELD } = require("../../services/constant");
const handleError = require("../../services/handleError");
const { realmQuery } = require("../../services/realmQuery");
const utilsTools = require("../../utils/utils.tools");
const { classroomSchema } = require("../classroom/models/classroomModel");
const { pupilSchema } = require("./models/pupil.model");

module.exports.handleAddPupil = (data, classroom) => {
    let pupilCreated;
    const realm = getRealm();
    realm.write(() => {
        pupilCreated = realm.create(pupilSchema.name, data);
        classroom.totalPupils += 1;
        classroom.pupilIds.push(pupilCreated._id);
    });
    return pupilCreated
}

module.exports.create = async (data) => {
    try {
        const { lastname, firstname, classroomId } = data;
        if (!lastname || !firstname || !classroomId) {
            return handleError.errorConstructor(STATUS_CODE.NOT_DATA);
        }
        const classroom = await realmQuery.getOne(classroomSchema.name, classroomId);
        if (!classroom) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.CLASSROOM_NOT_FOUND);
        }
        let pupilCreated = this.handleAddPupil({
            ...data,
            classroomId: classroom._id,
        }, classroom)
        if (!pupilCreated) {
            throw new Error("pupil_create_error");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, pupilCreated)

    } catch (error) {
        console.log("pupil_create_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getOne = async (id) => {
    try {
        const pupil = await realmQuery.getOne(pupilSchema.name, id);
        if (!pupil) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.CLASSROOM_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, pupil);
    } catch (error) {
        console.log("pupil_getOne_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getAll = async () => {
    try {
        const pupils = await realmQuery.getAll(pupilSchema.name);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, pupils);
    } catch (error) {
        console.log("pupil_getAll_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.modify = async (id, data) => {
    try {
        if (data.classroomId) {
            const pupil = await realmQuery.getOne(pupilSchema.name, id);
            const pupilUpdated = await realmQuery.updateSchemaArray(pupilSchema.name, classroomSchema.name, pupil?.classroomId, data.classroomId, "pupilIds", pupil?._id, { ...data, classroomId: utilsTools.convertRealmObjectId(data.classroomId) });
            if (!pupilUpdated) {
                return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.NOT_UPDATE);
            }
            return handleError.errorConstructor(STATUS_CODE.SUCCESS, pupilUpdated);
        }
        const classroomUpdate = await realmQuery.upadte(pupilSchema.name, id, data);
        if (!classroomUpdate) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.CLASSROOM_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, classroomUpdate);
    } catch (error) {
        console.log("classroom_update_error =>", error);
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.remove = async (id) => {
    try {
        const pupil = await realmQuery.getOne(pupilSchema.name, id);
        if (!pupil) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.PIPUL_NOT_FOUND);
        }
        const classroom = await realmQuery.getOne(classroomSchema.name, pupil.classroomId);
        const data = await realmQuery.deleteAndUpdateArray(pupilSchema.name, classroomSchema.name, 'pupilIds', 'classroomId', id, ['periodIds']);
        if (!data) {
            throw new Error("pupli not deleted or not found");
        }
        if (data === RETURN_STATUS.notEmpty) {
            return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR_DB, null, handleError.specificError.FIELD_NOT_EMPTY);
        }
        const classroomUpdate = await realmQuery.upadte(classroomSchema.name, classroom._id, { totalPupils: classroom.totalPupils - 1 });
        if (!classroomUpdate) {
            throw new Error("classroom not updated");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, data);
    } catch (error) {
        console.log("pupil_remove_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getPupilByField = async (data) => {
    try {
        const field = SCHEMA_FIELD[data.field]
        if (!field) {
            throw new Error("get_pupil_by_field field no found");
        }
        const datas = await realmQuery.getDataByCustomQuery(pupilSchema.name, field, data.value);
        if (!datas) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, datas);
    } catch (error) {
        console.log("getPupilByField_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
  }