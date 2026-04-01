import { useState } from "react";

function Resume({ setPage }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://career-backend.onrender.com/api/resume", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("RESUME RESPONSE:", data);
      setResult(data);

    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Resume Analyzer 📄</h3>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleUpload}>Analyze Resume</button>

      {result && (
  <div style={styles.result}>
    <h3>📄 Resume Score: {result.score}/100</h3>
    <h4>🤖 ATS Score: {result.ats}%</h4>

    <h4>✅ Strengths:</h4>
    <ul>
      {result.strengths.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ul>

    <h4>⚠️ Weaknesses:</h4>
    <ul>
      {result.weaknesses.map((w, i) => (
        <li key={i}>{w}</li>
      ))}
    </ul>

    <h4>❌ Missing Keywords:</h4>
    <ul>
      {result.missing.map((m, i) => (
        <li key={i}>{m}</li>
      ))}
    </ul>

 

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
    color: "#000"
  },
  result: {
    marginTop: "15px",
  },
  container: {
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "800px",
  margin: "auto",
  color: "#000000"
},
  title:{
    color:"black"
  }

};

export default Resume;