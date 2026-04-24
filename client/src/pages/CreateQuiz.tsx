import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(300);
  const [questions, setQuestions] = useState<any[]>([]);
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const saveQuiz = async () => {
    await API.post("/quiz/create", { title, duration, questions });
    navigate("/dashboard");
  };

  return (
    <div className="layout">
      <Navbar />
      <button className="back-btn" onClick={() => navigate("/dashboard")}>⬅ Back</button>
      <div className="main">
      <div className="content">
      <h2>Create Quiz</h2>
      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <input type="number" placeholder="Duration (sec)" onChange={e => setDuration(Number(e.target.value))} />

      <button onClick={addQuestion}>Add Question</button>

      {questions.map((q, i) => (
        <div key={i}>
          <input placeholder="Question" onChange={e => q.question = e.target.value} />
          {q.options.map((_: string, j: number) => (
            <input key={j} placeholder={`Option ${j}`} onChange={e => q.options[j] = e.target.value} />
          ))}
          <input type="number" placeholder="Correct index" onChange={e => q.correctAnswer = Number(e.target.value)} />
        </div>
      ))}

      <button onClick={saveQuiz}>Save</button>
    </div>
    </div>
    </div>
  );
}