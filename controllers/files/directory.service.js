const directorySchama = require("../../models/directory.model");
const { STATUS_CODE } = require("../../services/constant");
const handleError = require("../../services/handleError")
const utilsTools = require("../../utils/utils.tools")


module.exports.createDirectory = async (directory) => {
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

  if(!name || !type || !creatorId || !categorie){
    return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "nom, type, catégorie ou le createur");
  }

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
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
  if (directoryId) {
    try {
      const racineDir = await directorySchama.findById(directoryId);
      if (racineDir) {

        racineDir.directoryId.push(newDirectory._id);
        const racineIrUpdate = await racineDir.save();

        if (!racineIrUpdate._id){

          return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
        }

        return handleError.errorConstructor(STATUS_CODE.SUCCESS, newDirectory);

      } else {

        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "Dossier");
      }
    } catch (errorDetail) {
      
      const d = directorySchama.findByIdAndRemove(newDirectory);
      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
  } else {
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, newDirectory);
  }
};

module.exports.createFile = async (file, directoryId) => {

  try {
    const { name, description, categorie, size, path, creatorId } = file;

  if (!name || !categorie || !size || !path || !creatorId || !directoryId) {

    return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "nom, description, catégorie,...");
  }

  const directory = await directorySchama.findById(directoryId);
  if (!directory) {

    return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "Dossier");
  }
  directory.files.push({
    name,
    description,
    categorie,
    size,
    path,
    creatorId
  });

  const directoryUpdate = await directory.save();

  if (directoryUpdate) {

   return handleError.errorConstructor(STATUS_CODE.SUCCESS, utilsTools.getCurrentObject(directory.files));
  }

  return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    
  } catch (error) {
    
    console.log("directory_service_createFile_error =>", error)
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }

  
};
