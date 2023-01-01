const directorySchama = require("../../models/directory.model");
const { globalSatuts } = require("../../utils/utils.errors");
const { createDirectory, createFile } = require("./directory.service");

module.exports.createDirectory = async (req, res) => {
  const directorySercice = await createDirectory(req.body);
  return await globalSatuts(res, directorySercice);
  // directorySchama.findById(req.body.directoryId, (err, racineDir) => {
  //   console.log(racineDir)
  //   res.send(racineDir);
  // });
  
};

module.exports.createFile = async (req, res) => {
  const directorySercice = await createFile(req.body, req.params.id);
  return await globalSatuts(res, directorySercice);
};

module.exports.getAllDirectory = (req, res) => {
  directorySchama
    .find((err, directorys) => {
      if (!err) return res.status(200).json({ msg: "success", directorys });
      else return res.status(500).send({ msg: "error", err: "Internal error" });
    })
    .sort({ createdAt: -1 });
};
module.exports.getOneDirectory = (req, res) => {
  const id = req.params.id;
  directorySchama.findById(id, (err, directory) => {
    if (!err) return res.status(200).json({ msg: "success", directory });
    else return res.status(500).send({ msg: "error", err: "Internal error" });
  });
};
module.exports.getCreatorDirectory = (req, res) => {
  const creatorId = req.params.id;
  directorySchama.find({ creatorId }, (err, directorys) => {
    if (!err) return res.status(200).json({ msg: "success", directorys });
    else return res.status(500).send({ msg: "error", err: "Internal error" });
  });
};
