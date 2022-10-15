const { response } = require('express')
const schoolModel = require('../../models/school.model')
const userModel = require('../../models/user.model')
const UserModel = require('../../models/user.model')

module.exports.create = async (req, res) => {
    const { schoolName, slogan, founderId } = req.body
    if(!schoolName || !slogan || !founderId) {
        return res.status(400).json({ msg: 'error', err: 'data no complete' })
    }
    let newSchool

    newSchool = new schoolModel({
        schoolName,
        slogan,
        founderId
    })
    console.log("test")
    const school = await newSchool.save()
    if(!school._id) return res.status(500).json({ msg: 'error', err: 'Internal error' })
  
    userModel.findByIdAndUpdate(
        founderId,
        {
            $push: {
                school: {
                    userId: founderId,
                    role: 'founder'
                }
            },
        },
        {new: true},
        (err, _) =>{
            if(err) {
                schoolModel.findByIdAndRemove(school._id, (err, _) => {
                    if (err) {                        
                        console.log("error to delete school", err)
                        return res.status(500).json({ msg: 'error', err: 'Internal error' })
                    } 
                    return res.status(404).json({ msg: 'error', err: 'founderId no found' })
                    
                })                        
            }

            else return res.status(200).json({ msg: 'success', school })            
        }
    )
}

module.exports.getAll = async (req, res) => {
    schoolModel.find((err, schools) => {
        if (!err) return res.status(200).json({ msg: 'success', schools })
        else return res.status(201).send({ msg: 'error', err })
    }).sort({ createdAt: -1 })
}

module.exports.getOne = (req, res) => {
    const id = req.params.id
    schoolModel.findById(id, (err, school) => {
        if (school) return res.status(200).json({ msg: 'success', school })
        else return res.status(201).json({ msg: 'err', err: 'no found' })
    })
}

module.exports.update = async (req, res) => {
    const id = req.params.id
    const updateRecord = {
        schoolName: req.body.schoolName,
        slogan: req.body.slogan,
        logo: req.body.logo,
        founderName: req.body.founderName
    }
    schoolModel.findByIdAndUpdate(
        id,
        { $set: updateRecord },
        { new: true },
        (err, docs) => {
            if (!err) res.status(200).json({ msg: 'success', docs })
            else res.status(201).json({ msg: 'error', err })
        }
    )
}

module.exports.remove = async (req, res) => {
    const id = req.params.id
    schoolModel.findByIdAndRemove(id, (err, docs) => {
        if (!err) res.status(200).json({ msg: 'success', docs })
        else res.status(201).json({ msg: 'error', err })
    })
}

module.exports.softDelete = async (req, res) => {
    schoolModel.findByIdAndUpdate(
        req.params.id,
        { $set: { isDeleted: true } },
        { new: true },
        (err, docs) => {
            if (!err) res.status(200).json({ msg: 'success', docs })
            else res.status(201).json({ msg: 'error', err })
        }
    )
}

// School period manager
module.exports.createYearSchoolPeriod = async (req, res) => {
    schoolModel.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                schoolYear: {
                    year: req.body.year,
                    period: {
                        starDate: req.body.starDateP,
                        endDate: req.body.endDateP,
                        status: req.body.status
                    },
                    deadline: {
                        starDate: req.body.starDateD,
                        endDate: req.body.endDateD,
                        price: req.body.price
                    }
                }
            },
        },
        { new: true },
        (err, docs) => {
            if (!err) res.status(200).json({ msg: 'success', docs })
            else res.status(201).json({ msg: 'error', err })
        }
    )
}

module.exports.updateYearSchoolPeriod = async (req, res) => {
    const {starDateP, endDateP, starDateD, endDateD, status, price, year, schoolYearId, periodId, deadlineId} = req.body
    
    schoolModel.findById(req.params.id, (err, docs) => {
        const _theSchoolYear = docs.schoolYear.find(schoolYear =>
            schoolYear._id.equals(schoolYearId),
            );
            
            if(year){
                _theSchoolYear.year = year
            }

        if(starDateP || endDateP || status){
            const thePeriod = _theSchoolYear.period.find(period =>
                period._id.equals(periodId),
            );
            if (!thePeriod) return res.status(404).send('Comment not found');
            if(starDateP) thePeriod.starDate = starDateP;
            if(endDateP) thePeriod.endDate = endDateP;
            if(status !=null) thePeriod.status = status;
        }

        if(starDateD || endDateD || price){
            const thedeadline = _theSchoolYear.deadline.find(deadline =>
                deadline._id.equals(deadlineId),
            );
            if (!thedeadline) return res.status(404).send('Comment not found');
            if(starDateD) thedeadline.starDate = starDateD;
            if(endDateD) thedeadline.endDate = endDateD;
            if(price) thedeadline.price = price;
        }

        return docs.save(err => {
            if (!err) return res.status(200).json({ msg: 'success', docs });
            return res.status(201).json({ msg: 'error', err })
        });
    })
 
}



module.exports.updateDeatline= async (req, res) => {
    const {starDate, endDate, price, schoolYearId, deadlineId} = req.body

    schoolModel.findById(req.params.id, (err, docs) => {
        const _theSchoolYear = docs.schoolYear.find(schoolYear =>
            schoolYear._id.equals(schoolYearId),
        );
        const thedeadline = _theSchoolYear.deadline.find(deadline =>
            deadline._id.equals(deadlineId),
        );
        if (!thedeadline) return res.status(404).send('Comment not found');
        if(starDate) thedeadline.starDate = starDate;
        if(endDate) thedeadline.endDate = endDate;
        if(price) thedeadline.price = price;

        return docs.save(err => {
            if (!err) return res.status(200).json({ msg: 'success', docs });
            return res.status(201).json({ msg: 'error', err })
        });
    })
 
}