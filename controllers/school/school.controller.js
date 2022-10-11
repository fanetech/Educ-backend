const schoolModel = require('../../models/school.model')

module.exports.create = async (req, res) => {
    const { schoolName, slogan, logo, founderName } = req.body
    let newSchool

    newSchool = new schoolModel({
        schoolName,
        slogan,
        logo,
        founderName
    })

    try {
        const school = await newSchool.save()
        return res.status(200).json({ msg: 'success', school })
    }
    catch (err) {
        return res.status(500).send({ msg: 'error', err })
    }
}

module.exports.getAll = async (req, res) => {
    schoolModel.find((err, schools) => {
        if (!err) return res.status(200).json({ msg: 'success', schools })
        else return res.status(400).send({ msg: 'error', err })
    }).sort({ createdAt: -1 })
}

module.exports.getOne = (req, res) => {
    const id = req.params.id
    schoolModel.findById(id, (err, school) => {
        if (school) return res.status(200).json({ msg: 'success', school })
        else return res.status(404).json({ msg: 'err', err: 'no found' })
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
            else res.status(404).json({ msg: 'error', err })
        }
    )
}

module.exports.remove = async (req, res) => {
    const id = req.params.id
    schoolModel.findByIdAndRemove(id, (err, docs) => {
        if (!err) res.status(200).json({ msg: 'success', docs })
        else res.status(400).json({ msg: 'error', err })
    })
}

module.exports.softDelete = async (req, res) => {
    schoolModel.findByIdAndUpdate(
        req.params.id,
        { $set: { isDeleted: true } },
        { new: true },
        (err, docs) => {
            if (!err) res.status(200).json({ msg: 'success', docs })
            else res.status(400).json({ msg: 'error', err })
        }
    )
}

// To Manage school year
module.exports.createYearSchool = async (req, res) => {
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
        (err, docs) => {
            if (!err) res.status(200).json({ msg: 'success', docs })
            else res.status(201).json({ msg: 'error', err })
        }
    )
}



module.exports.createYearSchoolPeriod = async (req, res) => {
    const {starDate, endDate, status, schoolYearId} = req.body

    if(!starDate || !endDate || status == null || !schoolYearId)
        return res.status(400).json({ msg: 'error', err: "Data no complete" })

  schoolModel.findById(
    req.params.id,
    (err, docs) =>{
        if(err) 
            return res.status(400).json({ msg: 'error', err: "School no found" })
        const theYear = docs.schoolYears.find(year => year._id.equals(schoolYearId))
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

    if(!starDate || !endDate || !price || !schoolYearId)
        return res.status(400).json({ msg: 'error', err: "Data no complete" })

    schoolModel.findById(
        req.params.id,
        (err, docs) =>{
            if(err) 
                return res.status(400).json({ msg: 'error', err: "School no found" })
            const theYear = docs.schoolYears.find(year => year._id.equals(schoolYearId))
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



module.exports.createSchoolActor = (req, res) => {
    schoolModel.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                actors: {
                    role: req.body.role,
                    actif: req.body.actif,
                    userId: req.body.userId
                }
            }
        },
        { new: true },
        (err, docs) => {
            if (!err) res.status(200).json({ msg: 'success', docs })
            else res.status(400).json({ msg: 'error', err: "Actor no found" })
        }
    )
}

module.exports.updateYearSchool = (req, res) => {
    if(Object.keys(req.body).length === 0)
        return res.status(400).json({ msg: 'error', err: "No data" })

    const { starDateP, endDateP, starDateD, endDateD, status, price, starYear, endYear, schoolYearId, periodId, deadlineId, division, role, actif, userId, actorId } = req.body

    schoolModel.findById(
        req.params.id,
        (err, docs) => {
            if (err)
                return res.status(404).json({ msg: 'error', err: "School no found" })

            const _theSchoolYear = docs.schoolYears.find(schoolYear =>
                schoolYear._id.equals(schoolYearId),
            );

            if (role || actif != null || userId || actorId){
                const theActor = docs.actors.find(actor => actor._id.equals(actorId))
                
                if(!theActor) 
                    return res.status(404).json({ msg: 'error', err: "actor no found" })
                
                if (role) theActor.role = role;
                if (actif != null) theActor.actif = actif;
                if (userId) theActor.userId = userId;                    
            }

            if(!_theSchoolYear)
                return res.status(404).json({ msg: 'error', err: "Year no found" })

            if (starYear) {
                _theSchoolYear.starYear = starYear
            }

            if (endYear) {
                _theSchoolYear.endYear = endYear
            }


            if(division){
                _theSchoolYear.division = division
            }

            if (starDateP || endDateP || periodId  || status != null) {
                const thePeriods = _theSchoolYear.periods.find(period =>
                    period._id.equals(periodId),
                );
                if (!thePeriods) return res.status(404).json({ msg: 'error', err: "Period no found" })
                if (starDateP) thePeriods.starDate = starDateP;
                if (endDateP) thePeriods.endDate = endDateP;
                if (status !== null) thePeriods.status = status;
            }

            if (starDateD || endDateD || price) {
                const thedeadlines = _theSchoolYear.deadlines.find(deadline =>
                    deadline._id.equals(deadlineId),
                );
                if (!thedeadlines) return res.status(400).json({ msg: 'error', err: "daedline no found" })
                if (starDateD) thedeadlines.starDate = starDateD;
                if (endDateD) thedeadlines.endDate = endDateD;
                if (price) thedeadlines.price = price;
            }

            return docs.save(err => {
                if (!err) 
                    return res.status(200).json({ msg: 'success', docs });

                return res.status(500).json({ msg: 'error', err: "Internal error" })
            });
        })

}