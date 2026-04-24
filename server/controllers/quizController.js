import Quiz from "../models/Quiz.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, duration, questions } = req.body;

    const quiz = await Quiz.create({
      userId: req.user.id,
      title,
      duration,
      questions
    });

    res.status(201).json(quiz);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    // return quiz even if inactive
    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      duration: quiz.duration,
      isActive: quiz.isActive,   // IMPORTANT
      questions: quiz.questions.map(q => ({
        question: q.question,
        options: q.options
      }))
    };

    res.json(safeQuiz);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { name, email, answers, startTime } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz || !quiz.isActive) {
      return res.status(400).json({ msg: "Quiz ended" });
    }

    // 🚨 BLOCK REPEAT EMAIL
    const alreadyAttempted = quiz.participants.find(
      p => p.email === email
    );

    if (alreadyAttempted) {
      return res.status(400).json({ msg: "Email already used for this quiz" });
    }

    // ⏱️ TIME CHECK
    const now = Date.now();
    if (now > new Date(startTime).getTime() + quiz.duration * 1000) {
      return res.status(400).json({ msg: "Time up" });
    }

    // 🎯 SCORE CALC
    let score = 0;

    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score++;
      }
    });

    // 💾 SAVE PARTICIPANT
    quiz.participants.push({
      name,
      email,   // IMPORTANT
      score,
      answers,
      startTime,
      submittedAt: new Date()
    });

    await quiz.save();

    res.json({ score });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const endQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    // Only owner can end
    if (quiz.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    quiz.isActive = false;
    await quiz.save();

    res.json({ msg: "Quiz ended" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    if (quiz.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // 🧠 attach timeTaken
    const enriched = quiz.participants.map(p => {
      const start = new Date(p.startTime).getTime();
      const end = new Date(p.submittedAt).getTime();

      const timeTaken = Math.floor((end - start) / 1000); // seconds

      return {
        name: p.name,
        score: p.score,
        timeTaken
      };
    });

    // 🏆 sort: score desc, time asc
    enriched.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeTaken - b.timeTaken;
    });

    res.json(enriched);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    if (quiz.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const { title, questions } = req.body;

    quiz.title = title;
    quiz.questions = questions;

    await quiz.save();

    res.json({ msg: "Updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getQuizForEdit = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    if (quiz.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    res.json(quiz);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkAttempt = async (req, res) => {
  try {
    const { email } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    const alreadyAttempted = quiz.participants.find(
      p => p.email === email
    );

    res.json({
      attempted: !!alreadyAttempted
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

