import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Generate Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for User Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ FIXED: Route for Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Admin Login Attempt:");
    console.log("Received Email:", email);
    console.log("Expected Email:", process.env.ADMIN_EMAIL);
    console.log("Password Match:", password === process.env.ADMIN_PASSWORD);
    console.log("JWT_SECRET exists:", process.env.JWT_SECRET ? "Yes" : "No");

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET);
      console.log("Login successful, token generated");
      res.json({ success: true, token });
    } else {
      console.log("Login failed - Invalid credentials");
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log("Admin Login Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin };
