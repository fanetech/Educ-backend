const userModel = require("../../models/user.model");
const userService = require('./user.service')
const utilsError  = require('../../utils/utils.errors');
const utilsTools  = require('../../utils/utils.tools');
const { USER_ROLE, STATUS_CODE } = require("../../services/constant");
const handleError = require("../../services/handleError")

module.exports.getUserById = async (req, res) => {
  
  const response = await userService.getById(req.params.id, req.body)

  return await utilsError.globalSatuts(res, response)

};

module.exports.getAllUser = (req, res) => {
  userModel
    .find((err, users) => {
      if (!err) {
        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, users));
      } else {
        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));
      }
    })
    .select({ password: false });
};

module.exports.updateUser = async (req, res) => {
  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }
  const id = req?.params?.id;

  const {
    userName,
    firstName,
    lastName,
    schoolRole,
    status,
    number,
    email,
    role,
    adress,
    schoolId,
  } = req.body;
  userModel.findById(id, (err, user) => {

    if (!user) {

      return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, "utilisateur non trouvé"));
    }
    if (
      userName ||
      firstName ||
      lastName ||
      role ||
      adress ||
      number ||
      email
    ) {
      if (userName) user.userName = userName;

      if (firstName) user.firstName = firstName;

      if (lastName) user.lastName = lastName;

      if (role){
        const _role = USER_ROLE[role]

        if (!_role) {

          return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "role incorect utiliser: "+Object.values(USER_ROLE).toString()));
        }

        user.role = role;
      } 
      if (adress) user.adress = adress;

      if (number) user.number = number;

      if (email) user.email = email;
    }
    if (schoolRole || status != null) {

      const theSchool = user.school.find((school) =>
        school._id.equals(schoolId)
      );
      if (!theSchool) {

        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement"));
      }

      if (schoolRole) theSchool.role = schoolRole;

      if (status != null) theSchool.status = status;

    }
    return user.save((err) => {
      
      if (!err) {
        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, user));
      }

      console.log("user_update_error => ", err);

      const errors = utilsError.signUpErrors(err);
        return utilsError.globalSatuts(res, errors);     
    });
  });
};

module.exports.remove = async (req, res) => {
  const id = req.params.id;
  userModel.findByIdAndRemove(id, (err, user) => {
    if (err)
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));
    if (!user)
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "utilisateur"));
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, "ok"));
  });
};
