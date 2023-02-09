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
      else return { send: { msg: "error", err: "Internal error" }, status: 500 };
        
    } catch (err) {
       return { send: { msg: "error", err: err }, status: 500 };
    }
};

module.exports.note = async (id, data) => {
  classModel.findById(id, (err, classroum) => {
    if (err)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    if (!classroum)
      return { send: { msg: "error", err: "class no found" }, status: 404 };
    const note = classroum.notes;
    note.push(data);
    classroum.save((err, c) => {
      if (err)
        return { send: { msg: "error", err: "Internal error" }, status: 500 };
      return { send: { msg: "success", classroum }, status: 200 };
    });
  });
};
