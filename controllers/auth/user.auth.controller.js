const userModel = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require("../../utils/utils.errors");
const { getSchoolOfUser } = require("../school/school.controller");
const bcrypt = require("bcrypt");
const { USER_ROLE } = require("../../services/constant");

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.login = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });
  const { email, password, number } = req.body;
  try {
    const user = await userModel.findOne({
      $or: [
        {
          email: email,
        },
        {
          number: number,
        },
      ],
    })

    if (user) {
      const auth = await bcrypt.compare(password, user.password);

      if (!auth) {
        throw Error("incorrect password");
      }
    } else {
      throw Error("incorrect email or number ");
    }
    delete user["password"];
    const token = createToken(user._id);
    res.status(200).json({ msg: "success", user: user, token: token });
  } catch (err) {
    const errors = signInErrors(err);
    console.log(err);
    res.status(500).json({ msg: "error", errors });
  }
};

module.exports.register = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });
  const { number, email, password, role } = req.body;
  if ((!number || !email) && !password && !role) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }
  const _role = USER_ROLE[role]
  if (!_role) {
    return res.status(400).json({ msg: "error", err: "role incorect" });
  }
  try {
    const user = await userModel.create({
      number,
      email,
      password,
      role
    });
    res.status(200).json({ msg: "success", user: user });
  } catch (err) {
    const errors = signUpErrors(err);
    res.status(500).json({ msg: "error", errors });
  }
};
