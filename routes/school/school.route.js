const schoolController = require('../../controllers/school/school.controller');

const router = require('express').Router();

router.post('/', schoolController.create);
router.get('/', schoolController.getAll);
router.get('/:id', schoolController.getOne);
router.put('/:id', schoolController.update);
router.delete('/:id', schoolController.remove);
router.delete('/soft/:id', schoolController.softDelete);

//year and period route
router.put('/period/:id', schoolController.createYearSchoolPeriod);
router.patch('/period/update/:id', schoolController.updateYearSchoolPeriod);

//deadline route
router.put('/deadline/:id', schoolController.createDeatline);
router.patch('/deadline/update/:id', schoolController.updateDeatline);

module.exports = router;