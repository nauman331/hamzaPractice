import {
  getProfile,
  login,
  logout,
  register,
} from "../controllers/authController.js";
import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/profile", protect, getProfile);
router.post("/logout", logout);

export default router;
