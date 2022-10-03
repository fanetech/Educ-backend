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
        return res.status(200).json({ msg: 'sucess', school })
    }
    catch (err) {
        return res.status(201).send({ msg: 'error', err })
    }
}

module.exports.getAll = async (req, res) => {
    schoolModel.find((err, schools) => {
        if (!err) return res.status(200).json({ msg: 'sucess', schools })
        else return res.status(201).send({ msg: 'error', err })
    }).sort({ createdAt: -1 })
}

module.exports.getOne = (req, res) => {
    const id = req.params.id
    schoolModel.findById(id, (err, school) => {
        if (school) return res.status(200).json({ msg: 'sucess', school })
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
            if (!err) res.status(200).json({ msg: 'sucess', docs })
            else res.status(201).json({ msg: 'error', err })
        }
    )
}

module.exports.remove = async (req, res) => {
    const id = req.params.id
    schoolModel.findByIdAndRemove(id, (err, docs) => {
        if (!err) res.status(200).json({ msg: 'sucess', docs })
        else res.status(201).json({ msg: 'error', err })
    })
}

module.exports.softDelete = async (req, res) => {
    schoolModel.findByIdAndUpdate(
        req.params.id,
        { $set: { isDeleted: true } },
        { new: true },
        (err, docs) => {
            if (!err) res.status(200).json({ msg: 'sucess', docs })
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
                        starDate: req.body.starDate,
                        endDate: req.body.endDate,
                        status: req.body.status
                    }

                }
            },
        },
        { new: true },
        (err, docs) => {
            if (!err) res.status(200).json({ msg: 'sucess', docs })
            else res.status(201).json({ msg: 'error', err })
        }
    )
}

module.exports.updateYearSchoolPeriod = async (req, res) => {
    const {starDate, endDate, status, schoolYearId, periodId} = req.body

    schoolModel.findById(req.params.id, (err, docs) => {
        const _theSchoolYear = docs.schoolYear.find(schoolYear =>
            schoolYear._id.equals(schoolYearId),
        );
        const thePeriod = _theSchoolYear.period.find(period =>
            period._id.equals(periodId),
        );
        if (!thePeriod) return res.status(404).send('Comment not found');
        if(starDate) thePeriod.starDate = starDate;
        if(endDate) thePeriod.endDate = endDate;
        if(status !=null) thePeriod.status = status;

        return docs.save(err => {
            if (!err) return res.status(200).json({ msg: 'sucess', docs });
            return res.status(201).json({ msg: 'error', err })
        });
    })
 
}

// schooling deadline manager
module.exports.createDeatline = async (req, res) => {
    schoolModel.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                schoolYear: {
                    deadline: {
                        starDate: req.body.starDate,
                        endDate: req.body.endDate,
                        price: req.body.price
                    }

                }
            },
        },
        { new: true },
        (err, docs) => {
            if (!err) res.status(200).json({ msg: 'sucess', docs })
            else res.status(201).json({ msg: 'error', err })
        }
    )
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
            if (!err) return res.status(200).json({ msg: 'sucess', docs });
            return res.status(201).json({ msg: 'error', err })
        });
    })
 
}