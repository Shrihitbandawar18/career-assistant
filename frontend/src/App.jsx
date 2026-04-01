import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div style={styles.container}>
      
      {page === "login" && <Login setPage={setPage} />}
      {page === "signup" && <Signup setPage={setPage} />}
      {page === "dashboard" && <Dashboard />}

    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};

export default App;