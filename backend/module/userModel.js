const mongoose =require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: "String", // Changed 'typeof' to 'type'
    required: true,
  },
  email: {
    type: "String", // Ensure consistency in quotes
    required: true,
    unique: true,
  },
  password: {
    type: "String",
    required: true,
  },
  creditBalance: {
    type: Number, // No quotes for `Number`
    default: 5,
  },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
module.exports = userModel;
