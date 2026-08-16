const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // These options are now default in Mongoose 6+, but good to be explicit
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`[MongoDB] Connected to database: ${conn.connection.name}`);
    } catch (error) {
        console.error(`[MongoDB] Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
