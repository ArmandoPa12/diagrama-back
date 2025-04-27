const { body } = require('express-validator');
const prisma = require('../../utils/configPrisma');


exports.createUserValidator = [
    body('usuario')
    .matches(/^[A-Za-z][A-Za-z0-9]*$/).withMessage('El nombre de usuario debe comenzar por una letra y solo puede contener letras y números')
    .isString().withMessage('tiene que ser un string')
    .notEmpty().withMessage('el nombre de usuario es obligatorio')
    .custom(async(value) => {
        const user = await prisma.usuario.findUnique({
            where: { usuario: value },
        });
        if (user) {
            throw error('el nombre de usario ya existe');
        }
        return true;
    }).withMessage('el nombre de usuario ya existe')
    .isLength({ min: 3 }).withMessage('debe ser de al menos 3 caracteres'),

    // -----------------------------------------------------
    body('email')
    .isEmail().withMessage('Debe ser un email válido')
    .custom(async(value) => {
        const email = await prisma.usuario.findUnique({
            where: { email: value }
        })
        if (email) {
            throw error('el email ya existe');
        }
        return true;
    }).withMessage('el email ya existe'),

    // -----------------------------------------------------
    body('password')
    .isLength({ min: 3 }).withMessage('La contraseña debe tener al menos 3 caracteres'),

];