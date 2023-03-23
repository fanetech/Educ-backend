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
