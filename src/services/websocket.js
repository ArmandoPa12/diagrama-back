const prisma = require('../utils/configPrisma');

module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log("🧠 Usuario conectado:", socket.id);

        socket.on("join-room", async({ codigo, usuario }) => {
            socket.join(codigo);

            console.log(`${usuario} se unió a la sala ${codigo}`);
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
                    console.log("📦 Diagrama enviado al nuevo usuario.");
                } else {
                    console.log("No se encontró el proyecto o no tiene diagrama.");
                }
            } catch (error) {
                console.error("Error al obtener el diagrama:", error);
            }

            // Notifica a los demás en la sala
            socket.to(codigo).emit("user-joined", { usuario });

        });

        socket.on("add-node", async({ codigo, diagrama }) => {
            try {
                const sala = await prisma.sala.findUnique({
                    where: { codigo },
                    include: { proyecto: true }
                });

                if (!sala || !sala.proyecto) return;
                console.log(diagrama)
                const [diagramaNode, arbol] = diagrama;

                const actualizado = await prisma.proyecto.update({
                    where: { id: sala.proyectoId },
                    data: {
                        diagrama: JSON.stringify({ diagramaNode, arbol })
                    }
                });

                // Si se guarda correctamente, lo emites a los demás
                socket.to(codigo).emit("add-node", diagrama);
                // Después de guardar el nuevo diagrama en la base de datos:
                // console.log('se emite update', actualizado);

                socket.to(codigo).emit("update-diagram", { payload: actualizado.diagrama });

            } catch (error) {
                console.error("❌ Error al guardar el diagrama:", error);
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

                // Después de guardar el nuevo diagrama en la base de datos:
                socket.to(codigo).emit("update-diagram", { payload: actualizado });

            } catch (error) {
                console.error("❌ Error al guardar el diagrama:", error);
            }
        });

        socket.on("move-node", (data) => {
            socket.to(data.codigo).emit("move-node", data);
        });

        socket.on('disconnect', async() => {
            console.log("🧠 Usuario desconectado:", socket.id);

        });

    });

};