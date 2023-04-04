const { default: mongoose } = require("mongoose");
const schoolModel = require("../../models/school.model");
const { DIVISION, DIVISION_VALUE, ACTORS_ROLE, STATUS_CODE } = require("../../services/constant");
const utilsTools = require("../../utils/utils.tools");
const userService = require('../user/user.service');
const { USER_ROLE } = require("../../services/constant");
const handleError = require('../../services/handleError')

module.exports.create = async (payload) => {
    let user;

    const { schoolName, slogan, founderId } = payload;
    if (!schoolName || !slogan || !founderId) {
        return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "nom de établissement, slogan ou un fondateur");
    }

    const checkUser = await userService.getById(founderId);
    const _checkUser = checkUser?.send?.docs

    if (!_checkUser) {

        return checkUser;
    } else {

        const { userName, firstName, lastName, number, email, adress, role } = _checkUser
        if (!userName || !firstName || !lastName || !number || !email || !adress || !role) {
    
            return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "pour le titulaire de l'etablissement, veuillez mettre à jour votre profile");
        }

        user = _checkUser
    }

    let newSchool;

    const session = await mongoose.startSession();
    session.startTransaction()
    try {

        /****create school*******/

        newSchool = await schoolModel.create({
            schoolName,
            slogan,
            founderId,
        });

        /******add user to actor object********/

        newSchool.actors = {
            role: USER_ROLE.founder,
            actif: true,
            userId: founderId,
        };

        const _school = await this.schoolSave(newSchool, null, null)
        if (!_school?.send?.docs) {
            return _school;
        }
        const school = _school?.send?.docs

        /*******push school to user object********/

        const newUserSchool = {
            schoolId: school._id,
            role: USER_ROLE.founder,
        }
        user.schools.push(newUserSchool)
        const u = await user.save()

        if (!u) {

            await this.remove(school._id) // TODO check remove
            return   handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
        }

        await session.commitTransaction()

         return handleError.errorConstructor(STATUS_CODE.SUCCESS, school);

    } catch (error) {
        session.abortTransaction()
        console.log("school_create_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
    finally {
        session.endSession()
    }
}

module.exports.remove = async (id) => {
    try {
        const schoolRemove = await schoolModel.findByIdAndRemove(id);
        if (schoolRemove) {
            return handleError.errorConstructor(STATUS_CODE.SUCCESS, null, "ok");
        }
        else {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement");
        }

    } catch (error) {

        console.log("school_service_remove_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }

}

module.exports.getOne = async (id) => {

    try {
        if (!utilsTools.checkParams(id)) {
            return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
        }

        const school = await schoolModel.findById(id).populate("schoolYears.classroomIds", ["name", "totalPupil"])
            .populate("actors.userId", ["userName", "firstName", "lastName", "number", "email"]);
        if (!school) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement");
        }

        return handleError.errorConstructor(STATUS_CODE.SUCCESS, school);
    } catch (error) {

        console.log("school_service_getOne_error", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);

    }
}

/*******update school service**********/

module.exports.updateSchool = async (id, payload) => {
    const _school = await this.getOne(id)

    if (_school?.send?.msg === "error") {
        return _school
    }

    const school = _school.send.docs

    const { schoolName, slogan, logo, schoolEmail } = payload

    if (slogan) school.slogan = slogan

    if (schoolName) school.schoolName = schoolName

    if (logo) school.logo = logo

    if (schoolEmail) school.schoolEmail = schoolEmail

    const s = await utilsTools.save(school)

    return handleError.errorConstructor(STATUS_CODE.SUCCESS, s);
}

module.exports.updateSchoolYear = async (id, payload) => {

    const school = (await this.getOne(id))?.send?.docs

    if (!school) {

        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement");
    }

    const _theSchoolYear = utilsTools.getObjectValue(payload.schoolYearId, school.schoolYears)
    if (!_theSchoolYear) {

        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "année scolaire");
    }

    if (payload.starYear) {
        _theSchoolYear.starYear = payload.starYear;
        _theSchoolYear.fullYear = utilsTools.parseFullYear(_theSchoolYear.starYear, _theSchoolYear.endYear);
    }

    if (payload.endYear) {
        _theSchoolYear.endYear = payload.endYear;
        _theSchoolYear.fullYear = utilsTools.parseFullYear(_theSchoolYear.starYear, _theSchoolYear.endYear);
    }

    if (payload.division) {
        const _division = DIVISION.find(d => d === payload.division)
        if (!_division) {

            return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "division utiliser: "+DIVISION.toString());
        }
        let _nDivison;
        if (payload.division === "others") {

            if (!payload.nDivision)

                return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "nombre de division est requis pour les division custom");

            _nDivison = payload.nDivision

        } else {

            _nDivison = DIVISION_VALUE[payload.division]
        }

        _theSchoolYear.division = payload.division;
        _theSchoolYear.nDivision = _nDivison;
    }

    return await utilsTools.save(school, _theSchoolYear); 
}

module.exports.updateSchoolYearPeriod = async (id, payload) => {
    const school = (await this.getOne(id))?.send?.docs

    if (!school) {

        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement");
    }

    const { starDate, endDate, status, periodId, schoolYearId } = payload

    const _theSchoolYear = utilsTools.getObjectValue(schoolYearId, school.schoolYears)

    if (!_theSchoolYear) {

        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "année scolaire");
    }

    const thePeriod = utilsTools.getObjectValue(periodId, _theSchoolYear.periods)

    if (!thePeriod) {

        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "période");
    }

    if (starDate) thePeriod.starDate = starDate;

    if (endDate) thePeriod.endDate = endDate;

    if (status !== null) thePeriod.status = status;

    return utilsTools.save(school, thePeriod)
}

module.exports.updateSchoolYearDeadline = async (id, payload) => {
    const school = (await this.getOne(id))?.send?.docs

    if (!school) {
        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement");
    }

    const { starDate, endDate, price, deadlineId, schoolYearId } = payload

    const _theSchoolYear = utilsTools.getObjectValue(schoolYearId, school.schoolYears)

    if (!_theSchoolYear) {

        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "année scolaire");
    }

    const thedeadlines = utilsTools.getObjectValue(deadlineId, _theSchoolYear.deadlines)
    if (!thedeadlines) {

        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "échéance de paiement");
    }

    if (starDate) thedeadlines.starDate = starDate;

    if (endDate) thedeadlines.endDate = endDate;

    if (price) thedeadlines.price = price;

    return utilsTools.save(school, thedeadlines)
}

module.exports.updateSchoolActor = async (id, payload) => {
    const school = (await this.getOne(id))?.send?.docs

    if (!school) {
        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement");
    }

    const { role, actorId, actif, userId } = payload
    const theActor = utilsTools.getObjectValue(actorId, school.actors)

    if (!theActor) {

        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "personnel");
    }

    if (role) {
        const _role = ACTORS_ROLE.find(ar => ar === role)
        if (!_role) {

            return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "role incorect utiliser: "+ACTORS_ROLE.toString());
        }

        theActor.role = role;
    }
    if (actif != null) theActor.actif = actif;
    if (userId) {
        const user = (await userService.getById(userId))
        const _user = user?.send?.docs

        if (!_user) {
            return user
        }
        theActor.userId = userId;
    }

    return utilsTools.save(school, theActor)
}

module.exports.schoolSave = async (doc, sendDoc, session) => {
    const sess = session ?? null
    
    const s = await (await (await doc.save({ sess })).populate("schoolYears.classroomIds", ["name", "totalPupil"])).populate("actors.userId", ["userName", "firstName", "lastName", "number", "email"]);

    if (!s){
      return  handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR); 
    }

    const d = sendDoc ?? s
    return  handleError.errorConstructor(STATUS_CODE.SUCCESS, d); 
}


