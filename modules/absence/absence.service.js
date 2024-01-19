const { getRealm } = require("../../config/realmConfig");
const { STATUS_CODE, RETURN_STATUS, SCHEMA_FIELD } = require("../../services/constant");
const handleError = require("../../services/handleError");
const { realmQuery } = require("../../services/realmQuery");
const utilsTools = require("../../utils/utils.tools");
const { classroomSchema } = require("../classroom/models/classroomModel");
const { classroomPeriodSchema } = require("../pupilPeriod/models/classroomPeriod.model");
const { pupilSchema } = require("../pupils/models/pupil.model");

module.exports.handleAddPupilAbsence = (data, pupilPeroid) => {
    let absenceCreated;
    const realm = getRealm();
    realm.write(() => {
        absenceCreated = realm.create(pupilSchema.name, data);
        pupilPeroid.absenceIds.push(absenceCreated._id);
    });
    return absenceCreated
}

module.exports.create = async (data) => {
    try {
        const { date, pupilId, pupilPeriodId } = data;
        if (!date || !pupilId || !pupilPeriodId) {
            return handleError.errorConstructor(STATUS_CODE.NOT_DATA);
        }
        const pupil = await realmQuery.getOne(pupilSchema.name, pupilId);
        if (!pupil) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.PUPIL_NOT_FOUND);
        }
        const pupilPeriod = await realmQuery.getOne(classroomPeriodSchema.name, pupilPeriodId);
        if (!pupilPeriod) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.PUPIL_PERIOD_NOT_FOUND);
        }
        let absenceCreated = this.handleAddPupilAbsence({
            ...data,
            justify: false,
            pupilId: pupil._id,
        }, pupilPeriod)
        if (!absenceCreated) {
            throw new Error("absence_create_error");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, absenceCreated)

    } catch (error) {
        console.log("absence_create_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}