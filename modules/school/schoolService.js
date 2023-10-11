const { getRealm } = require('../../config/realmConfig');
const { STATUS_CODE, SERVER_STATUS, RETURN_STATUS } = require('../../services/constant');
const handleError = require('../../services/handleError');
const { realmQuery } = require('../../services/realmQuery');
const { userSchema } = require('../user/model/userModel');
const { schoolActorSchema } = require('../schoolActor/models/schoolActorModel');
const { schoolSchema } = require('./models/schoolModel');
const { userSchoolSchema } = require('../userSchool/models/userSchoolModel');
const { BSON } = require('realm');
const { schoolYearSchema } = require('../schoolYear/models/schoolYearModel');

module.exports.create = async (data) => {
    try {
        const { schoolName, slogan, founderId } = data;
        if (!schoolName || !slogan || !founderId) {
            return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, handleError.specificError.SCHOOL_CREATE_MISSING_DATA);
        }

        // check user exist
        const user = await realmQuery.getOne(userSchema.name, founderId);
        if (!user) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.GET_USER_BY_ID_NOT_FOUND);
        }

        // check user field requirement for school creation
        const { userName, firstName, lastName, number, email, adress, role } = user
        if (!userName || !firstName || !lastName || !number || !email || !adress || !role) {
            return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, handleError.specificError.USER_REQUIREMENT_EXCEPTION_SCHOOL_CREATE);
        }
        const realm = getRealm();
        let schoolCreated, actorCreated, userSchoolCreated;
        realm.write(() => {
            schoolCreated = realm.create(schoolSchema.name, {
                schoolName,
                slogan,
                founderId: new BSON.ObjectId(founderId),
            });
            actorCreated = realm.create(schoolActorSchema.name, {
                schoolId: schoolCreated._id,
                userId: user._id,
                role,
                actif: true,
            });
            schoolCreated.actors.push(actorCreated._id);
            userSchoolCreated = realm.create(userSchoolSchema.name, {
                schoolId: schoolCreated._id,
                userId: user._id,
                role,
                status: true,
            });
            user.schools.push(userSchoolCreated._id);
        });
        if (!schoolCreated || !actorCreated || !userSchoolCreated) {
            return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, schoolCreated);
    } catch (error) {
        console.log("school_create_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.addActor = async (schoolId, data) => {
    try {
        const { userId, role } = data;
        const user = await realmQuery.getOne(userSchema.name, userId);
        if (!user) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND);
        }
        const school = await realmQuery.getOne(schoolSchema.name, schoolId);
        if (!school) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND);
        }
        const realm = getRealm();
        let schoolCreated, actorCreated;
        realm.write(() => {
            actorCreated = realm.create(schoolActorSchema.name, {
                schoolId: BSON.ObjectId(schoolId),
                userId: BSON.ObjectId(userId),
                role,
                actif: true,
            });
            school.actorIds.push(actorCreated._id);
        });
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, actorCreated);
    } catch (error) {
        console.log("school_addActor_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getOne = async (id) => {
    try {
        const school = await realmQuery.getOne(schoolSchema.name, id);
        if (!school) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, school);
    } catch (error) {
        console.log("school_getOne_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getAll = async () => {
    try {
        const schools = await realmQuery.getAll(schoolSchema.name);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, schools);
    } catch (error) {
        console.log("school_getAll_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.modify = async (id, data) => {
    try {
        if (data.founderId) {
            const user = await realmQuery.getOne(userSchema.name, data.founderId);
            if (!user) {
                return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.GET_USER_BY_ID_NOT_FOUND);
            }
            data.founderId = new BSON.ObjectId(data.founderId);
        }
        const school = await realmQuery.upadte(schoolSchema.name, id, data);
        if (!school) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.SCHOOL_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, school);
    } catch (error) {
        console.log("school_update_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.remove = async (id) => {
    try {
        const school = await realmQuery.deleteAndUpdateArray(schoolSchema.name, userSchema.name, 'schools', 'founderId', id, ['actorIds', 'schoolYearIds', 'libraryIds', 'settingIds']);
        if (!school) {
            throw new Error("school not deleted or not found");
        }
        if(school === RETURN_STATUS.notEmpty){
            return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR_DB, null, handleError.specificError.FIELD_NOT_EMPTY);
          }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, school);
    } catch (error) {
        console.log("school_remove_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getSchoolActors = async (id) => {
    try {
        const school = await realmQuery.getOne(schoolSchema.name, id);
        const schoolActors = await realmQuery.getDataByCustomQuery(schoolActorSchema.name, "_id", school.actors);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, schoolActors);
    } catch (error) {
        console.log("school_getSchoolOfUser_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
};

module.exports.getSchoolYears = async (id) => {
    try {
        const school = await realmQuery.getOne(schoolSchema.name, id);
        const schoolYears = await realmQuery.getDataByCustomQuery(schoolYearSchema.name, "_id", school.schoolYearIds);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, schoolYears);
    } catch (error) {
        console.log("school_getSchoolYears_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
};