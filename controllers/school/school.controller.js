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

// To Manage school year
module.exports.createYearSchool = async (req, res) => {
    const {starYear, endYear, division } = req.body

    if(!starYear || !endYear || !division ){
        return res.status(400).json({ msg: 'error', err: 'Data no complete' })
    }
    schoolModel.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                schoolYears: {
                    starYear: req.body.starYear,
                    endYear: req.body.endYear,
                    division: req.body.division
                }
            },
        },
        { new: true },
        (err, school) => {
            if (!err) return res.status(200).json({ msg: 'success', school })
            else return res.status(500).json({ msg: 'error', err: 'Internal error or school no found' })
        }
    )
}

module.exports.createYearSchoolPeriod = async (req, res) => {
    const {starDate, endDate, status, schoolYearId} = req.body

    if(!starDate || !endDate || status == null || !schoolYearId){
        return res.status(400).json({ msg: 'error', err: "Data no complete" })
    }

  schoolModel.findById(
    req.params.id,
    (err, docs) =>{
        if(err) {
            return res.status(404).json({ msg: 'error', err: "School no found" })
        }
        const theYear = docs.schoolYears.find(year => year._id.equals(schoolYearId))
        if(!theYear){
            return res.status(404).json({ msg: 'error', err: "School year no found" })
        }
        theYear.periods.push({
            starDate:starDate,
            endDate: endDate,
            status: status
        })

        docs.save(err => {
            if (!err) 
                return res.status(200).json({ msg: 'success', docs });
            return res.status(500).json({ msg: 'error', err: "Internal error" })
        })
    }
    )
}

module.exports.createYearSchoolDeadline = async (req, res) => {    
    const {starDate, endDate, price, schoolYearId} = req.body

    if(!starDate || !endDate || !price || !schoolYearId){
        return res.status(400).json({ msg: 'error', err: "Data no complete" })
    }

    schoolModel.findById(
        req.params.id,
        (err, docs) =>{
            if(err) 
                return res.status(404).json({ msg: 'error', err: "School no found" })
            const theYear = docs.schoolYears.find(year => year._id.equals(schoolYearId))
            if(!theYear){
                return res.status(404).json({ msg: 'error', err: "School year no found" })
            }
            theYear.deadlines.push({
                starDate: starDate,
                endDate: endDate,
                price: price
        })

        docs.save(err => {
            if (!err) 
                return res.status(200).json({ msg: 'success', docs });
            return res.status(500).json({ msg: 'error', err: "Internal error" })
        })
    }
    )
} 

// Manage school actor
module.exports.createSchoolActor = (req, res) => {
    console.log(req.body)
    const {role, actif, userId} = req.body
    if(!role || actif == null || !userId){
        return res.status(400).json({ msg: 'error', err: "Data no complete" })
    }
    schoolModel.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                actors: {
                    role: role,
                    actif: actif,
                    userId: userId
                }
            }
        },
        { new: true },
        (err, docs) => {
            if (!err) res.status(200).json({ msg: 'success', docs })
            else res.status(500).json({ msg: 'error', err: "Internal error or Actor no found" })
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