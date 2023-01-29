const { connect } = require("mongoose");
const classroumModel = require("../../models/classroum.model");
const schoolModel = require("../../models/school.model");

module.exports.create = async (req, res) => {
  console.log(connect)
  if (Object.keys(req.body).length === 0)
  return res.status(400).json({ msg: "error", err: "No data" });
  const {name, price, schoolId} = req.body
  if (!name || !price || !schoolId) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }
  const session = await classroumModel.startSession()
  // if (!school) {
  //   return res.status(400).json({ msg: "error", err: "School no found" });
  // }
  try {
      session.startTransaction();   
       const newClassroum = await new classroumModel({
         ...req.body,
       }, {session});
    const classroum = await newClassroum.save();
    // school.dynamic.push({

    // });
  const school = schoolModel.findById(schoolId,{session});
        classroum.save((err) => {
          if (!err) return res.status(200).json({ msg: "success", classroum });
          return res.status(500).json({ msg: "error", err: "Internal error" });
        });        
    }
    catch (err) {
      console.log(err)
      return res.status(500).json({ msg: "error", err });
    }
};
