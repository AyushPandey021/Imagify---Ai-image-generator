const express = require("express");
const { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay } = require("../controller/userController");
const userAuth = require("../middleware/auth");

const userRouter = express.Router();

// Define routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/credits", userAuth, userCredits);
userRouter.post("/pay-razor", userAuth, paymentRazorpay);
userRouter.post("/verify-razor", verifyRazorpay);

module.exports = userRouter;

// Example usage:
// http://localhost:5000/api/users/register
// http://localhost:5000/api/users/login
