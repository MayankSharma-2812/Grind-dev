const User = require("../models/User.cjs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.json(user);
  } catch (error) {
    res.status(500).json("Registration failed");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json("Invalid");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json("Login failed");
  }
};

module.exports = { register, login };
