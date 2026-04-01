import { useState } from "react";
import "./Signup.css";

function Signup({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("https://career-backend.onrender.com/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
    } else {
      alert(data.message || "Signup failed");
    }

  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
};
  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Account ✨</h2>
        <p className="signup-subtitle">Join us today</p>

        <form onSubmit={handleSubmit}>
          <input
            className="signup-input"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />

          <input
            className="signup-input"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            className="signup-input"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}

          
          />

          <button className="signup-button" type="submit">
            Sign Up
          </button>
        </form>
        

<p className="switch-text">
  Already have an account? 
  <span onClick={() => setPage("login")}> Login </span>
</p>
      </div>
    </div>
  );
}

export default Signup;