import { useEffect, useState } from "react";
import { safeParse } from "../utils/safeParse";

function History() {
  const [history, setHistory] = useState([]);

  // ✅ FETCH HISTORY
  useEffect(() => {
    fetch("https://career-backend.onrender.com/api/history")
      .then((res) => res.json())
      .then((data) => {
        console.log("HISTORY:", data);
        setHistory(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // ✅ CLEAR HISTORY
  const clearHistory = async () => {
    const confirmDelete = window.confirm("Are you sure you want to clear history?");
    if (!confirmDelete) return;

    const res = await fetch("https://career-backend.onrender.com/api/clear-history", {
      method: "DELETE",
    });

    const data = await res.json();
    alert(data.message);

    setHistory([]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>History 📊</h2>

        {history && history.length > 0 ? (
          <div style={styles.list}>
            {history.map((item, i) => {
              const parsed = safeParse(item.result);

              return (
                <div key={i} style={styles.card}>
                  <h3 style={styles.action}>{item.action}</h3>

                  {Array.isArray(parsed) &&
                    parsed.map((r, j) => (
                      <div key={j} style={styles.resultBlock}>

                        {/* Career */}
                        {r.role && <p><b>Role:</b> {r.role}</p>}
                        {r.percentage && <p><b>Match:</b> {r.percentage}%</p>}
                        {r.reason && <p>{r.reason}</p>}

                        {/* Jobs */}
                        {r.title && <p><b>Job:</b> {r.title}</p>}
                        {r.company && <p>{r.company}</p>}
                        {r.link && (
                          <a href={r.link} target="_blank" rel="noreferrer">
                            Apply Here 🚀
                          </a>
                        )}

                        {/* 🚀 ROADMAP SUPPORT */}
                        {r.roadmap && (
                          <div style={styles.roadmap}>
                            <p><b>Target Role:</b> {r.role}</p>

                            {r.roadmap.phases.map((p, k) => (
                              <div key={k}>
                                <h4>{p.title}</h4>
                                <ul>
                                  {p.steps.map((s, x) => (
                                    <li key={x}>{s}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}

                            <p><b>Timeline:</b> {r.roadmap.timeline}</p>
                          </div>
                        )}

                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        ) : (
          <p style={styles.empty}>No history found</p>
        )}

        <button onClick={clearHistory} style={styles.clearBtn}>
          🧹 Clear History
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "20px"
  },
  container: {
    maxWidth: "900px",
    margin: "auto",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#111"
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  card: {
    background: "#f1f5f9",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 5px 10px rgba(0,0,0,0.1)"
  },
  action: {
    marginBottom: "10px",
    color: "#333"
  },
  resultBlock: {
    marginTop: "10px",
    padding: "10px",
    background: "#fff",
    borderRadius: "8px"
  },
  roadmap: {
    marginTop: "10px",
    background: "#eef2ff",
    padding: "10px",
    borderRadius: "8px"
  },
  empty: {
    textAlign: "center",
    color: "#555"
  },
  clearBtn: {
    marginTop: "20px",
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#ff4d4f",
    color: "#fff",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  }
};

export default History;