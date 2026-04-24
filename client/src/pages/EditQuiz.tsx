import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<any>(null);

  // =====================
  // LOAD QUIZ
  // =====================
  useEffect(() => {
    API.get(`/quiz/${id}/edit`)
      .then(res => setQuiz(res.data))
      .catch(err => {
        console.log("Error loading quiz:", err);
        setQuiz(false);
      });
  }, [id]);

  // =====================
  // SAFE CHECK
  // =====================
  if (quiz === false) {
    return (
      <div className="main">
        <div className="quiz-content">
          <h2>Failed to load quiz</h2>
        </div>
      </div>
    );
  }

  if (!quiz || !Array.isArray(quiz.questions)) {
    return (
      <div className="main">
        <div className="quiz-content">Loading quiz...</div>
      </div>
    );
  }

  // =====================
  // UPDATE QUESTION
  // =====================
  const updateQuestion = (qi: number, field: string, value: any) => {
    if (!quiz) return;

    const updated = [...quiz.questions];
    updated[qi][field] = value;

    setQuiz({ ...quiz, questions: updated });
  };

  // =====================
  // UPDATE OPTION
  // =====================
  const updateOption = (qi: number, oi: number, value: string) => {
    if (!quiz) return;

    const updated = [...quiz.questions];
    updated[qi].options[oi] = value;

    setQuiz({ ...quiz, questions: updated });
  };

  // =====================
  // ADD OPTION
  // =====================
  const addOption = (qi: number) => {
    if (!quiz) return;

    const updated = [...quiz.questions];
    updated[qi].options.push("");

    setQuiz({ ...quiz, questions: updated });
  };

  // =====================
  // DELETE OPTION
  // =====================
  const deleteOption = (qi: number, oi: number) => {
    if (!quiz) return;

    const updated = [...quiz.questions];
    updated[qi].options.splice(oi, 1);

    if (updated[qi].correctAnswer === oi) {
      updated[qi].correctAnswer = 0;
    }

    setQuiz({ ...quiz, questions: updated });
  };

  // =====================
  // DELETE QUESTION
  // =====================
  const deleteQuestion = (qi: number) => {
    if (!quiz) return;

    const updated = quiz.questions.filter((_: any, i: number) => i !== qi);
    setQuiz({ ...quiz, questions: updated });
  };

  // =====================
  // ADD QUESTION
  // =====================
  const addQuestion = () => {
    if (!quiz) return;

    const newQ = {
      question: "",
      options: ["", ""],
      correctAnswer: 0
    };

    setQuiz({
      ...quiz,
      questions: [...quiz.questions, newQ]
    });
  };

  // =====================
  // SAVE QUIZ
  // =====================
  const updateQuiz = async () => {
    try {
      await API.put(`/quiz/${id}/edit`, {
        title: quiz.title,
        questions: quiz.questions
      });

      alert("Quiz updated successfully!");
      navigate("/dashboard");

    } catch (err: any) {
      console.log("Update error:", err.response?.data || err.message);
      alert("Failed to update quiz");
    }
  };

  // =====================
  // UI
  // =====================
  return (
    <div className="main">
      <div className="content">

        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Edit Quiz</h2>
            <button className="back-btn" onClick={() => navigate("/dashboard")}>⬅ Back</button>
        </div>

        {/* TITLE */}
        <input
          value={quiz.title}
          onChange={e => setQuiz({ ...quiz, title: e.target.value })}
          placeholder="Quiz Title"
        />

        {/* QUESTIONS */}
        {quiz.questions.map((q: any, i: number) => (
          <div key={i} className="card">

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>Question {i + 1}</h4>
              <button onClick={() => deleteQuestion(i)}>Delete</button>
            </div>

            <input
              value={q.question}
              onChange={e => updateQuestion(i, "question", e.target.value)}
              placeholder="Enter question"
            />

            {/* OPTIONS */}
            {q.options.map((opt: string, j: number) => (
              <div
                key={j}
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "8px",
                  alignItems: "center"
                }}
              >
                <input
                  value={opt}
                  onChange={e => updateOption(i, j, e.target.value)}
                  placeholder={`Option ${j + 1}`}
                />

                <input
                  type="radio"
                  checked={q.correctAnswer === j}
                  onChange={() => updateQuestion(i, "correctAnswer", j)}
                />

                <button onClick={() => deleteOption(i, j)}>X</button>
              </div>
            ))}

            <button onClick={() => addOption(i)}>+ Add Option</button>
          </div>
        ))}

        {/* ADD QUESTION */}
        <button onClick={addQuestion}>+ Add Question</button>

        <br /><br />

        {/* SAVE */}
        <button onClick={updateQuiz}>Save Changes</button>

      </div>
    </div>
  );
}