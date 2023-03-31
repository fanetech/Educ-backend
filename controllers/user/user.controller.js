const userModel = require("../../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;
const userService = require('./user.service')
const utilsError  = require('../../utils/utils.errors');
const { USER_ROLE } = require("../../services/constant");

module.exports.getUserById = async (req, res) => {
  
  const response = await userService.getById(req.params.id, req.body)

  return await utilsError.globalSatuts(res, response)

};

module.exports.getAllUser = (req, res) => {
  userModel
    .find((err, users) => {
      if (!err) {
        return res.status(200).json({ msg: "success", docs: users });
      } else {
        return res.status(500).json({ msg: "error", err: "Internal error" });
      }
    })
    .select({ password: false });
};

module.exports.updateUser = (req, res) => {
  const id = req?.params?.id;
  if (!ObjectId.isValid(id)) {
    return res.status(404).json({ msg: "error", err: "User no found" });
  }

  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });

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
      return res.status(404).json({ msg: "error", err: "User no found" });
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
          return res.status(400).json({ msg: "error", err: "role incorect" });
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
        return res.status(404).json({ msg: "error", err: "School no found" });
      }
      if (schoolRole) theSchool.role = schoolRole;
      if (status != null) theSchool.status = status;
    }
    return user.save((err) => {
      if (!err) {
        return res.status(200).json({ msg: "success", docs: user });
      }
      console.log("user.Controller error == ",err);
      return res.status(500).json({ msg: "error", err: "Internal error" });
    });
  });
};

module.exports.remove = async (req, res) => {
  const id = req.params.id;
  userModel.findByIdAndRemove(id, (err, user) => {
    if (err)
      return res.status(500).json({ msg: "error", err: "Internal error" });
    if (!user)
      return res.status(404).json({ msg: "error", err: "user no found" });
    res.status(200).json({ msg: "success" });
  });
};
