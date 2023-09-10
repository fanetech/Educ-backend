const userModel = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors, globalSatuts } = require("../../utils/utils.errors");
const { getSchoolOfUser } = require("../school/school.controller");
const bcrypt = require("bcrypt");
const { USER_ROLE, STATUS_CODE } = require("../../services/constant");
const handleError = require("../../services/handleError")
const utilsTools = require("../../utils/utils.tools");
const { realmQuery } = require("../../services/realmQuery");
const { userSchema } = require("../../modules/user/model/userModel");
const { SYNC_STORE_ID } = require("../../atlasAppService/config");

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.login = async (req, res) => {

  const reqAnalityc = utilsTools.checkRequest(req)

  if (reqAnalityc !== 1) {

    return globalSatuts(res, reqAnalityc)
  }

  const { password, method } = req.body;
  if (!password || !method)
    return globalSatuts(res, handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, "identifiants"));

  try {
    const user = await userModel.findOne({
      $or: [
        {
          email: method,
        },
        {
          number: method,
        },
      ],
    })

    if (user) {
      const auth = await bcrypt.compare(password, user.password);

      if (!auth) {
        return globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "identifiants"));
      }
    } else {
      return globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "identifiants"));
    }

    const token = createToken(user._id);
    const d = { user, token }
    return globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, d));

  } catch (err) {

    console.log(err);
    return globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));
  }
};

module.exports.register = async (req, res) => {

  const reqAnalityc = utilsTools.checkRequest(req)

  if (reqAnalityc !== 1) {

    return globalSatuts(res, reqAnalityc)
  }

  const { number, email, password, role } = req.body;
  if ((!number || !email) && !password && !role) {
    return globalSatuts(res, handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, "identifiants"));
  }

  if (password.length < 8) {
    return globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "mot de passe court"));
  }

  const _role = USER_ROLE[role]
  if (!_role) {
    return globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "role incorect. utiliser " + Object.values(USER_ROLE).toString()));
  }

  //crypt password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const user = await realmQuery.add(userSchema.name, {
      number,
      email,
      password: hashPassword,
      role,
      storeId: SYNC_STORE_ID
    });
    console.log
    return globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, user));
  } catch (err) {
    // const errors = signUpErrors(err);
    // return globalSatuts(res, errors)
    console.log(err);
  }
};
