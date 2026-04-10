import User from "../models/user.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (checkUser.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    return res
      .status(200)
      .json({ message: "Login successful", user: checkUser });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({
      fullName,
      email,
      password,
    });
    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
