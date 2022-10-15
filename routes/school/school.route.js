const schoolController = require('../../controllers/school/school.controller');

const router = require('express').Router();

router.post('/', schoolController.create);
router.get('/', schoolController.getAll);
router.get('/:id', schoolController.getOne);
router.put('/:id', schoolController.update);
router.delete('/:id', schoolController.remove);
router.delete('/soft/:id', schoolController.softDelete);

//year route
router.put('/year/:id', schoolController.createYearSchool);
router.put('/year/period/:id', schoolController.createYearSchoolPeriod);
router.put('/year/deadline/:id', schoolController.createYearSchoolDeadline);
router.patch('/period/update/:id', schoolController.updateYearSchoolPeriod);

// school actor
router.put('/actor/:id', schoolController.createSchoolActor);


module.exports = router;