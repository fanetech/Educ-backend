const userModel = require('../../models/user.model');
const { signUpErrors } = require('../../utils/utils.errors');

module.exports.login = async (req, res) => {};

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
      res.status(201).json({ msg: "error", errors });
    }
};
