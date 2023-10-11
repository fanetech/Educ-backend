

const { getRealm } = require("../../config/realmConfig");
const { STATUS_CODE, SCHEMA_FIELD, RETURN_STATUS } = require("../../services/constant");
const handleError = require("../../services/handleError");
const { realmQuery } = require("../../services/realmQuery");
const { convertRealmObjectId } = require("../../utils/utils.tools");
const { schoolYearSchema } = require("../schoolYear/models/schoolYearModel");
const { schoolYearDeadlineSchema } = require("./models/schoolYearDeadlineModel");
const utilsTools = require("../../utils/utils.tools");
const { BSON } = require('realm');

module.exports.create = async (data) => {
  try {
    const { starDate, endDate, priceInPercent, schoolYearId, nDivision } = data;
    if (!starDate || !endDate || !priceInPercent || !schoolYearId || !nDivision) {
      return handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, "date ou prix");
    }
    const schoolYear = await realmQuery.getOne(schoolYearSchema.name, schoolYearId);
    if (!schoolYear) {
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_YEAR_NOT_FOUND);
    }
    let schoolYearDeadlineCreated;
    const realm = getRealm();
    realm.write(() => {
      schoolYearDeadlineCreated = realm.create(schoolYearDeadlineSchema.name, {
        name: `Echéance ${nDivision}`,
        starDate: utilsTools.parseDate(starDate),
        endDate: utilsTools.parseDate(endDate),
        priceInPercent,
        schoolYearId: convertRealmObjectId(schoolYearId),
        nDivision
      });
      schoolYear.deadlineIds.push(schoolYearDeadlineCreated._id);
    });
    if (!schoolYearDeadlineCreated) {
      throw new Error("schoolYearDeadline_create_error");
    }
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, schoolYearDeadlineCreated)

  } catch (error) {
    console.log("schoolYearDeadline_create_error =>", error)
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.getOne = async (id) => {
  try {
    const deadline = await realmQuery.getOne(schoolYearDeadlineSchema.name, id);
    if (!deadline) {
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_YEAR_DEADLINE_NOT_FOUND);
    }
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, deadline);
  } catch (error) {
    console.log("schoolYearDeadline_getOne_error =>", error)
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.getAll = async () => {
  try {
    const periods = await realmQuery.getAll(schoolYearDeadlineSchema.name);
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, periods);
  } catch (error) {
    console.log("schoolYearDeadline_getAll_error =>", error)
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.modify = async (id, data) => {
  try {
    if (data.nDivision) {
      data.name = `Echéance ${data.nDivision}`;
    }
    if (data.schoolYearId) {
      delete data.schoolYearId;
    }
    const deadline = await realmQuery.upadte(schoolYearDeadlineSchema.name, id, data);
    if (!deadline) {
      throw new Error("schoolYearDeadline not updated or not found");
    }
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, deadline);
  } catch (error) {
    console.log("schoolYearDeadline_update_error =>", error)
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.remove = async (id) => {
  try {
    const deadline = await realmQuery.deleteAndUpdateArray(schoolYearDeadlineSchema.name, schoolYearSchema.name, 'deadlineIds', 'schoolYearId', id);
    if (!deadline) {
      throw new Error("schoolYearDeadline not deleted or not found");
    }
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, deadline);
  } catch (error) {
    console.log("schoolYearDeadline_remove_error =>", error)
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.getschoolYearDeadlineByField = async (data) => {
  try {
      const field = SCHEMA_FIELD[data.field]
      if (!field) {
          throw new Error("get_actor_by_field field no found");
      }
      const period = await realmQuery.getDataByCustomQuery(schoolYearDeadlineSchema.name, field, BSON.ObjectId(data.value));
      if (!period) {
          return handleError.errorConstructor(STATUS_CODE.NOT_FOUND);
      }
      return handleError.errorConstructor(STATUS_CODE.SUCCESS, period);
  } catch (error) {
      console.log("getschoolYearPeriodByField_error =>", error)
      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}