const prisma = require('../utils/configPrisma');

module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log("nuevo conectado", socket.id);

        socket.on("join-room", async({ codigo, usuario }) => {
            socket.join(codigo);
            try {
                const consulta = await prisma.sala.findUnique({
                    where: {
                        codigo: codigo
                    },
                    include: {
                        proyecto: true
                    }
                });

                if (consulta.proyecto && consulta.proyecto.diagrama) {
                    socket.emit("load-diagram", { payload: consulta.proyecto.diagrama, data: consulta.proyecto });
                }
            } catch (error) {
                console.error("error al obtener el diagrama:", error);
            }

            socket.to(codigo).emit("user-joined", { usuario });

        });

        socket.on("add-node", async({ codigo, diagrama }) => {
            try {
                const sala = await prisma.sala.findUnique({
                    where: { codigo },
                    include: { proyecto: true }
                });

                if (!sala || !sala.proyecto) return;
                const [diagramaNode, arbol] = diagrama;

                const actualizado = await prisma.proyecto.update({
                    where: { id: sala.proyectoId },
                    data: {
                        diagrama: JSON.stringify({ diagramaNode, arbol })
                    }
                });
                socket.to(codigo).emit("add-node", diagrama);

                socket.to(codigo).emit("update-diagram", { payload: actualizado.diagrama });

            } catch (error) {
                console.error("error al guardar el diagrama:", error);
            }
        });


        socket.on("save-diagram", async({ codigo, diagrama }) => {
            try {
                const sala = await prisma.sala.findUnique({
                    where: { codigo },
                    include: { proyecto: true }
                });

                if (!sala || !sala.proyecto) return;

                const actualizado = await prisma.proyecto.update({
                    where: { id: sala.proyectoId },
                    data: {
                        diagrama: JSON.stringify(diagrama)
                    }
                });

                socket.to(codigo).emit("update-diagram", { payload: actualizado });

            } catch (error) {
                console.error("error al guardar el diagrama:", error);
            }
        });

        socket.on("move-node", (data) => {
            socket.to(data.codigo).emit("move-node", data);
        });

        socket.on('disconnect', async() => {
            console.log("usuario desconectado:", socket.id);

        });

    });

};