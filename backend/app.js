const express = require("express");
const cors = require("cors");
// const "dotenv/config";
require('dotenv').config();


const connectDB = require("./config/Mongo.js");
const userRouter = require("./routes/userRoute.js");
const imageRouter = require("./routes/imageRoutes.js");

const PORT = 5000;

const startServer = async () => {
  try {
    const app = express();

    // // Middleware
    app.use(express.json());
    app.use(cors());

    // Database Connection
    await connectDB();

    // Routes
    app.use('/api/user', userRouter);
    app.use('/api/image', imageRouter);

    // Root Route
    app.get("/", (req, res) => {
      res.send("Welcome");
    });

    // Start Server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error.message);
    process.exit(1);
  }
};

startServer();
