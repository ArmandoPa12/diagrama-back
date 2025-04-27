const express = require('express');
const router = express.Router();
const salaController = require('../controllers/salaController');
const { salaValidator } = require('../middleware/validators/salaValidator');
const { validateRequest } = require('../middleware/validateRequest');


// router.post('/lista', proyectoController.getProyecto);
// router.post('/', proyectoValidator, validateRequest, proyectoController.createProyecto);
// router.post('/:id', proyectoController.updateProyecto);
router.post('/', salaValidator, validateRequest, salaController.crearSalaProyecto);
router.post('/unirse', salaController.joinSalaProyecto);
router.post('/colaboradores', salaController.getColaboradores);
router.post('/sala-unirse', salaController.joinColaborador);
router.post('/example', salaController.prueba);




module.exports = router;