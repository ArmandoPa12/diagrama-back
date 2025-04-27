const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.usuario.create({
        data: {
            usuario: 'admin',
            email: 'a@g.com',
            password: await bcrypt.hash('123', 10),
            proyectos: {
                create: [
                    { nombre: 'Proyecto 1', diagrama: 'afjhrgfbvjbdcjabebsjhjbsdjbsc' },
                    { nombre: 'Proyecto 2', diagrama: 'afjhrgfbvjbdcjabebsjhjbsdjbscgtyht64ju6t465b4d5fge64dgt' },
                ],
            },
        },
        include: {
            proyectos: true,
        },
    });

    await prisma.usuario.create({
        data: {
            usuario: 'admin2',
            email: 'b@g.com',
            password: await bcrypt.hash('123', 10),
            proyectos: {
                create: [
                    { nombre: 'Proyecto A', diagrama: 'afjhrgfbvjbdcjabebsjhjbsdjbsc' },
                    { nombre: 'Proyecto B', diagrama: 'afjhrgfbvjbdcjabebsjhjbsdjbscgtyht64ju6t465b4d5fge64dgt' },
                ],
            },
        },
        include: {
            proyectos: true,
        },
    });

    console.log('Usuario con proyectos creados:', user);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async() => {
        await prisma.$disconnect();
    });