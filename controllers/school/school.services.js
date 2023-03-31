const { default: mongoose } = require("mongoose");
const schoolModel = require("../../models/school.model");
const { DIVISION, DIVISION_VALUE, ACTORS_ROLE } = require("../../services/constant");
const utilsTools = require("../../utils/utils.tools");
const userService = require('../user/user.service');
const { USER_ROLE } = require("../../services/constant");
const userModel = require("../../models/user.model");

module.exports.create = async (payload) => {
    let user;

    const { schoolName, slogan, founderId } = payload;
    if (!schoolName || !slogan || !founderId) {
        return { send: { msg: "error", err: "data no complete" }, status: 400 };
    }

    const checkUser = await userService.getById(founderId);
    const _checkUser = checkUser?.send?.docs
    if (!_checkUser) {
        return checkUser;
    } else {
        const { userName, firstName, lastName, number, email, adress, role } = _checkUser
        if (!userName || !firstName || !lastName || !number || !email || !adress || !role) {
            return { send: { msg: "error", err: "user {userName, firstName, lastName, number, email,adress } is require" }, status: 400 };
        }
        user = _checkUser
    }

    let newSchool;

    const session = await mongoose.startSession();
    session.startTransaction()
    try {

        newSchool = await schoolModel.create({
            schoolName,
            slogan,
            founderId,
        });

        newSchool.actors = {
            role: USER_ROLE.founder,
            actif: true,
            userId: founderId,
        };

        // const _school = await newSchool.save({session})
        const _school = await this.schoolSave(newSchool, null, null)
        if (!_school?.send?.docs) {
            return _school;
        }
        const school = _school?.send?.docs

        const newUserSchool = {
            schoolId: school._id,
            role: USER_ROLE.founder,
        }
        user.schools.push(newUserSchool)
        const u = await user.save()
        if (!u) {
            await this.remove(school._id) // TODO check remove
            return { send: { msg: "error", err: "Internal error" }, status: 500 };
        }

        await session.commitTransaction()

        return { send: { msg: "success", docs: school }, status: 200 };

    } catch (error) {
        session.abortTransaction()
        console.log("school_create_error =>", error)
        return { send: { msg: "error", err: "Internal error" }, status: 500 };
    }
    finally {
        session.endSession()
    }
}

module.exports.remove = async (id) => {
    await schoolModel.findByIdAndRemove(id) // TODO
    if (!err) {
        return { send: { msg: "success", docs: "ok" }, status: 500 };
    }
    else {
        return { send: { msg: "error", err: "Internal error" }, status: 500 };
    }
}

module.exports.getOne = async (id) => {

    try {
        if (!utilsTools.checkParams(id)) {
            return { send: { msg: "error", err: "internal error" }, status: 500 };
        }

        const school = await schoolModel.findById(id).populate("schoolYears.classroomIds", ["name", "totalPupil"])
            .populate("actors.userId", ["userName", "firstName", "lastName", "number", "email"]);
        if (!school) {
            return { send: { msg: "error", err: "no found" }, status: 404 };
        }

        return { send: { msg: "success", docs: school }, status: 200 };
    } catch (error) {
        console.log("school_service_getOne_error", error)
        return { send: { msg: "error", err: "intetnal error" }, status: 500 };

    }
}

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

    return await utilsTools.save(school)
}

module.exports.updateSchoolYear = async (id, payload) => {

    const school = (await this.getOne(id))?.send?.docs

    if (!school) {
        return { send: { msg: "error", err: "School no found" }, status: 404 };
    }

    const _theSchoolYear = utilsTools.getObjectValue(payload.schoolYearId, school.schoolYears)
    if (!_theSchoolYear) {
        return { send: { msg: "error", err: "schoolYear no found" }, status: 404 };
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
            return { send: { msg: "error", err: "division incorect. use this: " + DIVISION }, status: 400 };
        }
        let _nDivison;
        if (payload.division === "others") {
            if (!payload.nDivision)
                return { send: { msg: "error", err: "nDivision is required for others" }, status: 400 };
            _nDivison = payload.nDivision
        } else {
            _nDivison = DIVISION_VALUE[payload.division]
        }
        _theSchoolYear.division = payload.division;
        _theSchoolYear.nDivision = _nDivison;
    }

    return utilsTools.save(school, _theSchoolYear)
}

module.exports.updateSchoolYearPeriod = async (id, payload) => {
    const school = (await this.getOne(id))?.send?.docs

    if (!school) {
        return { send: { msg: "error", err: "School no found" }, status: 404 };
    }

    const { starDate, endDate, status, periodId, schoolYearId } = payload

    const _theSchoolYear = utilsTools.getObjectValue(schoolYearId, school.schoolYears)
    if (!_theSchoolYear) {
        return { send: { msg: "error", err: "schoolYear no found" }, status: 404 };
    }

    const thePeriod = utilsTools.getObjectValue(periodId, _theSchoolYear.periods)

    if (!thePeriod) {
        return { send: { msg: "error", err: "period no found" }, status: 404 };
    }

    if (starDate) thePeriod.starDate = starDate;

    if (endDate) thePeriod.endDate = endDate;

    if (status !== null) thePeriod.status = status;

    return utilsTools.save(school, thePeriod)
}

module.exports.updateSchoolYearDeadline = async (id, payload) => {
    const school = (await this.getOne(id))?.send?.docs

    if (!school) {
        return { send: { msg: "error", err: "School no found" }, status: 404 };
    }

    const { starDate, endDate, price, deadlineId, schoolYearId } = payload

    const _theSchoolYear = utilsTools.getObjectValue(schoolYearId, school.schoolYears)
    if (!_theSchoolYear) {
        return { send: { msg: "error", err: "schoolYear no found" }, status: 404 };
    }

    const thedeadlines = utilsTools.getObjectValue(deadlineId, _theSchoolYear.deadlines)
    if (!thedeadlines) {
        return { send: { msg: "error", err: "daedline no found" }, status: 404 };
    }

    if (starDate) thedeadlines.starDate = starDate;

    if (endDate) thedeadlines.endDate = endDate;

    if (price) thedeadlines.price = price;

    return utilsTools.save(school, thedeadlines)
}

module.exports.updateSchoolActor = async (id, payload) => {
    const school = (await this.getOne(id))?.send?.docs

    if (!school) {
        return { send: { msg: "error", err: "School no found" }, status: 404 };
    }

    const { role, actorId, actif, userId } = payload
    const theActor = utilsTools.getObjectValue(actorId, school.actors)

    if (!theActor) {
        return { send: { msg: "error", err: "actor no found" }, status: 404 };
    }

    if (role) {
        const _role = ACTORS_ROLE.find(ar => ar === role)
        if (!_role) {
            return { send: { msg: "error", err: "role incorect. use this: " + ACTORS_ROLE }, status: 400 };
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
    if (!s)
        return { send: { msg: "error", err: "Internal error" }, status: 500 };

    return { send: { msg: "success", docs: sendDoc ?? s }, status: 200 };
}


