const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');



// get proyectos
exports.getProyecto = async(req, res) => {
    const { userId } = req.body;


    try {

        const proyectos = await prisma.usuario.findUnique({
            where: { id: userId },
            include: {
                proyectos: {
                    include: {
                        sala: true
                    }
                }
            }
        });


        if (!proyectos) {
            return res.status(404).json({ error: 'error en los proyectos dentro del try' });
        }


        res.json(proyectos.proyectos);
    } catch (error) {
        res.status(500).json({ error: 'error en los proyectos' });
    }


};


exports.getProyectoUno = async(req, res) => {
    const { userId, proyectoId } = req.body;
    console.log(userId, proyectoId);
    try {
        // const proyectos = await prisma.usuario.findUnique({
        //     where: { id: userId },
        //     include: {
        //         proyectos: true
        //     }

        // });


        const proyecto = await prisma.proyecto.findFirst({
            where: {
                id: proyectoId,
                usuarioId: userId
            }
        });

        // if (!proyecto) {
        //     return res.status(404).json({ error: 'error en los proyectos dentro del try' });
        // }


        res.json(proyecto);
    } catch (error) {
        res.status(500).json({ error: 'error en los proyectos' });
    }

};

//create
exports.createProyecto = async(req, res) => {
    const { nombre, userId, diagrama } = req.body;
    const diagramaCode = {
        class: "GraphLinksModel",
        nodeDataArray: [],
        linkDataArray: []
    };
    const arbol = null
    const jsonString = JSON.stringify([diagramaCode, arbol]);
    try {


        const nuevoProyecto = await prisma.proyecto.create({
            data: {
                nombre: nombre,
                usuarioId: userId,
                diagrama: jsonString
            }
        });

        res.status(201).json(nuevoProyecto);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//update
exports.updateProyecto = async(req, res) => {
    const { id } = req.params;
    const { nombre, diagrama } = req.body;

    try {
        const proyectoExistente = await prisma.proyecto.findUnique({ where: { id: Number(id) } });
        if (!proyectoExistente) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        const [diagramaNode, arbol] = diagrama;

        const proyectoActualizado = await prisma.proyecto.update({
            where: { id: Number(id) },
            data: {
                diagrama: JSON.stringify({ diagramaNode, arbol })
            }
        });

        res.status(200).json(proyectoActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.guardarImagenProyecto = async(req, res) => {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No se envió ninguna imagen.' });
    }

    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const fileName = `${Date.now()}_${file.originalname}`;
    const filePath = path.join(uploadsDir, fileName);

    // Asegurar que la carpeta exista
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }

    fs.writeFile(filePath, file.buffer, async(err) => {
        if (err) {
            console.error('Error al guardar la imagen:', err);
            return res.status(500).json({ error: 'Error al guardar la imagen.' });
        }

        const imageUrl = `/uploads/${fileName}`;

        try {
            const proyectoExistente = await prisma.proyecto.findUnique({
                where: { id: Number(id) }
            });

            if (!proyectoExistente) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }

            const proyectoActualizado = await prisma.proyecto.update({
                where: { id: Number(id) },
                data: {
                    imagenUrl: imageUrl // Asegúrate de que tu campo se llame así en Prisma
                }
            });

            res.status(200).json({
                mensaje: 'Imagen guardada y URL actualizada.',
                imageUrl: proyectoActualizado.imageUrl
            });

        } catch (error) {
            console.error('Error al actualizar el proyecto:', error);
            res.status(500).json({ error: 'Error al actualizar el proyecto.' });
        }
    });
};