const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connection suiccessfull");
    } catch (error) {
        console.log("MongoDB connection Error", error);
        process.exit(1)
    }
}

module.exports = connectDB;
