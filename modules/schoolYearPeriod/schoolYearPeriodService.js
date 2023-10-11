const { schoolYearPeriodSchema } = require("./models/schoolYearPeriodModel");
const handleError = require("../../services/handleError");
const { STATUS_CODE, SCHEMA_FIELD } = require("../../services/constant");
const { realmQuery } = require("../../services/realmQuery");
const { schoolYearSchema } = require("../schoolYear/models/schoolYearModel");
const utilsTools = require("../../utils/utils.tools");
const { getRealm } = require("../../config/realmConfig");
const { BSON } = require('realm');

module.exports.create = async (data) => {
    try {
        const { starDate, endDate, status, nDivision, schoolYearId } = data;
        if (!starDate || !endDate || !schoolYearId || status == null) {
            return handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, "date");
        }
        const schoolYear = await realmQuery.getOne(schoolYearSchema.name, schoolYearId);
        if (!schoolYear) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_YEAR_NOT_FOUND);
        }
        if (nDivision > schoolYear.nDivision) {
            return handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, handleError.specificError.SCHOOL_YEAR_PERIOD_NDIVISION_ERROR);
        }
        let periodCreated;
        const realm = getRealm();
        realm.write(() => {
            periodCreated = realm.create(schoolYearPeriodSchema.name, {
                name: `${schoolYear.division} ${nDivision}`,
                starDate: utilsTools.parseDate(starDate),
                endDate: utilsTools.parseDate(endDate),
                schoolYearId: schoolYear._id,
                status: status,
                nDivision: nDivision,
            });
            schoolYear.periodIds.push(periodCreated._id);
        });
        if (!periodCreated) {
            throw new Error("schoolYearPeriod_create_error");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, periodCreated)
    } catch (error) {
        console.log("schoolYearPeriod_create_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getOne = async (id) => {
    try {
        const period = await realmQuery.getOne(schoolYearPeriodSchema.name, id);
        if (!period) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_YEAR_PERIOD_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, period);
    } catch (error) {
        console.log("schoolYearPeriod_getOne_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getAll = async () => {
    try {
        const periods = await realmQuery.getAll(schoolYearPeriodSchema.name);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, periods);
    } catch (error) {
        console.log("schoolYearPeriod_getAll_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.modify = async (id, data) => {
    try {
        if (data.nDivision) {
            const schoolYear = await realmQuery.getOne(schoolYearSchema.name, data.schoolYearId);
            if (!schoolYear) {
                return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_YEAR_NOT_FOUND);
            }
            if (data.nDivision > schoolYear.nDivision) {
                return handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, handleError.specificError.SCHOOL_YEAR_PERIOD_NDIVISION_ERROR);
            }
            if (!data.schoolYearId) {
                return handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, handleError.specificError.DATA_REQUIRED);
            }
            data.name = `${schoolYear.division} ${data.nDivision}`;
            delete data.schoolYearId;
        }
        const period = await realmQuery.upadte(schoolYearPeriodSchema.name, id, data);
        if (!period) {
            throw new Error("schoolYearPeriod not updated or not found");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, period);
    } catch (error) {
        console.log("schoolYearPeriod_update_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.remove = async (id) => {
    try {
        const period = await realmQuery.deleteAndUpdateArray(schoolYearPeriodSchema.name, schoolYearSchema.name, 'periodIds', 'schoolYearId', id);
        if (!period) {
            throw new Error("schoolYearPeriod not deleted or not found");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, period);
    } catch (error) {
        console.log("schoolYearPeriod_remove_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getschoolYearPeriodByField = async (data) => {
    try {
        const field = SCHEMA_FIELD[data.field]
        if (!field) {
            throw new Error("get_actor_by_field field no found");
        }
        const period = await realmQuery.getDataByCustomQuery(schoolYearPeriodSchema.name, field, BSON.ObjectId(data.value));
        if (!period) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, period);
    } catch (error) {
        console.log("getschoolYearPeriodByField_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}