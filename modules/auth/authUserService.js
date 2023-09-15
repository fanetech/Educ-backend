const { STATUS_CODE, USER_ROLE } = require("../../services/constant");
const { customQuery } = require("../../services/customQuery");
const handleError = require("../../services/handleError");
const { realmQuery } = require("../../services/realmQuery");
const { userSchema } = require("../user/model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60 * 1000;

exports.register = async (data) => {
    try {
        const { number, email, password, role } = data;
        if ((!number || !email) && !password && !role) {
          return handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, handleError.specificError.ID_DATA_REQUIRED);
        }
    
        if (password.length < 8) {
          return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, handleError.specificError.PASSWORD_ERROR);
        }
    
        const _role = USER_ROLE[role]
        if (!_role) {
          return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, handleError.specificError.INCORRECT_ROLE(USER_ROLE));
        }
    
        const userExist = await realmQuery.getWithQuery(userSchema.name, customQuery.GET_USER_BY_EMAIL_AND_NUMBER(email, number));
        
        if (userExist.length > 0) {
          return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, handleError.specificError.REGISTER_EMAIL_OR_NUMBER_NO_EXIST);
        }
    
        //crypt password
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
    
        const createdRes = await realmQuery.add(userSchema.name, {
          number,
          email,
          password: hashPassword,
          role,
        });
        return createdRes;
      } catch (error) {
        console.log("register error => ", error);
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
      }
}

exports.login = async (data) => {
  try {
  const { password, method } = data;
  if (!password || !method)
  return handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, handleError.specificError.ID_DATA_REQUIRED);

    const user = await realmQuery.getWithQuery(userSchema.name, customQuery.GET_USER_BY_EMAIL_AND_NUMBER(method, method));

    if (user.length === 1) {
      const auth = await bcrypt.compare(password, user[0].password);

      if (!auth) {
        return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, handleError.specificError.USER_LOGIN_DATA_ERROR);
      }
    } else {
      return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, handleError.specificError.USER_LOGIN_DATA_ERROR);
    }

    const token = createToken(user[0]._id);
    const d = { user: user[0], token }
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, d);

  } catch (error) {
    console.log("login error => ", error);
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};