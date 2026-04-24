import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [statsMap, setStatsMap] = useState<{ [key: string]: any[] }>({});
  const [openStats, setOpenStats] = useState<{ [key: string]: boolean }>({});

  const navigate = useNavigate();

  // =====================
  // LOAD QUIZZES
  // =====================
  useEffect(() => {
    API.get("/quiz/user").then(res => setQuizzes(res.data));
  }, []);

  // =====================
  // TOGGLE STATS
  // =====================
  const viewStats = async (id: string) => {
    if (openStats[id]) {
      setOpenStats(prev => ({ ...prev, [id]: false }));
      return;
    }

    if (!statsMap[id]) {
      const res = await API.get(`/quiz/${id}/stats`);
      setStatsMap(prev => ({ ...prev, [id]: res.data }));
    }

    setOpenStats(prev => ({ ...prev, [id]: true }));
  };

  // =====================
  // END QUIZ
  // =====================
  const endQuiz = async (id: string) => {
    await API.patch(`/quiz/${id}/end`);
    setQuizzes(prev =>
      prev.map(q =>
        q._id === id ? { ...q, isActive: false } : q
      )
    );
  };

  // =====================
  // TIME FORMAT
  // =====================
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="layout">
      <Navbar />

      <div className="main">
        <div className="quiz-content">

          <h2>📊 Dashboard</h2>

          {quizzes.map(q => (
            <div
              className={`card ${!q.isActive ? "inactive-card" : ""}`}
              key={q._id}
            >
              {/* TITLE */}
              <h3>
                {q.title}
                {!q.isActive && (
                  <span className="ended-badge">ENDED</span>
                )}
              </h3>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", flexWrap: "wrap" }}>

                {/* COPY LINK */}
                <button
                  disabled={!q.isActive}
                  onClick={() => {
                    if (!q.isActive) return;

                    navigator.clipboard.writeText(
                      `http://localhost:5173/quiz/${q._id}`
                    );
                  }}
                >
                  {q.isActive ? "Copy Link" : "Quiz Over"}
                </button>

                {/* STATS */}
                <button onClick={() => viewStats(q._id)}>
                  {openStats[q._id] ? "Hide Stats" : "View Stats"}
                </button>

                {/* EDIT */}
                <button onClick={() => navigate(`/edit/${q._id}`)}>
                  Edit Quiz
                </button>

                {/* END */}
                <button onClick={() => endQuiz(q._id)}>
                  End
                </button>
              </div>

              {/* LEADERBOARD */}
              {openStats[q._id] && statsMap[q._id] && (
                <div className="leaderboard">
                  <h4>Leaderboard</h4>

                  <table className="stats-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Score</th>
                        <th>Time</th>
                      </tr>
                    </thead>

                    <tbody>
                      {statsMap[q._id].map((s: any, i: number) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{s.name}</td>
                          <td>{s.score}</td>
                          <td>
                            {s.timeTaken
                              ? formatTime(s.timeTaken)
                              : "0m 0s"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}