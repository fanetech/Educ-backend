const { default: mongoose } = require("mongoose");
const classModel = require("../../models/classroum.model");
const schoolModel = require("../../models/school.model");

module.exports.create = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });
  
  const { name, price, schoolId, schoolYearsId } = req.body;
  if (!name || !price || !schoolId || !schoolYearsId) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }

  let schoolYear, school;

  try {
   school = await schoolModel.findById(schoolId);
    schoolYear = school.schoolYears.find((d) => d._id.equals(schoolYearsId));
  } catch (err) {
    return res.status(400).json({ msg: "error", err: "school no found" });
  }

  if (!schoolYear)
    return res.status(400).json({ msg: "error", err: "dynamicId no found" });
  
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const newClassroum = await new classModel(
        {
          name,
          price
        },
        { session }
      );

      schoolYear.class.push(newClassroum._id);
      await school.save({ session });
      const classroum = await newClassroum.save({ session });

      await session.commitTransaction();

      if (classroum) {
        return res.status(200).json({ msg: "success", classroum });
      } else {
        return res.status(500).json({ msg: "error", err: "Internal error" });
      }
    });
    session.endSession();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "error", err });
  }
};

module.exports.matter = async (req, res) => {
   if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });
  
  const { name, coef, teacherId, horaire } = req.body;
   if (!name || !coef || !teacherId || !horaire) {
     return res.status(400).json({ msg: "error", err: "data no complete" });
  }

  classModel.findById(req.params.id, (err, classroum) => {
    if (err)
      return res.status(500).json({ msg: "error", err: "Internal error" });
    if (!classroum)
      return res.status(404).json({ msg: "error", err: "class no found" });
    const matter = classroum.matter 
    const data = { name, coef, teacherId, horaire };
    matter.push(data)
    classroum.save((err, c) => {
      if (err)
        return res.status(500).json({ msg: "error", err: "Internal error" });
      return res.status(200).json({ msg: "success", classroum });
    })
      
  })
}
