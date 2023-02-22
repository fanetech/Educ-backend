const schoolModel = require("../../models/school.model")
const response ={
    res: null,
    err: null
}
module.exports.remove = async (id) =>{
    schoolModel.findByIdAndRemove(id, (err, docs) => {
        if (!err){
            response.res = docs
        }
        else {
            response.err = err
        }
        return response
    })
}
module.exports.parseDate = (date) => {
    const d = new Date(date)
    return d
    
}