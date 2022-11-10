const userModel = require("../../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getUserById = (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res
            .status(404)
            .json({ msg: "error", err: "User no found" });
  }
  userModel
    .findById(id, (err, user) => {
      if (err) {
        return res
          .status(500)
          .json({ msg: "error", err: "Internal error" });
      }
      res.status(200).json(
        { msg: "sucess", user}
      );
    })
    .select({ password: false });
};

module.exports.getAllUser = (req, res) => {
  userModel
    .find((err, users) => {
      if (!err) {
        return res
          .status(500)
          .json({ msg: "success", users });
      } else {
        return res
          .status(500)
          .json({ msg: "error", err: "Internal error" });
      }
    })
    .select({ password: false });
};

// module.exports.updateUser = (req, res) => {
//   if (!ObjectId.isValid(req.params.id)) {
//     return res
//     .status(404)
//     .json({ msg: "error", err: "User no found" });
//   }
//   const user = {
//     userName: req.body.userName,
//     firstName: req.body.firstName,
//     email: req.body.email,
//     phoneNumber: req.body.phoneNumber,
//     address: req.body.address,
//   };
//   const id = req.params.id;
//   const checkUser = userModel.findOne({ _id: id });
//   if (!checkUser) {
//     res.send({
//       message: "Utilisateur non trouvé",
//     });
//   }
//   userModel.findByIdAndUpdate(
//     req.params.id,
//     { $set: user },
//     { new: true },
//     (err, doc) => {
//       if (doc) {
//         res.send(
//           doc && {
//             message: "Utilisateur mis à jour avec succès",
//           }
//         );
//       } else {
//         res.send({
//           message: "Error updating user",
//         });
//       }
//     }
//   );
// };

// module.exports.deleteUser = (req, res) => {
//   const id = req.params.id;
//   const users = userModel.findOne({ _id: id });
//   if (users) {
//     userModel.findByIdAndRemove(req.params.id, (err, doc) => {
//       if (doc) {
//         return res.status(200).send({
//           message: "Utilisateur supprimé avec succès",
//           success: true,
//         });
//       } else {
//         return res.status(500).send({
//           message: "Error deleting user",
//         });
//       }
//     });
//   }
//   res.send({
//     message: "Utilisateur non trouvé",
//   });
// };