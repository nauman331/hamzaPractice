import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "dev_secret_change_me";
const JWT_EXPIRES_IN = "7d";

const sanitizeUser = (userDoc) => ({
  id: userDoc._id,
  fullName: userDoc.fullName,
  email: userDoc.email,
  createdAt: userDoc.createdAt,
});

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, checkUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: checkUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: sanitizeUser(checkUser),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
};

export const addstudent = async (req, res) => {
  try {
    const { fullName, email, password, role, isFeePaid, studentclass } = req.body || {};
    if (!fullName || !email || !password || !studentclass) {
      const missingFields = ["fullName", "email", "password", "studentclass"].filter(
        (field) => !req.body?.[field],
      );

      return res.status(400).json({
        message: "Please fill all the fields",
        missingFields,
        receivedKeys: Object.keys(req.body || {}),
      });
    }
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      isFeePaid,
      studentclass
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params || {};
    const { fullName, email, isFeePaid, studentclass } = req.body || {};

    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const student = await User.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (fullName) student.fullName = fullName;
    if (email) student.email = email;
    if (isFeePaid !== undefined) student.isFeePaid = isFeePaid;
    if (studentclass) student.studentclass = studentclass;
    await student.save();
    return res.status(200).json({ message: "Student updated successfully", student: sanitizeUser(student) });
  }
  catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
}
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    return res.status(200).json({ students });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
};
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id) {
      return res.status(400).json({ message: "Student ID is required" });
    }
    const student = await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
}
export const logout = async (_req, res) => {
  return res.status(200).json({ message: "Logout successful" });
};
