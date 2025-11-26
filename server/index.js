const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for now, restrict in production
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Store user mapping: socketId -> { roomId, username }
const userMap = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', ({ roomId, username }) => {
        socket.join(roomId);
        userMap[socket.id] = { roomId, username };
        const clients = io.sockets.adapter.rooms.get(roomId);
        const numClients = clients ? clients.size : 0;

        console.log(`User ${socket.id} joined room ${roomId}. Total users: ${numClients}`);

        // Notify others in the room
        socket.to(roomId).emit('user-connected', { userId: socket.id, username });

        // Send list of existing users to the new user (optional, for some WebRTC flows)
        const existingUsers = Array.from(clients || []).filter(id => id !== socket.id);
        socket.emit('existing-users', existingUsers);
    });

    // Code Editor Sync
    socket.on('code-change', ({ roomId, code }) => {
        socket.to(roomId).emit('code-update', code);
    });

    // Whiteboard Sync
    socket.on('draw-data', ({ roomId, data }) => {
        socket.to(roomId).emit('draw-data', data);
    });

    socket.on('clear-canvas', ({ roomId }) => {
        socket.to(roomId).emit('clear-canvas');
    });

    // Chat
    socket.on('chat-message', ({ roomId, message, username, time }) => {
        io.to(roomId).emit('chat-message', { message, username, time, userId: socket.id });
    });

    // WebRTC Signaling
    socket.on('signal', (data) => {
        // data: { userToSignal, signal, callerID }
        io.to(data.userToSignal).emit('signal', {
            signal: data.signal,
            callerID: data.callerID
        });
    });

    socket.on('disconnect', () => {
        const user = userMap[socket.id];
        if (user) {
            const { roomId } = user;
            socket.to(roomId).emit('user-disconnected', socket.id);
            delete userMap[socket.id];
            console.log(`User ${socket.id} disconnected from room ${roomId}`);
        } else {
            console.log('User disconnected:', socket.id);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
