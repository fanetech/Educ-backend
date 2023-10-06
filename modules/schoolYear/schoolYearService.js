const { getRealm } = require("../../config/realmConfig");
const { STATUS_CODE, DIVISION, DIVISION_VALUE, SCHEMA_FIELD } = require("../../services/constant");
const handleError = require("../../services/handleError");
const { realmQuery } = require("../../services/realmQuery");
const utilsTools = require("../../utils/utils.tools");
const { schoolSchema } = require("../school/models/schoolModel");
const { schoolYearPeriodSchema } = require("../schoolYearPeriod/models/schoolYearPeriodModel");
const { schoolYearSchema } = require("./models/schoolYearModel");
const { BSON } = require('realm');

module.exports.create = async (data) => {
  try {
    const { starYear, endYear, division, nDivision, schoolId } = data;
    if (!starYear || !endYear || !division) {
      return handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, "date ou division");
    }
    const _division = DIVISION.find(d => d === division);
    if (!_division) {
      return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "utiliser: " + DIVISION.toString());
    }
    const school = await realmQuery.getOne(schoolSchema.name, schoolId);
    if (!school) {
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_NOT_FOUND);
    }
    const fullYear = utilsTools.parseFullYear(data.starYear, data.endYear);
    let _nDivison;
    if (division === "others") {
      if (!nDivision)
        return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "nombre de division");
      _nDivison = nDivision
    } else {
      _nDivison = DIVISION_VALUE[division]
    }
    let schoolYearCreated;
    const realm = getRealm();
    realm.write(() => {
      schoolYearCreated = realm.create(schoolYearSchema.name, {
        fullYear,
        starYear: utilsTools.parseDate(starYear),
        endYear: utilsTools.parseDate(endYear),
        division: _division,
        nDivision: _nDivison,
        schoolId: school._id
      });
      school.schoolYearIds.push(schoolYearCreated._id);
    });
    if (!schoolYearCreated) {
      throw new Error("schoolYear_create_error");
    }
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, schoolYearCreated)

  } catch (error) {
    console.log("schoolYear_create_error =>", error)
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.getOne = async (id) => {
  try {
    const schoolYear = await realmQuery.getOne(schoolYearSchema.name, id);
    if (!schoolYear) {
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_YEAR_NOT_FOUND);
    }
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, schoolYear);
  } catch (error) {
    console.log("schoolYear_getOne_error =>", error)
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.getAll = async () => {
  try {
    const schoolsYears = await realmQuery.getAll(schoolYearSchema.name);
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, schoolsYears);
  } catch (error) {
    console.log("schoolYear_getAll_error =>", error)
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.modify = async (id, data) => {
  try {
    if (data.schoolId) {
      const school = await realmQuery.getOne(schoolSchema.name, data.schoolId);
      if (!school) {
        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_NOT_FOUND);
      }
      data.schoolId = BSON.ObjectId(data.schoolId);
    }
    if (data.starYear || data.endYear) {
      data.fullYear = utilsTools.parseFullYear(data.starYear, data.endYear);
    }
    if (data.division) {
      const _division = DIVISION.find(d => d === data.division)
      if (!_division) {
        return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "division utiliser: " + DIVISION.toString());
      }
      let _nDivison;
      if (data.division === "others") {
        if (!data.nDivision)
          return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "nombre de division est requis pour les division custom");
        _nDivison = data.nDivision
      } else {
        _nDivison = DIVISION_VALUE[data.division]
      }
      data.division = data.division;
      data.nDivision = _nDivison;
    }
    const schoolYear = await realmQuery.upadte(schoolYearSchema.name, id, data);
    if (!schoolYear) {
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_YEAR_NOT_FOUND);
    }
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, schoolYear);
  } catch (error) {
    console.log("schoolYear_update_error =>", error)
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.remove = async (id) => {
  try {
    const schoolYear = await realmQuery.delete(schoolYearSchema.name, id);
    if (!schoolYear) {
      throw new Error("schoolYear not deleted or not found");
    }
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, schoolYear);
  } catch (error) {
    console.log("schoolYear_remove_error =>", error)
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.getschoolYearByField = async (data) => {
  try {
      const field = SCHEMA_FIELD[data.field]
      if (!field) {
          throw new Error("get_actor_by_field field no found");
      }
      const schoolYears = await realmQuery.getDataByCustomQuery(schoolYearSchema.name, field, BSON.ObjectId(data.value));
      if (!schoolYears) {
          return handleError.errorConstructor(STATUS_CODE.NOT_FOUND);
      }
      return handleError.errorConstructor(STATUS_CODE.SUCCESS, schoolYears);
  } catch (error) {
      console.log("getschoolYearByField_error =>", error)
      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.getSchoolYearPeroids = async (id) => {
  try {
      const schoolYear = await realmQuery.getOne(schoolYearSchema.name, id);
      const schoolYears = await realmQuery.getDataByCustomQuery(schoolYearPeriodSchema.name, "_id", schoolYear.periodIds);
      return handleError.errorConstructor(STATUS_CODE.SUCCESS, schoolYears);
  } catch (error) {
      console.log("getSchoolYearPeroids_error =>", error)
      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
};
