const schoolModel = require("../../models/school.model");
const { ACTORS_ROLE, DIVISION, DIVISION_VALUE, STATUS_CODE } = require("../../services/constant");
const utilsError = require("../../utils/utils.errors");
const utilsTools = require("../../utils/utils.tools");
const { createDirectory, createFile } = require("../files/directory.service");
const schoolService = require("./school.services")
const handleError = require("../../services/handleError")
const userService = require("../user/user.service")
const directorySchama = require("../../models/directory.model")

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
      if (!err){

        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, schools));
      }
      else {
        console.log("school_getAll_error =>", err)
        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));
      }
    })
    .sort({ createdAt: -1 }).populate("schoolYears.classroomIds", ["name", "totalPupil"]).populate("actors.userId", ["userName", "firstName", "lastName", "number", "email"]);
};

module.exports.getOne = async (req, res) => {

  const id = req.params.id;
  const response = await schoolService.getOne(id)
   return await utilsError.globalSatuts(res, response);
   
};


module.exports.getSchoolOfUser = async (req, res) => {

  const userId= req.params.userId 
  
  if (!userId) {

    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "utilisateur"));
  }

  try {
    
    const userSchools = await schoolModel.find({
      actors: {
        $elemMatch: {
          userId: userId,
        },
      },
    })
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, userSchools));
  } catch (error) {
    
    console.log("school_getSchoolOfUser_error =>", error)
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));
  }
};

module.exports.remove = async (req, res) => {
  const id = req.params.id;

  const response = await schoolService.remove(id)

   return await utilsError.globalSatuts(res, response);
};

module.exports.softDelete = async (req, res) => {
  schoolModel.findByIdAndUpdate(
    req.params.id,
    { $set: { isDeleted: true } },
    { new: true },
    (err, school) => {

      if (!err){
        
        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, null, "ok"));
      } 
      else{
        console.log("school_softDelete_error =>", err)
        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));
      } 
    }
  );
};

/********************To Manage school year**************************/

module.exports.createYearSchool = async (req, res) => {

  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }
  const { starYear, endYear, division, nDivision } = req.body;

  if (!starYear || !endYear || !division) {
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, "date ou division"));
  }

  const _division = DIVISION.find(d => d === division)

  if (!_division) {
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "utiliser: "+DIVISION.toString()));
  }

  const fullYear = `${utilsTools.parseDate(starYear).getFullYear()}-${utilsTools.parseDate(
    endYear
  ).getFullYear()}`;

  let _nDivison;
  if (division === "others") {
    if (!nDivision)
      return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "nombre de division"));
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
      if (school){

        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, utilsTools.getCurrentObject(school.schoolYears)));
      }
      else{

        console.log("school_createYearSchool_error =>", err)

        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement"));
      }
    }
  );
};

module.exports.createYearSchoolPeriod = async (req, res) => {

  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }

  const { starDate, endDate, status, schoolYearId } = req.body;

  if (!starDate || !endDate || status == null || !schoolYearId) {
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "date ou statut"));
  }

  schoolModel.findById(req.params.id, (err, docs) => {
    if (!docs) {
      return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement"));
    }
    const theYear = docs.schoolYears.find((year) =>
      year._id.equals(schoolYearId)
    );
    if (!theYear) {
      return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "année scolaire"));
    }

    const getSchoolYearLength = theYear.periods.length;
    if (getSchoolYearLength >= theYear.nDivision)
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, "vous essayez de dépassé le nombre de division fixé. Verifier votre division"));

    theYear.periods.push({
      starDate: starDate,
      endDate: endDate,
      status: status,
    });

    docs.save((err) => {
      if (!err) {
        
        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, utilsTools.getCurrentObject(theYear.periods) ));
      }
      console.log("school_createYearSchoolPeriod_error =>", err)
      return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));
    });
  });
};

module.exports.createYearSchoolDeadline = async (req, res) => {

  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }

  const { starDate, endDate, price, schoolYearId } = req.body;

  if (!starDate || !endDate || !price || !schoolYearId) {
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "date ou prix"));
  }

  schoolModel.findById(req.params.id, (err, docs) => {

    if (!docs){

      return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement"));
    }

    const theYear = docs.schoolYears.find((year) =>
      year._id.equals(schoolYearId)
    );

    if (!theYear) {
      return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "Année scolaire"));
    }
    theYear.deadlines.push({
      starDate: starDate,
      endDate: endDate,
      price: price,
    });

    docs.save((err) => {
      if (!err){

        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS,  utilsTools.getCurrentObject(theYear.deadlines)));
      }

      return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));
    });
  });
};

/****************************** Manage school actor******************************/ 

module.exports.createSchoolActor = async(req, res) => {

  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }

  const { role, actif, userId } = req.body;
  if (!role || actif == null || !userId) {
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "role ou statut(actif)"));
  }
  const _role = ACTORS_ROLE.find(ar => ar === role)
  if (!_role) {

    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "role incorect utiliser: "+ACTORS_ROLE.toString()));
  }

  const user = await userService.getById(userId);
  if(!user?.send?.docs){

    return utilsError.globalSatuts(res, user);
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
        if (docs){

          return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, utilsTools.getCurrentObject(docs.actors)));
        }
        else{
          console.log("school_createSchoolActor_error =>", err)
          return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, "établissement"));
        }
      }
    ).populate("actors.userId", ["userName", "firstName", "lastName", "number", "email"]);
};

/****************************** libary management **********************************/

module.exports.createLibrary = async (req, res) => {

  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }
  
  const { name, categorie } = req.body;

  try {
    if(!name ){
      return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "nom du dossier"));
    }
  
    const type = "school";
  
    const creatorId = req.params.id;
  
    schoolModel.findById(creatorId, async (err, school) => {
  
      if (err) {
  
          return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, "établissement"));
        }
  
      if (!school){
  
          return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement"));
        }
  
      const library = school.library;
  
      const d = {
        name,
        type,
        creatorId,
        categorie
      };
      const cd = await createDirectory(d);
  
      if (cd?.send?.docs) {
  
        library.name = name;
  
        library.documentId = cd?.send?.docs?._id;
  
       const s = await school.save();

          if (s){
            
            return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, cd?.send?.docs ));
          }
          const d = directorySchama.findByIdAndRemove(newDirectory);
          return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));

      } else {

        return utilsError.globalSatuts(res, cd);
      }
    });

  } catch (error) {

    console.log("school_createLibrary_error", error)
    const d = directorySchama.findByIdAndRemove(newDirectory);
    return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));
  }
  
};

module.exports.createLibraryFile = async (req, res) => {

  const reqAnalityc = utilsTools.checkRequest(req)

  if(reqAnalityc !== 1){
    return await utilsError.globalSatuts(res, reqAnalityc)
  }
  // TODO control required variable

  schoolModel.findById(req.params.id, async (err, school) => {

    if (!school){
      return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement"));
    }

    const library = school.library;
    const newSize = library.size + req?.body?.size;

    if (newSize > 200000000) {

        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR, null, "Capacité de stockage gratuit attient"));
    }

    const fileCreateParams = {
      ...req.body,
      creatorId: school._id
    }

    const f = await createFile(fileCreateParams, req?.body?.directoryId);

    if (f?.send?.docs) {

      library.size = newSize;

      school.save((err) => {
        if (!err){

          return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.SUCCESS, f?.send?.docs));
        }
            
        return utilsError.globalSatuts(res, handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR));

      });
    } else {

      return utilsError.globalSatuts(res, f);
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

