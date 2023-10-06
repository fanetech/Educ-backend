const ObjectId = require("mongoose").Types.ObjectId;
const { STATUS_CODE } = require("../services/constant");
const handleError = require("../services/handleError")
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
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, "données indispensable incorect");
  }
  if (Object.keys(req.body).length === 0){
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, "données indispensable incorect");
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
  try {
    const s = await doc.save();
    if (!s)
        return   handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  
    const data = sendDoc ?? s
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, data);
  } catch (error) {
    console.log("save_service_error =>", error)
     return   handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, "format des champs attendu invalide");
  } 
}
