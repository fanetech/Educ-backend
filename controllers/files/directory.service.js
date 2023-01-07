const directorySchama = require("../../models/directory.model");


module.exports.createDirectory = async (directory) => {
  let res = { send: null, status: null };
  if (Object.keys(directory).length === 0) {
    res.send = { msg: "error", err: "No data" };
    res.status = 500;
    return res;
  }
  let {
    name,
    type,
    description,
    creatorId,
    path,
    categorie,
    directoryId,
    depth,
  } = directory;
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
    res.send = { msg: "error", err: "Internal error", errorDetail };
    res.status = 500;
    return res;
  }
  if (directoryId) {
    try {
      const racineDir = await directorySchama.findById(directoryId);
      if (racineDir) {
        racineDir.directoryId.push(newDirectory._id);
        const racineIrUpdate = await racineDir.save();
        if (!racineIrUpdate._id)
          throw "Internal error. Racine directory not save";
        res.send = { msg: "success", directory: newDirectory };
        res.status = 200;
        return res;
      } else {
        throw "Directory no found";
      }
    } catch (errorDetail) {
      const d = directorySchama.findByIdAndRemove(newDirectory);
      res.send = { msg: "error", err: "internal error", errorDetail };
      res.status = 500;
      return res;
    }
  } else {
    res.send = { msg: "success", directory: newDirectory };
    res.status = 200;
    return res;
  }
};

module.exports.createFile = async (file, directoryId) => {
  let res = { send: null, status: null };
  if (Object.keys(file).length === 0) {
    res.send = { msg: "error", err: "No data" };
    res.status = 500;
    return res;
  }
  const { name, description, categorie, size, path } = file;
  if (!name || !categorie || !size || !path) {
    res.send = { msg: "error", err: "Data no complete" };
    res.status = 400;
    return res;
  }
  const directory = await directorySchama.findById(directoryId);
  if (!directory) {
    res.send = { msg: "error", err: "Directory no found" };
    res.status = 404;
    return res;
  }
  directory.files.push({
    name,
    description,
    categorie,
    size,
    path,
  });
  const directoryUpdate = await directory.save();
  if (directoryUpdate) {
    res.send = { msg: "success", directory };
    res.status = 200;
    return res;
  }
  res.send = { msg: "error", err: "Internal error" };
  res.status = 500;
  return res;
};
