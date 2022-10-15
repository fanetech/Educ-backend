module.exports.signUpErrors = (err) => {
    let errors = { userName: "", email: "", password: "" };
  
    if (err.message.includes("userName"))
      errors.userName = "Pseudo incorrect ou déjà pris";
  
    if (err.message.includes("email")) errors.email = "Email incorrect";
  
    if (err.message.includes("password"))
      errors.password = "Le mot de passe doit faire 8 caractères minimum";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("userName"))
      errors.userName = "Ce nom d'utilisateur est déjà pris";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
      errors.email = "Cet email est déjà enregistré";
  
    return errors;
  };
  
  module.exports.signInErrors = (err) => {
    let errors = { email: "", password: "" };
  
    if (err.message.includes("email")) errors.email = "Email inconnu";
  
    if (err.message.includes("password"))
      errors.password = "mot de passe invalide";
  
    return errors;
  };