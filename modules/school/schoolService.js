const { STATUS_CODE } = require('../../services/constant');
const handleError = require('../../services/handleError');
const { realmQuery } = require('../../services/realmQuery');
const { userSchema } = require('../user/model/userModel');
const { schoolSchema } = require('./models/schoolModel');

module.exports.create = async (data) => {
    let user;

    const { schoolName, slogan, founderId } = data;
    if (!schoolName || !slogan || !founderId) {
        return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, handleError.specificError.SCHOOL_CREATE_MISSING_DATA);
    }

    const checkUser = await realmQuery.getOne(userSchema.name, founderId);

    console.log("checkUser =>", checkUser)

    // if (!checkUser) {

    //     return checkUser;
    // } else {

    //     const { userName, firstName, lastName, number, email, adress, role } = _checkUser
    //     if (!userName || !firstName || !lastName || !number || !email || !adress || !role) {
    
    //         return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "pour le titulaire de l'etablissement, veuillez mettre à jour votre profile");
    //     }

    //     user = _checkUser
    // }

    // let newSchool;

    // const session = await mongoose.startSession();
    // session.startTransaction()
    // try {

    //     /****create school*******/

    //     newSchool = await schoolModel.create({
    //         schoolName,
    //         slogan,
    //         founderId,
    //     });

    //     /******add user to actor object********/

    //     newSchool.actors = {
    //         role: USER_ROLE.founder,
    //         actif: true,
    //         userId: founderId,
    //     };

    //     const _school = await this.schoolSave(newSchool, null, null)
    //     if (!_school?.send?.docs) {
    //         return _school;
    //     }
    //     const school = _school?.send?.docs

    //     /*******push school to user object********/

    //     const newUserSchool = {
    //         schoolId: school._id,
    //         role: USER_ROLE.founder,
    //     }
    //     user.schools.push(newUserSchool)
    //     const u = await user.save()

    //     if (!u) {

    //         await this.remove(school._id) // TODO check remove
    //         return   handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    //     }

    //     await session.commitTransaction()

    //      return handleError.errorConstructor(STATUS_CODE.SUCCESS, school);

    // } catch (error) {
    //     session.abortTransaction()
    //     console.log("school_create_error =>", error)
    //     return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    // }
    // finally {
    //     session.endSession()
    // }
}