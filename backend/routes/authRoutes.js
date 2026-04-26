import {
  getProfile,
  login,
  logout,
  addstudent,
  updateStudent,
  getAllStudents,
  deleteStudent
} from "../controllers/authController.js";
import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", addstudent);
router.get("/students", protect, getAllStudents);
router.put("/student/:id", protect, updateStudent);
router.delete("/student/:id", protect, deleteStudent);
router.get("/profile", protect, getProfile);
router.post("/logout", logout);

export default router;
