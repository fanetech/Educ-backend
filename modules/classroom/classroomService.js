const { getRealm } = require("../../config/realmConfig");
const { STATUS_CODE, RETURN_STATUS } = require("../../services/constant");
const { customQuery } = require("../../services/customQuery");
const handleError = require("../../services/handleError");
const { realmQuery } = require("../../services/realmQuery");
const utilsTools = require("../../utils/utils.tools");
const { schoolYearSchema } = require("../schoolYear/models/schoolYearModel");
const { classroomSchema } = require("./models/classroomModel");
const { BSON } = require('realm');

module.exports.create = async (data) => {
    try {
        const { name, price, schoolYearId } = data;
        if (!name || !price || !schoolYearId) {
            return handleError.errorConstructor(STATUS_CODE.NOT_DATA);
        }
        const classroom = await realmQuery.getWithQueryAndId(classroomSchema.name, customQuery.GET_ROW_BY_STRING_ATTRIBUTE_AND_ID('name', name, 'schoolYearId'), schoolYearId);
        if (classroom.length > 0) {
            return handleError.errorConstructor(
                STATUS_CODE.DATA_EXIST,
                null,
                "nom de l'établissement"
            );
        }
        const schoolYear = await realmQuery.getOne(schoolYearSchema.name, schoolYearId);
        if (!schoolYear) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_YEAR_NOT_FOUND);
        }
        let classroomCreated = this.handleAddClassroom({
            name,
            price,
            schoolYearId: schoolYear._id,
        }, schoolYear)
        if (!classroomCreated) {
            throw new Error("classroom_create_error");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, classroomCreated)

    } catch (error) {
        console.log("classroom_create_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.handleAddClassroom = (data, schoolYear) => {
    let classroomCreated;
    const realm = getRealm();
    realm.write(() => {
        classroomCreated = realm.create(classroomSchema.name, data);
        schoolYear.classroomIds.push(classroomCreated._id);
    });
    return classroomCreated
}

module.exports.getOne = async (id) => {
    try {
        const classroom = await realmQuery.getOne(classroomSchema.name, id);
        if (!classroom) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.CLASSROOM_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, classroom);
    } catch (error) {
        console.log("classroom_getOne_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getAll = async () => {
    try {
        const classrooms = await realmQuery.getAll(classroomSchema.name);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, classrooms);
    } catch (error) {
        console.log("classroom_getAll_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.modify = async (id, data) => {
    try {
        if (data.schoolYearId) {
            const classroom = await realmQuery.getOne(classroomSchema.name, id)
            const schoolYear = await realmQuery.updateSchemaArray(schoolYearSchema.name, classroom.schoolYearId, data.schoolYearId, "classroomIds", classroom._id  );
            if (!schoolYear) {
                return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_YEAR_NOT_FOUND);
            }
            data.schoolYearId = utilsTools.convertRealmObjectId(data.schoolYearId);
        }
        if (data.name) {
            const classroom = await realmQuery.getWithQueryAndId(classroomSchema.name, customQuery.GET_ROW_BY_STRING_ATTRIBUTE_AND_ID('name', data.name, 'schoolYearId'), data.schoolYearId);
            if (classroom.length > 0) {
                return handleError.errorConstructor(
                    STATUS_CODE.DATA_EXIST,
                    null,
                    "nom de l'établissement"
                );
            }
        }
        const classroomUpdate = await realmQuery.upadte(classroomSchema.name, id, data);
        if (!classroomUpdate) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.CLASSROOM_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, classroomUpdate);
    } catch (error) {
        console.log("classroom_update_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.remove = async (id) => {
    try {
        const classroom = await realmQuery.deleteAndUpdateArray(classroomSchema.name, schoolYearSchema.name, 'classroomIds', 'schoolYearId', id, ['teacherIds', 'deadlineIds', 'fileIds', 'absenceIds', 'matterIds', 'pupilIds']);
        if (!classroom) {
            throw new Error("schoolYear not deleted or not found");
        }
        if (classroom === RETURN_STATUS.notEmpty) {
            return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR_DB, null, handleError.specificError.FIELD_NOT_EMPTY);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, classroom);
    } catch (error) {
        console.log("schoolYear_remove_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}