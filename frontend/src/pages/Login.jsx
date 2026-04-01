import { useState } from "react";
import "./Login.css";

function Login({ setPage }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      localStorage.setItem("user", form.email);
      setPage("dashboard");   // 🔥 THIS LINE IS IMPORTANT
    } else {
      alert(data.message);
    }

  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
};
  return (
    <div style={styles.container}>
    <div style={styles.card}>
      <h2 style={styles.title}>Welcome Back 👋</h2>
      <p style={styles.subtitle}>Login to continue</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>


      <p style={styles.switchText}>
        Don't have an account?{" "}
        <span onClick={() => setPage("signup")} style={styles.link}>
          Signup
        </span>
      </p>
    </div>
  </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)"
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "300px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
    
  },
  title: {
    marginBottom: "5px",
    color: "black"
  },
  subtitle: {
    marginBottom: "20px",
    color: "gray"
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none"
  },
  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#667eea",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"},

switchText: {
  marginTop: "15px",
  fontSize: "14px",
  fontWeight: "bold",
  textAlign: "center"
},

link: {
  color: "#4f46e5",
  cursor: "pointer",
  textDecoration: "underline"
}

  
};

export default Login;