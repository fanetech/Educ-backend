const userModel = require('../../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../../utils/utils.errors');
const { getSchoolOfUser } = require('../school/school.controller');

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = id => {
	return jwt.sign({ id }, process.env.TOKEN_SECRET, {
		expiresIn: maxAge,
	});
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
	try {
		const user = await userModel.login(email, password);
    delete user['password']
		const token = createToken(user._id);
		res.status(200).json({ msg: "success", user: user, token: token });
	} catch (err) {
		const errors = signInErrors(err);
    console.log(errors)
		res.status(500).json({ msg: "error", errors });
	}
};

module.exports.register = async (req, res) => {
  const { number, email, password } = req.body;
  if ((!number || !email) && !password) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }
    try {
      const user = await userModel.create({
        number,
        email,
        password,
      });
      res.status(200).json({ msg: "success", user: user });
    } catch (err) {
      const errors = signUpErrors(err);
      res.status(500).json({ msg: "error", errors});
    } 
}; 