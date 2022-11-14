const fileSchama = require("../../models/files");
module.exports.create = async (
  creatorId,
  path,
  size,
  name,
  type,
  categorie,
  description
) => {
  const newFile = new fileSchama({
    name,
    type,
    description,
    creatorId,
    path,
    categorie,
    size,
  });
  const _newFile = await newFile.save();
  if (_newFile) return { msg: "success", _newFile };
  return { msg: "error", err: "Internal error" };
};
