const directorySchama = require("../../models/directory.model");

module.exports.createDirectory = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });
  let {
    name,
    type,
    description,
    creatorId,
    path,
    categorie,
    directoryId,
    depth,
  } = req.body;
  let newDirectory;
  try {
   newDirectory = await directorySchama.create({
      name,
      type,
      description,
      creatorId,
      path,
      categorie,
      depth,
    });

  } catch (errorDetail) {
    return res
      .status(500)
      .json({ msg: "error", err: "Internal error", errorDetail });
  }
  if (directoryId) {
    directorySchama.findById(directoryId, (err, racineDir) => {
        try {
        if (err) {
            throw "Directory no found";
        }
        racineDir.directoryId.push(newDirectory._id);

        racineDir.save((err) => {
          if (err) throw "Internal error. Racine directory not save";
         return res.status(200).json({ msg: "success", directory: newDirectory });
        });
      } catch (errorDetail) {
        directorySchama.findByIdAndRemove(
          newDirectory._id,
          (errorDetail, newDir) => {
            if (errorDetail)
              return res
                .status(500)
                .json({ msg: "error", err: "internal error", errorDetail });
          }
        );
        return res
          .status(500)
          .json({ msg: "error", err: "Internal error", errorDetail });
      }
      });
  }else{
    return res.status(200).json({ msg: "success", directory: newDirectory });
  }
  
};

module.exports.createFile = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });
  const { name, description, categorie, size, path } = req.body;
  if (!name || !categorie || !size || !path) {
    return res.status(400).json({ msg: "error", err: "Data no complete" });
  }
  directorySchama.findById(req.params.id, (err, directory) => {
    if (err) {
      return res.status(404).json({ msg: "error", err: "Directory no found" });
    }
    directory.files.push({
      name,
      description,
      categorie,
      size,
      path,
    });

    directory.save((err) => {
      if (!err) return res.status(200).json({ msg: "success", directory });
      return res.status(500).json({ msg: "error", err: "Internal error" });
    });
  });
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
