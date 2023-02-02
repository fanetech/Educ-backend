const { default: mongoose } = require("mongoose");
const classroumModel = require("../../models/classroum.model");
const schoolModel = require("../../models/school.model");

module.exports.create = async (req, res) => {
  if (Object.keys(req.body).length === 0)
  return res.status(400).json({ msg: "error", err: "No data" });
  const {name, price, schoolId} = req.body
  if (!name || !price || !schoolId) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }
  const school = await schoolModel.findById(schoolId);
  // if (!school) {
  //   return res.status(400).json({ msg: "error", err: "School no found" }); // TODO
  // }
  const dynamic = school.dynamic.find((d) => d._id.equals(req.body.dynamicId));
  if(!dynamic) return res.status(400).json({ msg: "error", err: "dynamicId no found" });
  try {
  const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      
      const newClassroum = await new classroumModel({
        ...req.body,
      }, {session});
    
      dynamic.classroum.push(newClassroum._id);
      await  school.save({session})
   const classroum = await newClassroum.save({ session }); 
   await session.commitTransaction();
   if (classroum) {
     return res.status(200).json({ msg: "success", classroum, school });
   } else {
     return res.status(500).json({ msg: "error", err: "Internal error" });
   }
    })  
       session.endSession();
    }
    catch (err) {
      console.log(err)
      return res.status(500).json({ msg: "error", err });
    }
};
