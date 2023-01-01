const { response } = require("express");
const schoolModel = require("../../models/school.model");
const userModel = require("../../models/user.model");
const UserModel = require("../../models/user.model");

module.exports.create = async (req, res) => {
  const { schoolName, slogan, founderId } = req.body;
  if (!schoolName || !slogan || !founderId) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }
  let newSchool;

  newSchool = new schoolModel({
    schoolName,
    slogan,
    founderId,
  });
  const school = await newSchool.save();
  if (!school._id)
    return res.status(500).json({ msg: "error", err: "Internal error" });

  userModel.findByIdAndUpdate(
    founderId,
    {
      $push: {
        school: {
          userId: founderId,
          role: "founder",
        },
      },
    },
    { new: true },
    (err, _) => {
      if (err) {
        schoolModel.findByIdAndRemove(school._id, (err, _) => {
          if (err) {
            console.log("error to delete school", err);
            return res
              .status(500)
              .json({ msg: "error", err: "Internal error" });
          }
          return res
            .status(404)
            .json({ msg: "error", err: "founderId no found" });
        });
      } else return res.status(200).json({ msg: "success", school });
    }
  );
};

module.exports.getAll = async (req, res) => {
  schoolModel
    .find((err, schools) => {
      if (!err) return res.status(200).json({ msg: "success", schools });
      else return res.status(500).send({ msg: "error", err });
    })
    .sort({ createdAt: -1 });
};

module.exports.getOne = (req, res) => {
  const id = req.params.id;
  schoolModel.findById(id, (err, school) => {
    if (school) return res.status(200).json({ msg: "success", school });
    else return res.status(201).json({ msg: "err", err: "no found" });
  });
};

module.exports.update = async (req, res) => {
  const id = req.params.id;
  const updateRecord = {
    schoolName: req.body.schoolName,
    slogan: req.body.slogan,
    logo: req.body.logo,
    founderName: req.body.founderName,
  };
  schoolModel.findByIdAndUpdate(
    id,
    { $set: updateRecord },
    { new: true },
    (err, school) => {
      if (!err) res.status(200).json({ msg: "success", school });
      else res.status(201).json({ msg: "error", err });
    }
  );
};

module.exports.remove = async (req, res) => {
  const id = req.params.id;
  schoolModel.findByIdAndRemove(id, (err, school) => {
    if (err)
      return res.status(500).json({ msg: "error", err: "internal error" });
    if (!school)
      return res.status(404).json({ msg: "error", err: "school no found" });
    return res.status(200).json({ msg: "success" });
  });
};

module.exports.softDelete = async (req, res) => {
  schoolModel.findByIdAndUpdate(
    req.params.id,
    { $set: { isDeleted: true } },
    { new: true },
    (err, school) => {
      if (!err) res.status(200).json({ msg: "success" });
      else res.status(201).json({ msg: "error", err });
    }
  );
};

// To Manage school year
module.exports.createYearSchool = async (req, res) => {
  const { starYear, endYear, division } = req.body;

  if (!starYear || !endYear || !division) {
    return res.status(400).json({ msg: "error", err: "Data no complete" });
  }
  schoolModel.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        schoolYears: {
          starYear: req.body.starYear,
          endYear: req.body.endYear,
          division: req.body.division,
        },
      },
    },
    { new: true },
    (err, school) => {
      if (!err) return res.status(200).json({ msg: "success", school });
      else
        return res
          .status(500)
          .json({ msg: "error", err: "Internal error or school no found" });
    }
  );
};

module.exports.createYearSchoolPeriod = async (req, res) => {
  const { starDate, endDate, status, schoolYearId } = req.body;

  if (!starDate || !endDate || status == null || !schoolYearId) {
    return res.status(400).json({ msg: "error", err: "Data no complete" });
  }

  schoolModel.findById(req.params.id, (err, docs) => {
    if (err) {
      return res.status(404).json({ msg: "error", err: "School no found" });
    }
    const theYear = docs.schoolYears.find((year) =>
      year._id.equals(schoolYearId)
    );
    if (!theYear) {
      return res
        .status(404)
        .json({ msg: "error", err: "School year no found" });
    }
    theYear.periods.push({
      starDate: starDate,
      endDate: endDate,
      status: status,
    });

    docs.save((err) => {
      if (!err) return res.status(200).json({ msg: "success", docs });
      return res.status(500).json({ msg: "error", err: "Internal error" });
    });
  });
};

module.exports.createYearSchoolDeadline = async (req, res) => {
  const { starDate, endDate, price, schoolYearId } = req.body;

  if (!starDate || !endDate || !price || !schoolYearId) {
    return res.status(400).json({ msg: "error", err: "Data no complete" });
  }

  schoolModel.findById(req.params.id, (err, docs) => {
    if (err)
      return res.status(404).json({ msg: "error", err: "School no found" });
    const theYear = docs.schoolYears.find((year) =>
      year._id.equals(schoolYearId)
    );
    if (!theYear) {
      return res
        .status(404)
        .json({ msg: "error", err: "School year no found" });
    }
    theYear.deadlines.push({
      starDate: starDate,
      endDate: endDate,
      price: price,
    });

    docs.save((err) => {
      if (!err) return res.status(200).json({ msg: "success", docs });
      return res.status(500).json({ msg: "error", err: "Internal error" });
    });
  });
};

// Manage school actor
module.exports.createSchoolActor = (req, res) => {
  const { role, actif, userId } = req.body;
  if (!role || actif == null || !userId) {
    return res.status(400).json({ msg: "error", err: "Data no complete" });
  }
  schoolModel.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        actors: {
          role: role,
          actif: actif,
          userId: userId,
        },
      },
    },
    { new: true },
    (err, docs) => {
      if (!err) res.status(200).json({ msg: "success", docs });
      else
        res
          .status(500)
          .json({ msg: "error", err: "Internal error or Actor no found" });
    }
  );
};

//update school object
module.exports.updateSchool = (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });

  const {
    starDateP,
    endDateP,
    starDateD,
    endDateD,
    status,
    price,
    starYear,
    endYear,
    schoolYearId,
    periodId,
    deadlineId,
    division,
    role,
    actif,
    userId,
    actorId,
  } = req.body;

  schoolModel.findById(req.params.id, (err, docs) => {
    if (err)
      return res.status(404).json({ msg: "error", err: "School no found" });

    if (role || actif != null || userId || actorId) {
      const theActor = docs.actors.find((actor) => actor._id.equals(actorId));

      if (!theActor)
        return res.status(404).json({ msg: "error", err: "actor no found" });

      if (role) theActor.role = role;
      if (actif != null) theActor.actif = actif;
      if (userId) theActor.userId = userId;
    }

    if (
      starYear ||
      endYear ||
      division ||
      starDateP ||
      endDateP ||
      periodId ||
      status != null ||
      starDateD ||
      endDateD ||
      price
    ) {
      const _theSchoolYear = docs.schoolYears.find((schoolYear) =>
        schoolYear._id.equals(schoolYearId)
      );
      if (!_theSchoolYear)
        return res.status(404).json({ msg: "error", err: "Year no found" });

      if (starYear) {
        _theSchoolYear.starYear = starYear;
      }

      if (endYear) {
        _theSchoolYear.endYear = endYear;
      }

      if (division) {
        _theSchoolYear.division = division;
      }

      if (starDateP || endDateP || periodId || status != null) {
        const thePeriods = _theSchoolYear.periods.find((period) =>
          period._id.equals(periodId)
        );
        if (!thePeriods)
          return res.status(404).json({ msg: "error", err: "Period no found" });
        if (starDateP) thePeriods.starDate = starDateP;
        if (endDateP) thePeriods.endDate = endDateP;
        if (status !== null) thePeriods.status = status;
      }

      if (starDateD || endDateD || price) {
        const thedeadlines = _theSchoolYear.deadlines.find((deadline) =>
          deadline._id.equals(deadlineId)
        );
        if (!thedeadlines)
          return res
            .status(400)
            .json({ msg: "error", err: "daedline no found" });
        if (starDateD) thedeadlines.starDate = starDateD;
        if (endDateD) thedeadlines.endDate = endDateD;
        if (price) thedeadlines.price = price;
      }
    }
    return docs.save((err) => {
      if (!err) return res.status(200).json({ msg: "success", docs });

      return res.status(500).json({ msg: "error", err: "Internal error" });
    });
  });
};

//service
module.exports.getSchoolOfUser = async (req, res) => {
  if (!req.body.userId) {
    return res.status(400).json({ msg: "error", err: "Data no complete" });
  }
  const userSchools = await schoolModel.find({
    actors: {
      $elemMatch: {
        userId: req.body.userId,
      },
    },
  });
  return res.status(200).json({ msg: "success", userSchools });
};
