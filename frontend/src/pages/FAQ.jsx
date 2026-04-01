import { useState } from "react";

function FAQ() {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!question) return;

    const userMessage = {
      role: "user",
      content: question
    };

    // ✅ Add user message
    setChat((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [...chat, userMessage]
        })
      });

      const data = await res.json();
      console.log("BOT RESPONSE:", data);

      // ✅ Add bot response (FIXED)
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "No response"
        }
      ]);

    } catch (err) {
      console.error("CHAT ERROR:", err);
    }

    setQuestion("");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>AI Chatbot 🤖</h2>

      {/* CHAT AREA */}
      <div style={styles.chatBox}>
        {chat.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#667eea" : "#e5e7eb",
              color: msg.role === "user" ? "#fff" : "#000"
            }}
          >
            <b>{msg.role === "user" ? "You" : "Bot"}:</b> {msg.content}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    height: "80vh",
    maxWidth: "1000px",
    margin: "auto"
  },
  chatBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "10px"
  },
  message: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "70%",
    wordWrap: "break-word"
  },
  inputBox: {
    display: "flex",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    background: "#667eea",
    color: "#fff",
    cursor: "pointer"
  },
  title: {
    color: "black",
    marginBottom: "10px"
  }
};

export default FAQ;