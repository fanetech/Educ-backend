const { realmQuery } = require("../../services/realmQuery");
const handleError = require("../../services/handleError");
const { STATUS_CODE, RETURN_STATUS } = require("../../services/constant");
const { getRealm } = require("../../config/realmConfig");
const { pupilSchema } = require("../pupils/models/pupil.model");
const { pupilPeriodSchema } = require("./models/pupilPeriod.model");
const { schoolYearPeriodSchema } = require("../schoolYearPeriod/models/schoolYearPeriodModel");

module.exports.handleAddPupilPeroid = (data, pupil) => {
    let periodCreated;
    const realm = getRealm();
    realm.write(() => {
        periodCreated = realm.create(pupilPeriodSchema.name, data);
        pupil.periodIds.push(periodCreated._id);
    });
    return periodCreated
}

module.exports.create = async (data) => {
    try {
        const { pupilId, schoolYearPeriodId } = data;
        if (!pupilId || !schoolYearPeriodId) {
            return handleError.errorConstructor(STATUS_CODE.NOT_DATA);
        }
        const pupil = await realmQuery.getOne(pupilSchema.name, pupilId);
        if (!pupil) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.PUPIL_NOT_FOUND);
        }
        const schoolYearPeriod = await realmQuery.getOne(schoolYearPeriodSchema.name, schoolYearPeriodId);
        if (!schoolYearPeriod) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_YEAR_NOT_FOUND);
        }
        let periodCreated = this.handleAddPupilPeroid({
            pupilId: pupil._id,
            schoolYearPeriodId: schoolYearPeriod._id,
        }, pupil)
        if (!periodCreated) {
            throw new Error("pupilPeriod_create_error");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, periodCreated);
    } catch (error) {
        console.log("pupilPeriod_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getOne = async (id) => {
    try {
        const period = await realmQuery.getOne(pupilPeriodSchema.name, id);
        if (!period) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.PUPIL_PERIOD_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, period);
    } catch (error) {
        console.log("pupilPeriod_getOne_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getAll = async () => {
    try {
        const periods = await realmQuery.getAll(pupilPeriodSchema.name);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, periods);
    } catch (error) {
        console.log("pupilPeriod_getAll_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

// todo
// module.exports.modify = async (id, data) => {
//     try {
//         if (data.pupilId) {
//             const pupilPeriod = await realmQuery.getOne(pupilPeriodSchema.name, id);
//             const pupilPeriodUpdated = await realmQuery.updateSchemaArray(pupilPeriodSchema.name, pupilSchema.name, pupilPeriod?.pupilId, data.pupilId, "periodIds", pupilPeriod?._id, { ...data, pupilId: utilsTools.convertRealmObjectId(data.classroomId) });
//             if (!pupilPeriodUpdated) {
//                 return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.NOT_UPDATE);
//             }
//             return handleError.errorConstructor(STATUS_CODE.SUCCESS, pupilPeriodUpdated);
//         }
//         const classroomUpdate = await realmQuery.upadte(pupilSchema.name, id, data);
//         if (!classroomUpdate) {
//             return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.CLASSROOM_NOT_FOUND);
//         }
//         return handleError.errorConstructor(STATUS_CODE.SUCCESS, classroomUpdate);
//     } catch (error) {
//         console.log("classroom_update_error =>", error);
//         return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
//     }
// }

module.exports.remove = async (id) => {
    try {
      const period = await realmQuery.deleteAndUpdateArray( pupilPeriodSchema.name, pupilSchema.name, 'periodIds', 'pupilId', id, ['periodIds']);
      if (!period) {
        throw new Error("pupilPeriod not deleted or not found");
      }    
      if(period === RETURN_STATUS.notEmpty){
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR_DB, null, handleError.specificError.FIELD_NOT_EMPTY);
      }
      return handleError.errorConstructor(STATUS_CODE.SUCCESS, period);
    } catch (error) {
      console.log("pupilPeriod_remove_error =>", error)
      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
  }