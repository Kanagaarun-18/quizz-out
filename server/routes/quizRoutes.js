import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { createQuiz, getUserQuizzes } from "../controllers/quizController.js";
import { getQuizById } from "../controllers/quizController.js";
import { submitQuiz } from "../controllers/quizController.js";
import { endQuiz } from "../controllers/quizController.js";
import { getStats } from "../controllers/quizController.js";
import { updateQuiz } from "../controllers/quizController.js";
import { getQuizForEdit } from "../controllers/quizController.js";
import { checkAttempt } from "../controllers/quizController.js";

const router = express.Router();

router.post("/create", verifyToken, createQuiz);
router.get("/user", verifyToken, getUserQuizzes);
router.patch("/:id/end", verifyToken, endQuiz);
router.get("/:id/stats", verifyToken, getStats);
router.put("/:id/edit", verifyToken, updateQuiz);
router.get("/:id/edit", verifyToken, getQuizForEdit);
router.post("/:id/check-attempt", checkAttempt);

router.get("/:id", getQuizById); // public
router.post("/:id/submit", submitQuiz);
export default router;