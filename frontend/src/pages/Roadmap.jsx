import { useState } from "react";

function Roadmap() {
  const [role, setRole] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {
    if (!role) return alert("Enter a role");

    setLoading(true);
    setRoadmap(null);

    try {
      const res = await fetch("https://career-backend-yx3b.onrender.com/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role })
      });

      const data = await res.json();

      console.log("ROADMAP:", data);

      setRoadmap(data);

    } catch (err) {
      console.error(err);
      alert("Error generating roadmap ❌");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Roadmap Generator 🧭</h2>

      <input
        placeholder="Enter role (AI Engineer, Backend...)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={styles.input}
      />

      <button onClick={generateRoadmap} style={styles.button}>
        Generate Roadmap
      </button>

      {loading && <p style={{ marginTop: "15px" }}>Generating roadmap...</p>}

      {/* RESULT */}
      {roadmap && (
        <div style={styles.card}>

          <h3>🎯 Target: {role}</h3>

          {/* PHASES */}
          {roadmap.phases.map((phase, i) => (
            <div key={i} style={styles.phase}>
              <h4>{phase.title}</h4>
              <ul>
                {phase.steps.map((step, j) => (
                  <li key={j}>{step}</li>
                ))}
              </ul>
            </div>
          ))}
          <p style={{marginTop:"10px", color:"#555"}}>
💡 Tip: Stay consistent. 2–3 hours daily = massive growth.
</p>

          {/* TOOLS */}
          <h4>🛠 Tools</h4>
          <ul>
            {roadmap.tools.map((tool, i) => (
              <li key={i}>{tool}</li>
            ))}
          </ul>

          {/* PROJECTS */}
          <h4>💻 Projects</h4>
          <ul>
            {roadmap.projects.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>

          {/* TIMELINE */}
          <h4>⏳ Timeline</h4>
          <p>{roadmap.timeline}</p>

        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "600px",
    margin: "auto",
    color: "#000"
  },
  title: {
    textAlign: "center",
    color:"black"
  },
  input: {
    width: "95%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginTop: "10px"
  },
  button: {
    width: "100%",
    marginTop: "10px",
    padding: "10px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  card: {
    marginTop: "20px",
    background: "#f9fafb",
    padding: "15px",
    borderRadius: "10px"
  },
  phase: {
    marginTop: "15px"
  }
};

export default Roadmap;