const userModel = require("../../models/user.model");
const utilsTools = require('../../utils/utils.tools')


module.exports.getById = async (id) => {
    
    if(!utilsTools.checkParams(id)){
        return { send: { msg: "error", err: "internal error" }, status: 500 }; 
    }
    const user = await userModel
        .findById(id)
        .select({ password: false });

    if (!user) {
        return { send: { msg: "error", err: "user no found" }, status: 404 };
    }

    return { send: { msg: "success", docs: user }, status: 200 };
}