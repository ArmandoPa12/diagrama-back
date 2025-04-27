const { body } = require('express-validator');
const prisma = require('../../utils/configPrisma');


exports.salaValidator = [

    body('proyectoId')
    .isInt().withMessage('El proyectoId debe ser un número entero')
    .custom(async(proyectoId, { req }) => {
        const usuarioId = req.body.usuarioId;

        const proyecto = await prisma.proyecto.findUnique({
            where: { id: proyectoId }
        });

        if (!proyecto) {
            throw new Error('El proyecto no existe');
        }

        if (proyecto.usuarioId !== usuarioId) {
            throw new Error('No tienes permiso para crear una sala en este proyecto');
        }

        const salaExistente = await prisma.sala.findUnique({
            where: { proyectoId }
        });

        if (salaExistente) {
            throw new Error('Ya existe una sala para este proyecto');
        }

        return true;
    }),

    // Validar usuarioId
    body('usuarioId')
    .isInt().withMessage('El usuarioId debe ser un número entero')
    .custom(async(usuarioId) => {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId }
        });

        if (!usuario) {
            throw new Error('El usuario no existe');
        }

        return true;
    }),
];