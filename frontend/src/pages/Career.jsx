import { useState } from "react";

function Career() {

  const [form, setForm] = useState({
    skills: "",
    interest: ""
  });

  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      console.log("CAREER RESPONSE:", data);

      // ✅ safe fallback
      setResults(Array.isArray(data) ? data : data.results || []);

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Career Recommendation 🎯</h2>

      {/* INPUTS */}
      <input
        name="skills"
        placeholder="Enter skills (python, sql)"
        onChange={handleChange}
        style={styles.input}
      />

      <input
        name="interest"
        placeholder="Enter interest (AI, data)"
        onChange={handleChange}
        style={styles.input}
      />

      <button onClick={handleSubmit} style={styles.button}>
        Get Recommendation
      </button>
      

      {/* RESULTS */}
      <div style={{ marginTop: "20px" }}>
        {Array.isArray(results) && results.length > 0 ? (
          results.map((item, index) => (
            <div key={index} style={styles.card}>
              
              <h3>
                {item.role} — {item.percentage || 0}% Match ✅
              </h3>

              <p>{item.reason}</p>

              {/* Progress Bar */}
              <div style={styles.progressBg}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${item.percentage || 0}%`
                  }}
                />
              </div>

            </div>
          ))
        ) : (
          <p style={{ color: "black", marginTop: "10px" }}>
            No recommendations yet
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {

  container: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    color: "#000",
    maxWidth: "500px",
    margin: "auto"
  },

 
  progressBg: {
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "10px",
    marginTop: "10px",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    transition: "width 0.5s ease",
    borderRadius: "10px"
  },

  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "20px"
  },

  card: {
    width: "90%",
    maxWidth: "700px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    color:"black"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#111",
    fontSize: "24px",
    fontWeight: "bold"
  },

  input: {
    width: "95%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  button: {
    marginTop: "15px",
    padding: "12px",
    width: "100%",
    background: "linear-gradient(90deg, #03114e, #9c88b1)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  resultCard: {
    marginTop: "15px",
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "10px"
  }
};

export default Career;