const { getRealm } = require("../../config/realmConfig");
const { STATUS_CODE } = require("../../services/constant");
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
        let _schoolYearId = BSON.ObjectId(schoolYearId);
        const classroom = await realmQuery.getWithQuery(classroomSchema.name, customQuery.GET_ROW_BY_2_ATTRIBUTE('name', name, 'schoolYearId', _schoolYearId));
        if (!classroom) {
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
        let classroomCreated;
        const realm = getRealm();
        realm.write(() => {
            classroomCreated = realm.create(classroomSchema.name, {
                name,
                price,
                schoolYearId: _schoolYearId,
            });
            schoolYear.classroomIds.push(classroomCreated._id);
        });
        if (!classroomCreated) {
            throw new Error("classroom_create_error");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, classroomCreated)

    } catch (error) {
        console.log("classroom_create_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}