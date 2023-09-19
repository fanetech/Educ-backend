const { STATUS_CODE, SERVER_STATUS } = require('../services/constant');
const handleError = require('../services/handleError')

module.exports.signUpErrors = (err) => {
    let errors = { number: "", email: "", password: "" };
  
    if (err.message.includes("number"))
      errors.number = "Numero incorrect ou déjà pris";
  
    if (err.message.includes("email")) errors.email = "Email incorrect";
  
    if (err.message.includes("password"))
      errors.password = "Le mot de passe doit faire 8 caractères minimum";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("number"))
      errors.number = "Ce numero est déjà pris";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
      errors.email = "Cet email est déjà enregistré";

      const r = `${errors.number} ${errors.password} ${errors.email}`
  
    return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, r );
  };
  
  module.exports.signInErrors = (err) => {
    let errors = { password: "", method: "" };
  
    if (err.message.includes("email") || err.message.includes("number"))
      errors.method = "Email ou numero inconnu";
  
    if (err.message.includes("password"))
      errors.password = "mot de passe invalide";
  
    return errors;
  };
module.exports.globalSatuts = (res, data) => {
    switch (data.status) {
      case SERVER_STATUS.SUCCESS:
        return res.status(SERVER_STATUS.SUCCESS).json(data.send);
      case SERVER_STATUS.UNEXPECTED_ERROR:
         return res.status(SERVER_STATUS.UNEXPECTED_ERROR).json(data.send);
      case SERVER_STATUS.BAD_GATEWAY:
         return res.status(SERVER_STATUS.BAD_GATEWAY).json(data.send);
      case SERVER_STATUS.SERVICE_UNAVAILABLE:
         return res.status(SERVER_STATUS.SERVICE_UNAVAILABLE).json(data.send);
      case SERVER_STATUS.DATA_INCORRECT:
         return res.status(SERVER_STATUS.DATA_INCORRECT).json(data.send);
      case SERVER_STATUS.NOT_FOUND:
         return res.status(SERVER_STATUS.NOT_FOUND).json(data.send);
    
      default:
        break;
    }
  
};
  
  module.exports.classroomError = (err) => {
    let errors = { totalPrice: "", schoolId: "", name: "" };

    if (err.message.includes("name"))
      errors.name = "Nom incorrect ou Existe déja";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("name"))
      errors.name = "Nom incorrect ou Existe déja";

    return errors;
  };