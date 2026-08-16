require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const chatRoutes = require('./routes/chatRoutes');
const communityRoutes = require('./routes/communityRoutes');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Socket.io for Real-time chat/notifications
const io = new Server(server, { cors: corsOptions });

io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);
    
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
    });

    socket.on('join_community', async (data) => {
        try {
            const { communityId, token } = data;
            const jwt = require('jsonwebtoken');
            const CommunityMember = require('./models/CommunityMember');
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const member = await CommunityMember.findOne({ community: communityId, user: decoded.userId, status: 'active' });
            
            if (member) {
                socket.join(`community:${communityId}`);
                console.log(`[Socket] User ${decoded.userId} joined community:${communityId}`);
            }
        } catch (error) {
            console.error('[Socket] join_community error:', error.message);
        }
    });

    socket.on('leave_community', (communityId) => {
        socket.leave(`community:${communityId}`);
    });

    socket.on('disconnect', () => {
        console.log(`[Socket] User disconnected: ${socket.id}`);
    });
});
// Attach socket to req so controllers can emit
app.use((req, res, next) => {
    req.io = io;
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/communities', communityRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    const mongoose = require('mongoose');
    res.json({
        status: 'ok',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`[Server] running on port ${PORT}`);
});
