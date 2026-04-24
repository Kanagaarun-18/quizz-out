import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [started, setStarted] = useState(false);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState<number | null>(null);

  const [startTime, setStartTime] = useState("");
  const [timeTaken, setTimeTaken] = useState<number | null>(null);

  // =====================
  // LOAD QUIZ
  // =====================
  useEffect(() => {
    API.get(`/quiz/${id}`).then(res => {
      setQuiz(res.data);
      setTimeLeft(res.data.duration);
    });
  }, [id]);

  // =====================
  // TIMER
  // =====================
  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started]);

  // =====================
  // FORMAT TIME
  // =====================
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // =====================
  // CHECK EMAIL BEFORE START
  // =====================
  const checkAndStart = async () => {
    if (!name || !email) {
      alert("Enter name and email");
      return;
    }

    const res = await API.post(`/quiz/${id}/check-attempt`, {
      email
    });

    if (res.data.attempted) {
      setAlreadyAttempted(true);
      return;
    }

    setStarted(true);
    setStartTime(new Date().toISOString());
  };

  // =====================
  // SUBMIT QUIZ
  // =====================
  const submit = async () => {
    const endTime = new Date();

    const res = await API.post(`/quiz/${id}/submit`, {
      name,
      email,
      answers,
      startTime
    });

    setScore(res.data.score);

    const start = new Date(startTime).getTime();
    const end = endTime.getTime();

    setTimeTaken(Math.floor((end - start) / 1000));
  };

  // =====================
  // LOADING
  // =====================
  if (!quiz) return <div>Loading...</div>;

  // =====================
  // QUIZ OVER STATE
  // =====================
  if (quiz.isActive === false) {
    return (
      <div className="quiz-main">
        <div className="quiz-content">
          <h2>Quiz Over</h2>
          <p>This quiz has ended.</p>
          <button onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  // =====================
  // ALREADY ATTEMPTED
  // =====================
  if (alreadyAttempted) {
    return (
      <div className="quiz-main">
        <div className="quiz-content">
          <h2>Already Attempted</h2>
          <p>You have already submitted this quiz.</p>
          <button onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  // =====================
  // SCORE SCREEN
  // =====================
  if (score !== null) {
    return (
      <div className="quiz-main">
        <div className="quiz-content">
          <h2>Your Score: {score} 🎯</h2>

          {timeTaken !== null && (
            <p className="time">
              ⏱ Time Taken: {formatTime(timeTaken)}
            </p>
          )}
        </div>
      </div>
    );
  }

  // =====================
  // START SCREEN
  // =====================
  if (!started) {
    return (
      <div className="quiz-main">
        <div className="quiz-content">
          <h2>{quiz.title}</h2>

          <input
            placeholder="Enter Name"
            onChange={e => setName(e.target.value)}
          />

          <input
            placeholder="Enter Email"
            onChange={e => setEmail(e.target.value)}
          />

          <button onClick={checkAndStart}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // =====================
  // QUIZ QUESTIONS
  // =====================
  return (
    <div className="layout">
      <div className="main">
        <div className="content">

          <h2>{quiz.title}</h2>

          <div className="timer">
            ⏱ {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? "0" : ""}
            {timeLeft % 60}
          </div>

          {quiz.questions.map((q: any, i: number) => (
            <div className="card" key={i}>
              <p>{q.question}</p>

              {q.options.map((opt: string, j: number) => (
                <div
                  key={j}
                  className={`option ${answers[i] === j ? "selected" : ""}`}
                  onClick={() => {
                    const newAns = [...answers];
                    newAns[i] = j;
                    setAnswers(newAns);
                  }}
                >
                  <div className="radio-circle">
                    {answers[i] === j && (
                      <div className="inner-circle"></div>
                    )}
                  </div>

                  <span className="option-text">{opt}</span>
                </div>
              ))}
            </div>
          ))}

          <button onClick={submit}>
            Submit Quiz
          </button>

        </div>
      </div>
    </div>
  );
}