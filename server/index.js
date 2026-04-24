import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import verifyToken from "./middleware/authMiddleware.js";
import quizRoutes from "./routes/quizRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: "https://quizz-out.vercel.app/",   // temporary for testing
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);

app.get("/protected", verifyToken, (req, res) => {
  res.json({ msg: "Access granted", user: req.user });
});

app.use("/api/quiz", quizRoutes);

app.use("/api/user", userRoutes);
