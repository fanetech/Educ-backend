const userModel = require('../../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../../utils/utils.errors');

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
		const token = createToken(user._id);
		res.status(200).json({ msg: "success", user: user._id, token: token });
	} catch (err) {
		const errors = signInErrors(err);
		res.status(500).json({ msg: "error", errors });
	}
};

module.exports.register = async (req, res) => {
    const { userName, firstName, lastName, number, email, role, password, adress } = req.body;
    try {
      const user = await userModel.create({
        userName,
        firstName,
        lastName,
        number,
        email,
        role,
        password,
        adress,
      });
      res.status(200).json({ msg: "success", user: user._id });
    } catch (err) {
      const errors = signUpErrors(err);
      res.status(500).json({ msg: "error", errors});
    } 
}; 