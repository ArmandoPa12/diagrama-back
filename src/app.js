require('dotenv').config();
const express = require('express');

const userRoutes = require('../src/routers/userRouter');
const proyectoRouter = require('../src/routers/proyectoRouter');
const salaRouter = require('../src/routers/salaRouter');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');


const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors())
app.use('/api/users', userRoutes);
app.use('/api/proyecto', proyectoRouter);
app.use('/api/sala', salaRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*', // Ajusta esto según tu frontend
        methods: ['GET', 'POST']
    }
});

require('./services/websocket')(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});