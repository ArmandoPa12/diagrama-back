const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const generarCode = require('../utils/generarCode');

exports.crearSalaProyecto = async(req, res) => {

    const { proyectoId, usuarioId } = req.body;

    try {
        const codigo = generarCode();
        const nuevaSala = await prisma.sala.create({
            data: {
                codigo,
                proyecto: { connect: { id: proyectoId } },
                miembros: {
                    create: [{ usuarioId }]
                }
            },
            include: {
                miembros: true
            }
        });

        res.status(201).json({ message: 'Sala creada', sala: nuevaSala });

    } catch (error) {
        res.status(500).json({ message: 'Error al crear sala' });
    }

};

//get usuarios
exports.getColaboradores = async(req, res) => {
    const { proyectoId } = req.body;
    try {
        const usuarios = await prisma.usuario.findMany({
            where: {
                usuarioSalas: {
                    some: {
                        sala: {
                            proyectoId: proyectoId,
                        },
                    },
                },
            },
            select: {
                id: true,
                usuario: true,
            },
        });

        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'error en los proyectos' });
    }


};

exports.joinSalaProyecto = async(req, res) => {

    const { usuario, codigo } = req.body;

    try {

        const usuarioExiste = await prisma.usuario.findUnique({
            where: {
                usuario
            }
        });

        if (!usuarioExiste) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const sala = await prisma.sala.findUnique({
            where: {
                codigo,
            },
        });

        if (!sala) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }

        const usuarioSala = await prisma.usuarioSala.findFirst({
            where: {
                usuarioId: usuarioExiste.id,
                salaId: sala.id,
            },
        });

        if (usuarioSala) {
            return res.status(200).json({ message: 'Ya estás en esta sala' });
        }

        await prisma.usuarioSala.create({
            data: {
                usuarioId: usuarioExiste.id,
                salaId: sala.id,
            },
        });

        res.status(200).json({ message: 'Unido a la sala con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al unirse a la sala' });
    }

};


exports.joinColaborador = async(req, res) => {

    const { usuarioId, codigo } = req.body;

    try {
        const sala = await prisma.sala.findUnique({
            where: { codigo },
            include: {
                proyecto: true,
                miembros: true
            }
        });
        if (!sala) {
            return res.status(404).json({ message: 'Sala no encontrada' });
        }
        if (sala.proyecto.usuarioId === usuarioId) {
            return res.status(400).json({ message: 'Ya eres el creador del proyecto' });
        }
        const esMiembro = sala.miembros.some(m => m.usuarioId === usuarioId);
        if (!esMiembro) {
            return res.status(403).json({ message: 'No tienes acceso a esta sala' });
        }
        return res.status(200).json({ message: 'Acceso permitido a la sala' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al unirse a la sala' });
    }

};


// prueba

exports.prueba = async(req, res) => {

    const { codigo } = req.body;

    try {

        const consulta = await prisma.sala.findUnique({
            where: {
                codigo: codigo
            },
            include: {
                proyecto: true
            }
        });

        if (!consulta) {
            return res.status(404).json({ message: 'proyecto no encontrada' });
        }

        res.status(200).json(consulta);

    } catch (error) {
        res.status(500).json({ message: 'Error al crear sala' });
    }

};