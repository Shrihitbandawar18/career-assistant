import { useState } from "react";

function Jobs() {
  const [role, setRole] = useState("");
  const [jobs, setJobs] = useState([]);

  const searchJobs = async () => {
    if (!role) return alert("Enter role");

    console.log("🔥 Searching for:", role);

    try {
      const res = await fetch("https://career-backend-yx3b.onrender.com/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ role })
      });

      const data = await res.json();
      console.log("🔥 JOB API RESPONSE:", data);

      // ✅ IMPORTANT FIX
      setJobs(data.jobs || []);

    } catch (err) {
      console.error("JOB ERROR:", err);
      alert("Failed to fetch jobs ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Job Finder 💼</h2>

      <input
        placeholder="Enter role (backend, ai, data...)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={styles.input}
      />

      <button onClick={searchJobs} style={styles.button}>
        Search Jobs
      </button>

      {/* ✅ RESULTS */}
      <div style={{ marginTop: "20px" }}>
        {jobs.length === 0 ? (
          <p style={{ color: "#555" }}>No jobs found</p>
        ) : (
          jobs.map((job, i) => (
            <div key={i} style={styles.card}>
              <h3>{job.title}</h3>
              <p>{job.company}</p>

              <a
                href={job.link}
                target="_blank"
                rel="noreferrer"
                style={styles.link}
              >
                Apply Here 🚀
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "500px",
    margin: "auto",
    
  },
  title: {
    textAlign: "center",
    marginBottom: "15px",
    color:"black"
  },
  input: {
    width: "90%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "10px"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  card: {
    background: "#f1f5f9",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    color:"black",
  },
  link: {
    color: "#4f46e5",
    fontWeight: "bold",
    textDecoration: "underline"
  }
};

export default Jobs;