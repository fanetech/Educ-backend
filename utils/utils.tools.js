const ObjectId = require("mongoose").Types.ObjectId;

module.exports.isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

module.exports.getObjectValue = (id, object) => {
  const d = object.find(d => d._id.equals(id))
  return d
}

module.exports.getCurrentObject = (array) => {
  if (this.isEmpty(array))
    return { send: { msg: "error", err: "array is null" }, status: 404 };
  return array[array.length - 1];
};

module.exports.checkRequest = (req) => {
  const id = req?.params?.id
  if ( id && !this.checkParams(id)) {
    return { send: { msg: "error", err: "id no valid" }, status: 500 }
  }

  if (Object.keys(req.body).length === 0){
    return { send: { msg: "error", err: "No data" }, status: 400 }
  }

  return 1
}

module.exports.checkParams = (id) => {
  return ObjectId.isValid(id)
}

module.exports.parseFullYear = (star, end) => {
  return `${this.parseDate(star).getFullYear()}-${this.parseDate(end).getFullYear()}`;
}

module.exports.parseDate = (date) => {
  const d = new Date(date)
  return d

}

module.exports.save = async (doc, sendDoc) => {

  const s = await doc.save();
  if (!s)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };

  return { send: { msg: "success", docs: sendDoc ?? s }, status: 200 };
}
