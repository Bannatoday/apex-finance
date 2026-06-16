const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`   Server will continue running but database features won't work.`);
    console.error(`   Make sure your Atlas cluster has your IP whitelisted (0.0.0.0/0 for all).`);
  }
};

module.exports = connectDB;

