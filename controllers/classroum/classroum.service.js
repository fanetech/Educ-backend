const classModel = require("../../models/classroum.model");

module.exports.getAll = async () => {
  const classroums = await classModel.find().sort({ createdAt: -1 });
  if (classroums) return { send: { msg: "success", classroums }, status: 200 };
  else return { send: { msg: "error", err: "Internal error" }, status: 500 };
};

// TODO
module.exports.getOne = async (id) => {
  try {
    const classroum = await classModel.findById(id);
    if (classroum) return { send: { msg: "success", classroum }, status: 200 };
    else {
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    }
  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: err }, status: 500 };
  }
};

module.exports.note = async (id, pupilId, data) => {
  try {
    const classroum = await classModel.findById(id);
    if (!classroum)
      return { send: { msg: "error", err: "class no found" }, status: 404 };
    const pupil = classroum.pupils.find((p) => p._id.equals(pupilId));
    if (!pupil)
      return { send: { msg: "error", err: "pupil no found" }, status: 404 };
    pupil.notes.push(data);
    const c = await classroum.save();
    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    return { send: { msg: "success", classroum: c }, status: 200 };
  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
};

module.exports.matter = async (id, data) => {
  try {
    const classroum = await (await this.getOne(id)).send.classroum;
    if (classroum.status === "error")
      return res.status(404).json({ msg: "error", err: "class no found" });
    classroum.matters.push(data);
    const c = await classroum.save();
    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    return { send: { msg: "success", classroum: c }, status: 200 };
  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
};

module.exports.pupil = async (id, data) => {
  try {
    const classroum = await (await this.getOne(id)).send.classroum;
    if (classroum.status === "error")
      return res.status(404).json({ msg: "error", err: "class no found" });
    const pupil = classroum.pupils;
    const p = data.pay ?? classroum.price;
    const d = {
      ...data,
      pay: p,
    };
    pupil.push(d);
    const c = await classroum.save();
    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    return { send: { msg: "success", classroum: c }, status: 200 };
  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
};
