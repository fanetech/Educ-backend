const { globalSatuts } = require('../../utils/utils.errors');
const utilsTools = require('../../utils/utils.tools')
const authService = require('./authUserService')

module.exports.register = async (req, res) => {
  const reqAnalityc = utilsTools.checkRequest(req)
  if (reqAnalityc !== 1) {
    return globalSatuts(res, reqAnalityc)
  }
  const authServiceCreate = await authService.register(req.body)
  return globalSatuts(res, authServiceCreate)
};

module.exports.login = async (req, res) => {
  const reqAnalityc = utilsTools.checkRequest(req)

  if (reqAnalityc !== 1) {
    return globalSatuts(res, reqAnalityc)
  }
  const authServiceLogin = await authService.login(req.body)
  return globalSatuts(res, authServiceLogin)  
};