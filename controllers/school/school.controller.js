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
    console.log(req.body)
    schoolModel.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                schoolYear: {
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

module.exports.updateYearSchool = (req, res) => {
    const { starDateP, endDateP, starDateD, endDateD, status, price, year, schoolYearId, periodId, deadlineId } = req.body

    schoolModel.findById(
        req.params.id,
        (err, docs) => {
            if (err) res.status(201).json({ msg: 'error', err })
            const _theSchoolYear = docs.schoolYear.find(schoolYear =>
                schoolYear._id.equals(schoolYearId),
            );

            if (year) {
                _theSchoolYear.year = year
            }

            if (starDateP || endDateP || status !== null) {
                const thePeriod = _theSchoolYear.period.find(period =>
                    period._id.equals(periodId),
                );
                if (!thePeriod) return res.status(404).send('Comment not found');
                if (starDateP) thePeriod.starDate = starDateP;
                if (endDateP) thePeriod.endDate = endDateP;
                if (status !== null) thePeriod.status = status;
            }

            if (starDateD || endDateD || price) {
                const thedeadline = _theSchoolYear.deadline.find(deadline =>
                    deadline._id.equals(deadlineId),
                );
                if (!thedeadline) return res.status(404).send('Comment not found');
                if (starDateD) thedeadline.starDate = starDateD;
                if (endDateD) thedeadline.endDate = endDateD;
                if (price) thedeadline.price = price;
            }

            return docs.save(err => {
                if (!err) return res.status(200).json({ msg: 'success', docs });
                return res.status(201).json({ msg: 'error', err })
            });
        })

}

module.exports.createYearSchoolPeriod = async (req, res) => {
    schoolModel.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                period: {
                    starDate: req.body.starDate,
                }
            },
        },
        { new: true },
        (err, docs) => {
            if (!err) res.status(200).json({ msg: 'success', docs })
            else res.status(500).json({ msg: 'error', err })
        }
    )
}

module.exports.createYearSchoolDeadline = async (req, res) => {
    schoolModel.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                deadline: {
                    starDate: req.body.starDate,
                    endDate: req.body.endDate,
                    price: req.body.price
                }
            },
        },
        { new: true },
        (err, docs) => {
            if (!err) res.status(200).json({ msg: 'success', docs })
            else res.status(500).json({ msg: 'error', err })
        }
    )
}

// To manage user role to school

module.exports.createSchoolActor = (req, res) => {
    schoolModel.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                actor: {
                    role: req.body.role,
                    actif: req.body.actif,
                    userId: req.body.userId
                }
            }
        },
        { new: true },
        (err, docs) => {
            if (!err) res.status(200).json({ msg: 'success', docs })
            else res.status(201).json({ msg: 'error', err })
        }
    )
}

module.exports.updateSchoolActor = (req, res) => {
    if (!req.body) res.status(404).json({ msg: 'error', err: "Aucun donnée n'est envoyer" })
    const { role, actif, userId, actorId } = req.body
    schoolModel.findById(
        req.params.id,
        (err, docs) => {
            if (err) res.status(404).json({ msg: 'error', err })
            const theActor = docs.actor.find(actor =>
                actor._id.equals(actorId))
            if (theActor) {
                if (role) theActor.role = role;
                if (actif !== null) theActor.actif = actif;
                if (userId) theActor.userId = userId;
            }
            else
                res.status(404).json({ msg: 'error', err: 'Actor no trouvé' })

            return docs.save(err => {
                if (!err) return res.status(200).json({ msg: 'success', docs });
                return res.status(500).json({ msg: 'error', err })
            });

        }
    )
}