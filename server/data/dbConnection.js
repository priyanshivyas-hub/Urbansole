const mongoose = require("mongoose");

const DB_connection = async () => {
  const DB = "mongodb://localhost:27017/urbansole";
  try {
    await mongoose.connect(DB);
    console.log("DB connection successful!");
  } catch (error) {
    console.error("Error connecting to DB...:", error);
  }
};

module.exports = DB_connection;