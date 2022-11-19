const fileSchama = require("../../models/files.model");

module.exports.create = async (req, res) => {
  const {
    size,
    creatorId,
    path,
    categorie,
    type,
    name,
    description,
    directoryId,
  } = req.body;

  const newFile = this.createFile(
    creatorId,
    path,
    size,
    name,
    type,
    categorie,
    description,
    directoryId
  );
  if (newFile.msg === "error") {
    return res.status(500).json(newFile);
  }
};
//create new file
module.exports.createFile = async (
  creatorId,
  path,
  size,
  name,
  type,
  categorie,
  description,
  directoryId = null
) => {
  let newFile;
  if (
    !size ||
    !creatorId ||
    !path ||
    !categorie ||
    !type ||
    !name ||
    !description
  ) {
    return { msg: "error", err: "Data no complete" };
  }

  if (directoryId) {
    fileSchama.findById(directoryId, (err, directory) => {
      if (err) {
        return res
          .status(404)
          .json({ msg: "error", err: "directory no found" });
      }
      if (!directory) {
        return res.status(500).json({ msg: "error", err: "internal no found" });
      }
      console.log(directory);
    });
  } else {
    newFile = new fileSchama({
      name,
      type,
      description,
      creatorId,
      path,
      categorie,
      size,
    });
  }
  const _newFile = await newFile.save((err) => {
    console.log(_newFile);
    if (err)
      return res.status(500).json({ msg: "error", err: "Internal error" });
  });
  if (_newFile) return { msg: "success", _newFile };
  return { msg: "error", err: "Internal error" };
};
