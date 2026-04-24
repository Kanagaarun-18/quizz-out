import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.put("/update", verifyToken, updateUser);
router.delete("/delete", verifyToken, deleteUser);

export default router;