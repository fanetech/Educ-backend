const classroomModel = require("../../models/classroum.model");
const { isEmpty } = require("../../utils/utils.tools");

module.exports.getAll = async () => {
  const classroums = await classroomModel.find().sort({ createdAt: -1 });
  if (classroums) return { send: { msg: "success", classroums }, status: 200 };
  else return { send: { msg: "error", err: "Internal error" }, status: 500 };
};

// TODO
module.exports.getOne = async (id) => {
  try {
    const classroum = await classroomModel.findById(id);
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
    const classroum = await classroomModel.findById(id);
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
      return { send: { msg: "error", err: "class no found" }, status: 404 };
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
      return { send: { msg: "error", err: "class no found" }, status: 404 };
    const matters = classroum?.matters;
    if (isEmpty(matters))
      return { send: { msg: "error", err: "Matter is null" }, status: 404 };
    let pupilMatter = [];
    for (const m of matters) {
      const matterObject = {
        matter: m?.name,
        matterId: m?._id,
      };
      pupilMatter.push(matterObject);
    }
    const pupil = classroum.pupils;
    const p = data?.pay ?? classroum.totalPrice;
    const d = {
      ...data,
      pay: p,
      notes: pupilMatter,
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
