const userModel = require("../module/userModel.js");
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const razorpay = require("razorpay");

const transactionModel = require("../module/transactionModel.js");
// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Please fill in all fields" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // Respond with success
    res.json({
      success: true,
      token,
      user: { name: user.name },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Respond with success
      res.json({
        success: true,
        token,
        user: { name: user.name, email: user.email },
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const userCredits = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const paymentRazorpay = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    // Check for missing input
    if (!userId || !planId) {
      return res.status(400).json({
        success: false,
        message: "Please provide user ID and plan ID",
      });
    }

    // Fetch user data
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let credits, plan, amount, date;

    // Determine plan details
    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;
      case "Business":
        plan = "Business";
        credits = 500;
        amount = 250;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid plan ID",
        });
    }

    // Prepare transaction data
    date = Date.now();
    const transactionData = {
      userId,
      plan,
      amount,
      credits,
      date,
    };

    // Create a new transaction
    const newTransaction = await transactionModel.create(transactionData);

    // Configure Razorpay order options
    const options = {
      amount: amount * 100, // Convert to the smallest currency unit
      currency: process.env.CURRENCY || "INR",
      receipt: newTransaction._id.toString(),
      payment_capture: 1,
      notes: {
        plan: plan,
        userId: userId,
      },
    };

    // Create an order in Razorpay
    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay order creation failed:", error);
        return res.status(500).json({
          success: false,
          message: "Payment order creation failed",
        });
      }

      res.status(200).json({
        success: true,
        order,
      });
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      const transactionData = await transactionModel.findById(
        orderInfo.receipt
      );
      if (transactionData.payment) {
        return res.json({ success: false, message: "Payment failed" });
      }
      const userData = await userModel.findById(transactionData.user_id);
      const creditBalance = userData.creditBalance + transactionData.credits;
      await userModel.findByIdAndUpdate(userData._id, { creditBalance });
      await transactionModel.findByIdAndUpdate(transactionData._id, {
        payment: true,
      });
      res.json({ success: true, message: "credit Added" });
    } else {
      res.json({ success: false, message: "payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
module.exports = {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,
  verifyRazorpay,
};
