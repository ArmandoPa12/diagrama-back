const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const { proyectoValidator } = require('../middleware/validators/proyectoValidator');
const { validateRequest } = require('../middleware/validateRequest');
const multer = require('multer');
const upload = multer();

router.post('/lista', proyectoController.getProyecto);
router.post('/uno', proyectoController.getProyectoUno);
router.post('/', proyectoValidator, validateRequest, proyectoController.createProyecto);
router.post('/:id', proyectoController.updateProyecto);
// router.post('/:id/imagen', proyectoController.guardarImagenProyecto);
router.post('/:id/imagen', upload.single('imagenData'), proyectoController.guardarImagenProyecto);



module.exports = router;