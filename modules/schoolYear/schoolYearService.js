const { getRealm } = require("../../config/realmConfig");
const { STATUS_CODE, DIVISION, DIVISION_VALUE } = require("../../services/constant");
const handleError = require("../../services/handleError");
const { realmQuery } = require("../../services/realmQuery");
const utilsTools = require("../../utils/utils.tools");
const { schoolSchema } = require("../school/models/schoolModel");
const { schoolYearSchema } = require("./models/schoolYearModel");

module.exports.create = async (data) => {
    try {
        const { starYear, endYear, division, nDivision, schoolId } = data;      
        if (!starYear || !endYear || !division) {
          return handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, "date ou division");
        }      
        const _division = DIVISION.find(d => d === division);      
        if (!_division) {
          return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "utiliser: "+DIVISION.toString());
        }
        const school = await realmQuery.getOne(schoolSchema.name, schoolId);
        if (!school) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_NOT_FOUND);
        }   
        const fullYear = `${utilsTools.parseDate(starYear).getFullYear()}-${utilsTools.parseDate(
          endYear
        ).getFullYear()}`;      
        let _nDivison;
        if (division === "others") {
          if (!nDivision)
            return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "nombre de division");
          _nDivison = nDivision
        } else {
          _nDivison = DIVISION_VALUE[division]
        }
        const realm = getRealm();
        let schoolYearCreated;
        realm.write(() => {
            schoolYearCreated = realm.create(schoolYearSchema.name, {
            fullYear,
            starYear: utilsTools.parseDate(starYear),
            endYear: utilsTools.parseDate(endYear),
            division: _division,
            nDivision: _nDivison,
          });
          school.schoolYearIds.push(schoolYearCreated._id);
        });
        if(!schoolYearCreated){
           throw new Error("schoolYear_create_error");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, schoolYearCreated)

    } catch (error) {
        console.log("schoolYear_create_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}