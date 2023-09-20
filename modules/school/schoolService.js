const { getRealm } = require('../../config/realmConfig');
const { STATUS_CODE, SERVER_STATUS } = require('../../services/constant');
const handleError = require('../../services/handleError');
const { realmQuery } = require('../../services/realmQuery');
const { userSchema } = require('../user/model/userModel');
const { schoolActorSchema } = require('../schoolActor/models/schoolActorModel');
const { schoolSchema } = require('./models/schoolModel');
const { userSchoolSchema } = require('../userSchool/models/userSchoolModel');

module.exports.create = async (data) => {
    try {
        const { schoolName, slogan, founderId } = data;
        if (!schoolName || !slogan || !founderId) {
            return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, handleError.specificError.SCHOOL_CREATE_MISSING_DATA);
        }

        // check user exist
        const user = await realmQuery.getOne(userSchema.name, founderId);
        if (!user || user.status === SERVER_STATUS.SERVICE_UNAVAILABLE) {
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
                founder: founderId,
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
        console.log("schoolCreated =>", schoolCreated)

        if (!schoolCreated || !actorCreated || !userSchoolCreated) {
            return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
        }

        return handleError.errorConstructor(STATUS_CODE.SUCCESS, schoolCreated);

    } catch (error) {
        console.log("school_create_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.addActor = async (data) => {
    try {
        const { schoolId, userId, role } = data;
        const user = await realmQuery.getOne(schoolSchema.name, userId);
        if (!user || user.status === SERVER_STATUS.SERVICE_UNAVAILABLE) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND);
        }
        const actor = realmQuery.add(schoolActorSchema.name, {
            schoolId,
            userId,
            role,
            actif: true,
        });
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, null, actor);
    } catch (error) {
        console.log("school_addActor_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}