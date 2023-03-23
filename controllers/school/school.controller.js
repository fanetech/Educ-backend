const schoolModel = require("../../models/school.model");
const userModel = require("../../models/user.model");
const { ACTORS_ROLE, DIVISION, DIVISION_VALUE } = require("../../services/constant");
const utilsError = require("../../utils/utils.errors");
const utilsTools = require("../../utils/utils.tools");
const { createDirectory, createFile } = require("../files/directory.service");
const schoolService = require("./school.services")

module.exports.create = async (req, res) => {
  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }

  const response = await schoolService.create(req.body)

  return await utilsError.globalSatuts(res, response)
};

module.exports.getAll = async (req, res) => {
  schoolModel
    .find((err, schools) => {
      if (!err) return res.status(200).json({ msg: "success", docs: schools });
      else return res.status(500).send({ msg: "error", err });
    })
    .sort({ createdAt: -1 }).populate("schoolYears.classroomIds", ["name", "totalPupil"]).populate("actors.userId", ["userName", "firstName", "lastName", "number", "email"]);
};

module.exports.getOne = async (req, res) => {

  const id = req.params.id;
  const response = await schoolService.getOne(id)
   return await utilsError.globalSatuts(res, response);
   
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
      if (!err) res.status(200).json({ msg: "success", docs: school });
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
  const { starYear, endYear, division, nDivision } = req.body;

  if (!starYear || !endYear || !division) {
    return res.status(400).json({ msg: "error", err: "Data no complete" });
  }

  const _division = DIVISION.find(d => d === division)

  if (!_division) {
    return res.status(400).json({ msg: "error", err: "division incorect. use this: " + DIVISION });
  }

  const fullYear = `${utilsTools.parseDate(starYear).getFullYear()}-${utilsTools.parseDate(
    endYear
  ).getFullYear()}`;

  let _nDivison;
  if (division === "others") {
    if (!nDivision)
      return res.status(400).json({ msg: "error", err: "nDivision is required for others" });
    _nDivison = nDivision
  } else {
    _nDivison = DIVISION_VALUE[division]
  }
  schoolModel.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        schoolYears: {
          fullYear,
          starYear: starYear,
          endYear: endYear,
          division: division,
          nDivision: _nDivison
        },
      },
    },
    { new: true },
    (err, school) => {
      if (!err) return res.status(200).json({ msg: "success", docs: utilsTools.getCurrentObject(school.schoolYears) });
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

    const getSchoolYearLength = theYear.periods.length;
    if (getSchoolYearLength >= theYear.nDivision)
      return res
        .status(400)
        .json({ msg: "error", err: "school year division is complete" });

    theYear.periods.push({
      starDate: starDate,
      endDate: endDate,
      status: status,
    });

    docs.save((err) => {
      if (!err) return res.status(200).json({ msg: "success", docs: utilsTools.getCurrentObject(theYear.periods) });
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
      if (!err) return res.status(200).json({ msg: "success", docs: utilsTools.getCurrentObject(theYear.deadlines) });
      return res
        .status(500)
        .json({ msg: "error", err: "Internal error", error: err });
    });
  });
};

// Manage school actor
module.exports.createSchoolActor = (req, res) => {
  const { role, actif, userId } = req.body;
  if (!role || actif == null || !userId) {
    return res.status(400).json({ msg: "error", err: "Data no complete" });
  }
  const _role = ACTORS_ROLE.find(ar => ar === role)
  if (!_role) {
    return res.status(400).json({ msg: "error", err: "role incorect. use this: " + ACTORS_ROLE });
  }
  schoolModel
    .findByIdAndUpdate(
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
        if (!err) res.status(200).json({ msg: "success",  docs: utilsTools.getCurrentObject(docs.actors) });
        else
          res
            .status(500)
            .json({ msg: "error", err: "Internal error or Actor no found" });
      }
    ).populate("actors.userId", ["userName", "firstName", "lastName", "number", "email"]);
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
  })
  return res.status(200).json({ msg: "success", docs: userSchools });
};

//libary management
module.exports.createLibrary = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });
  // TODO control required variable
  const { name } = req.body;
  const type = "school";
  const depth = 0;
  const creatorId = req.params.id;

  if (!name) {
    return res.status(400).json({ msg: "error", err: "Data no complete" });
  }
  schoolModel.findById(creatorId, async (err, school) => {
    if (err)
      return res.status(500).json({ msg: "error", err: "Internal Error" });
    if (!school)
      return res.status(404).json({ msg: "error", err: "School no found" });
    const library = school.library;
    const d = {
      ...req.body,
      depth,
      type,
      creatorId,
    };
    const cd = await createDirectory(d);
    if (cd?.send?.msg === "success") {
      library.name = name;
      library.documentId = cd?.send?.directory?._id;
      school.save((err) => {
        if (!err)
          return res
            .status(200)
            .json({ msg: "success", school, docs : cd?.send?.directory });
        return res.status(500).json({ msg: "error", err: err });
      });
    } else {
      return res
        .status(404)
        .json({ msg: "error", err: "directory create error" });
    }
  });
};

module.exports.createLibraryFile = (req, res) => {
  schoolModel.findById(req.params.id, async (err, school) => {
    if (err)
      return res.status(500).json({ msg: "error", err: "Internal Error" });
    if (!school)
      return res.status(404).json({ msg: "error", err: "School no found" });
    const library = school.library;
    const newSize = library.size + req?.body?.size;
    if (newSize > 200000000) {
      return res
        .status(406)
        .json({ msg: "error", err: "Capacité de stockage gratuit attient" });
    }
    const cd = await createFile(req.body, req?.body?.creatorId);
    if (cd?.send?.msg === "success") {
      library.size = newSize;
      school.save((err) => {
        if (!err)
          return res
            .status(200)
            .json({ msg: "success", school, docs: cd?.send?.directory });
        return res.status(500).json({ msg: "error", err });
      });
    } else {
      return res.status(404).json({
        msg: "error",
        err: "directory create error",
        errorDetail: cd?.send?.err,
      });
    }
  });
};

module.exports.updateSchool = async (req, res) => {
  
  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }

  const response = await schoolService.updateSchool(req.params.id, req.body)

  return await utilsError.globalSatuts(res, response)

}

module.exports.updateSchoolYear = async (req, res) => {
  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }

  const response = await schoolService.updateSchoolYear(req.params.id, req.body)

  return await utilsError.globalSatuts(res, response)

}

module.exports.updateSchoolYearPeriod = async (req, res) => {
  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }

  const response = await schoolService.updateSchoolYearPeriod(req.params.id, req.body)

  return await utilsError.globalSatuts(res, response)

}

module.exports.updateSchoolActor = async (req, res) => {
  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }

  const response = await schoolService.updateSchoolActor(req.params.id, req.body)

  return await utilsError.globalSatuts(res, response)

}

module.exports.updateSchoolYearDeadline = async (req, res) => {
  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }

  const response = await schoolService.updateSchoolYearDeadline(req.params.id, req.body)

  return await utilsError.globalSatuts(res, response)

}

