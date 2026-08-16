require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Sport = require('../models/Sport');
const Match = require('../models/Match');
const connectDB = require('../config/database');

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing old data...');
        await User.deleteMany({});
        await Sport.deleteMany({});
        await Match.deleteMany({});

        console.log('Seeding sports...');
        const sports = await Sport.insertMany([
            { name: 'Badminton', slug: 'badminton', icon: '🏸', active: true },
            { name: 'Football', slug: 'football', icon: '⚽', active: true },
            { name: 'Cricket', slug: 'cricket', icon: '🏏', active: true },
            { name: 'Basketball', slug: 'basketball', icon: '🏀', active: true },
            { name: 'Tennis', slug: 'tennis', icon: '🎾', active: true }
        ]);

        console.log('Seeding users...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        const users = await User.insertMany([
            {
                name: 'Alice (Demo)',
                email: 'alice@demo.com',
                passwordHash,
                bio: 'Love playing badminton!',
                sports: ['badminton'],
                skill_level: 4,
                location: { type: 'Point', coordinates: [-74.006, 40.7128] } // NY
            },
            {
                name: 'Bob (Demo)',
                email: 'bob@demo.com',
                passwordHash,
                bio: 'Football fanatic',
                sports: ['football'],
                skill_level: 3,
                location: { type: 'Point', coordinates: [-74.006, 40.7128] } // NY
            },
            {
                name: 'Charlie (Demo)',
                email: 'charlie@demo.com',
                passwordHash,
                bio: 'Tennis anyone?',
                sports: ['tennis'],
                skill_level: 5,
                location: { type: 'Point', coordinates: [-0.1278, 51.5074] } // London
            }
        ]);

        console.log('Seeding matches...');
        await Match.insertMany([
            {
                title: 'Weekend Badminton',
                sport: 'badminton',
                hostId: users[0]._id,
                joinedPlayers: [users[0]._id],
                totalPlayers: 4,
                skillLevel: 3,
                dateTime: new Date(Date.now() + 86400000), // Tomorrow
                locationName: 'Central Park Courts',
                location: { type: 'Point', coordinates: [-74.006, 40.7128] }, // NY
                description: 'Looking for 3 more players for doubles.',
                status: 'open'
            },
            {
                title: '5v5 Football',
                sport: 'football',
                hostId: users[1]._id,
                joinedPlayers: [users[1]._id, users[0]._id],
                totalPlayers: 10,
                skillLevel: 2,
                dateTime: new Date(Date.now() + 86400000 * 2),
                locationName: 'Brooklyn Field',
                location: { type: 'Point', coordinates: [-73.944, 40.678] }, // Brooklyn
                description: 'Casual game, all levels welcome.',
                status: 'open'
            }
        ]);

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedData();
