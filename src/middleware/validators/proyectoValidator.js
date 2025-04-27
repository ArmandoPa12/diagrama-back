const { body } = require('express-validator');
const prisma = require('../../utils/configPrisma');

exports.proyectoValidator = [

    body('nombre')
    .isString().withMessage('tiene que ser un string')
    .notEmpty().withMessage('el nombre de usuario es obligatorio')
    .isLength({ min: 3 }).withMessage('debe ser de al menos 3 caracteres')
    .custom(async(value) => {
        // console.log(value)
        const proyecto = await prisma.proyecto.findFirst({
            where: { nombre: value },
        });
        if (proyecto) {
            throw error('El nombre de proyecto ya existe');
        }
        return true;
    }).withMessage('El nombre de proyecto ya existe'),




    body('userId')
    .custom(async(value) => {
        const user = await prisma.usuario.findFirst({
            where: { id: value },
        });
        if (!user) {
            throw error('el usuario no existe');
        }
        return true;
    }).withMessage('el usuario no existe')

];