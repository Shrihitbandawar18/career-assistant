import { useState } from "react";
import Career from "./Career";
import Resume from "./Resume";
import Roadmap from "./Roadmap";
import Jobs from "./Jobs";
import History from "./History";
import FAQ from "./FAQ";



function Dashboard() {
  console.log("ROADMAP COMPONENT LOADED");
  const [page, setPage] = useState("");

  const cards = [
    { name: "Resume Analyzer", key: "resume", emoji: "📄" },
    { name: "Roadmap Generator", key: "roadmap", emoji: "🗺️" },
    { name: "Career Recommendation", key: "career", emoji: "🎯" },
    { name: "Job Finder", key: "jobs", emoji: "💼" },
    { name: "FAQs (Ask Bot)", key: "faq", emoji: "🤖" },
    { name: "History", key: "history", emoji: "📊" }
  ];

  if (page) {
  return (
    <div style={styles.fullPage}>
      
      {/* BACK BUTTON */}
      <button style={styles.backBtn} onClick={() => setPage("")}>
        ← Back
      </button>



      <div style={{ marginTop: "20px" }}>
        {page === "resume" && <Resume setPage={setPage} />}
        {page === "career" && <Career setPage={setPage} />}
        {page === "jobs" && <Jobs setPage={setPage} />}
        {page === "history" && <History setPage={setPage} />}
        {page === "faq" && <FAQ setPage={setPage} />}
        {page === "roadmap" && <Roadmap />}
      </div>
    </div>
  );
}

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Career Platform 🚀</h1>

      {/* GRID */}
      <div style={styles.grid}>
        {cards.map((card) => (
          <div
            key={card.key}
            style={styles.card}
            onClick={() => setPage(card.key)}
          >
            <div style={styles.icon}>{card.emoji}</div>
            <h3>{card.name}</h3>
          </div>
          
        ))}
      </div>

    

      {/* LOGOUT */}
      <button
        onClick={() => {
          localStorage.removeItem("user");
          window.location.reload();
        }}
        style={styles.logout}
      >
        Logout
      </button>
      
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "30px",
    textAlign: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff"
  },
  title: {
    marginBottom: "30px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    maxWidth: "900px",
    margin: "auto"
  },
  card: {
    background: "#ffffff",
    color: "#333",
    padding: "25px",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
  },
  icon: {
    fontSize: "30px",
    marginBottom: "10px"
  },
  content: {
    marginTop: "30px"
  },
  logout: {
    marginTop: "30px",
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer"
  },
  fullPage: {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  padding: "20px"
},
  backBtn: {
  marginBottom: "20px",
  padding: "10px 15px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
}

};

export default Dashboard;