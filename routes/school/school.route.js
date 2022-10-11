const schoolController = require('../../controllers/school/school.controller');

const router = require('express').Router();

router.post('/', schoolController.create);
router.get('/', schoolController.getAll);
router.get('/:id', schoolController.getOne);
router.put('/:id', schoolController.update);
router.delete('/:id', schoolController.remove);
router.delete('/soft/:id', schoolController.softDelete);

//year manager route
router.put('/year/:id', schoolController.createYearSchool);
router.put('/period/:id', schoolController.createYearSchoolPeriod);
router.put('/deadline/:id', schoolController.createYearSchoolDeadline);
router.patch('/year/update/:id', schoolController.updateYearSchool);

//school acces role manage route
router.put('/actor/:id', schoolController.createSchoolActor)


module.exports = router;