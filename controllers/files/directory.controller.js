const directorySchama = require("../../models/directory.model");
const { globalSatuts } = require("../../utils/utils.errors");
const { createDirectory, createFile } = require("./directory.service");
const utilsError = require("../../utils/utils.errors")
const utilsTools = require("../../utils/utils.tools")
const handleError = require("../../services/handleError");
const { STATUS_CODE } = require("../../services/constant");

module.exports.createDirectory = async (req, res) => {
  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }
  const directorySercice = await createDirectory(req.body);
  return await globalSatuts(res, directorySercice)  
};

module.exports.createFile = async (req, res) => {
  const directorySercice = await createFile(req.body, req.params.id);
  return await globalSatuts(res, directorySercice);
};

module.exports.getAllDirectory = (req, res) => {
  try {
    
    directorySchama
      .find((err, directorys) => {
        if (directorys) {
          return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, directorys));
        }
        else{
  
          return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));
        }  
      })
      .sort({ createdAt: -1 });

  } catch (error) {
    console.log("directory_getAllDirectory_error =>", error)
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));
  }
};

module.exports.getOneDirectory = (req, res) => {
  const id = req.params.id;
  try {
    
    directorySchama.findById(id, (err, directory) => {
      if (directory) {

        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, directory));
      }
      else {

        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "Dossier"));
      }
    });
    
  } catch (error) {

    console.log("directory_getOneDirectory_error =>", error)
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));
  }
};

module.exports.getCreatorDirectory = (req, res) => {
  const creatorId = req.params.id;

  try {
    
    directorySchama.find({ creatorId }, (err, directorys) => {
      if (directorys.length>0){
        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, directorys));
      }
      else{
        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "Dossiers"));
      }
    });
  } catch (error) {

    console.log("directory_getCreatorDirectory_error =>", error)
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));
  }
};
