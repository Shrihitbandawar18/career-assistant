from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User
from models import db, User, History
from PyPDF2 import PdfReader
import json
import os
import sqlite3

import sqlite3

def init_db():
    import os

    DB_PATH = os.path.join(os.getcwd(), "users.db")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # USERS TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        password TEXT
    )
    """)

    # HISTORY TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        action TEXT,
        result TEXT
    )
    """)

    conn.commit()
    conn.close()


app = Flask(__name__)
init_db()
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Create DB
with app.app_context():
    db.create_all()

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        print("DATA RECEIVED:", data)

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "User already exists"}), 400

        new_user = User(name=name, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"})

    except Exception as e:
        print("SIGNUP ERROR:", e)
        return jsonify({"message": "Server error"}), 500
    
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        print("LOGIN DATA:", data)

        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()

        if not user or user.password != password:
            return jsonify({"message": "Invalid credentials"}), 401

        return jsonify({"message": "Login successful"})

    except Exception as e:
        print("LOGIN ERROR:", e)
        return jsonify({"message": "Server error"}), 500

@app.route('/api/recommend', methods=['POST'])
def recommend():
    print("🔥 recommend API HIT")
    try:
        data = request.json

        skills = (data.get('skills') or "").lower()
        interest = (data.get('interest') or "").lower()

        career_scores = {
            "Backend Developer": 0,
            "Data Analyst": 0,
            "AI Engineer": 0,
            "Frontend Developer": 0
        }

        # Skills based scoring
        if "python" in skills:
            career_scores["Backend Developer"] += 4
            career_scores["AI Engineer"] += 3

        if "sql" in skills:
            career_scores["Data Analyst"] += 4

        if "html" in skills or "css" in skills:
            career_scores["Frontend Developer"] += 4

        # Interest based scoring
        if "ai" in interest:
            career_scores["AI Engineer"] += 5

        if "data" in interest:
            career_scores["Data Analyst"] += 3

        # Score system
        scores = {
            "Backend Developer": 0,
            "Data Analyst": 0,
            "AI Engineer": 0,
            "Frontend Developer": 0
        }

        if "python" in skills:
            scores["Backend Developer"] += 3
            scores["AI Engineer"] += 2

        if "sql" in skills:
            scores["Data Analyst"] += 3

        if "html" in skills or "css" in skills:
            scores["Frontend Developer"] += 3

        if "ai" in interest:
            scores["AI Engineer"] += 4

        if "data" in interest:
            scores["Data Analyst"] += 2
        if "python" in skills and "sql" in skills:
            career_scores["Backend Developer"] += 6

        if "ml" in skills or "machine learning" in skills:
            career_scores["AI Engineer"] += 6

        if "excel" in skills or "power bi" in skills:
            career_scores["Data Analyst"] += 5

        # Skill gaps
        skill_gaps = {
            "Backend Developer": ["APIs", "Databases"],
            "Data Analyst": ["Excel", "Power BI"],
            "AI Engineer": ["Machine Learning"],
            "Frontend Developer": ["React"]
        }

        # Roadmap
        roadmaps = {
            "Backend Developer": ["Learn Python", "Build APIs"],
            "Data Analyst": ["Learn SQL", "Excel"],
            "AI Engineer": ["Learn ML", "Projects"],
            "Frontend Developer": ["HTML/CSS", "React"]
        }

        # Job roles
        job_roles = {
            "Backend Developer": ["API Developer", "Backend Engineer"],
            "Data Analyst": ["BI Analyst", "Data Executive"],
            "AI Engineer": ["ML Engineer"],
            "Frontend Developer": ["React Developer"]
        }

        # Sort results
        sorted_roles = sorted(career_scores.items(), key=lambda x: x[1], reverse=True)
        max_score = max(career_scores.values()) if max(career_scores.values()) > 0 else 1

        results = []

        for role, score in career_scores.items():
            if score > 0:
                percentage = (score / max_score) * 100

                if role == "Backend Developer":
                    reason = "Strong Python/backend skills detected"
                elif role == "Data Analyst":
                    reason = "Good data and SQL understanding"
                elif role == "AI Engineer":
                    reason = "AI/ML interest and skills detected"
                elif role == "Frontend Developer":
                    reason = "UI and design skills found"
                else:
                    reason = "Matches your profile"

                results.append({
                    "role": role,
                    "percentage": percentage,
                    "reason": reason
                })
        results = sorted(results, key=lambda x: x['percentage'], reverse=True)
        print("RESULTS:", results)
        print("💾 SAVING HISTORY:", results)
        history = History(
            email="test_user",
            action="Career Recommendation",
            result=json.dumps(results)
        )

        db.session.add(history)
        db.session.commit()

        # cursor = conn.cursor()

        # cursor.execute(
        #     "INSERT INTO history (action, email, result) VALUES (?, ?, ?)",
        #     (
        #         "Career Recommendation",
        #         data.get("email", "test_user"),   
        #         json.dumps(results)              
        #     )
        # )

        # conn.commit()

        return jsonify({"results": results})
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"message": "Server error"}), 500

@app.route('/api/resume', methods=['POST'])
def analyze_resume():
    try:
        import json
        import sqlite3
        from PyPDF2 import PdfReader

        file = request.files.get("file")

        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        # ✅ Check file type
        if not file.filename.endswith(".pdf"):
            return jsonify({"error": "Only PDF allowed"}), 400

        # ✅ Safe PDF read
        try:
            reader = PdfReader(file)
        except Exception as e:
            print("PDF READ ERROR:", e)
            return jsonify({"error": "Invalid PDF file"}), 400

        text = ""

        # ✅ Safe text extraction
        for page in reader.pages:
            try:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
            except:
                continue

        if not text:
            return jsonify({"error": "Could not read PDF content"}), 400

        text = text.lower()

        # ===== ANALYSIS =====
        score = 0
        strengths = []
        weaknesses = []
        missing = []

        keywords = {
            "python": 10,
            "sql": 10,
            "machine learning": 10,
            "project": 10,
            "internship": 10,
            "api": 10,
            "git": 10
        }

        for key, value in keywords.items():
            if key in text:
                score += value
                strengths.append(f"{key} detected")
            else:
                missing.append(key)

        if "internship" not in text:
            weaknesses.append("No internship experience")

        if "git" not in text:
            weaknesses.append("No Git usage")

        ats_score = score

        # ===== CAREER MATCH =====
        career_scores = {
            "Backend Developer": 0,
            "Data Analyst": 0,
            "AI Engineer": 0
        }

        if "python" in text:
            career_scores["Backend Developer"] += 3
            career_scores["AI Engineer"] += 2

        if "sql" in text:
            career_scores["Data Analyst"] += 3

        if "machine learning" in text:
            career_scores["AI Engineer"] += 4

        career_results = [
            {"role": role, "score": s}
            for role, s in sorted(career_scores.items(), key=lambda x: x[1], reverse=True)
            if s > 0
        ]

        # ===== SUGGESTIONS =====
        suggestions = []

        if "projects" not in text:
            suggestions.append("Add projects section")

        if "experience" not in text:
            suggestions.append("Add experience section")

        if "skills" not in text:
            suggestions.append("Mention technical skills clearly")

        result = {
            "score": score,
            "ats": ats_score,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "missing": missing[:5],
            "careers": career_results,
            "suggestions": suggestions
        }

        # ===== SAVE HISTORY =====
        try:
            conn = sqlite3.connect("users.db")
            cursor = conn.cursor()

            cursor.execute(
                "INSERT INTO history (action, email, result) VALUES (?, ?, ?)",
                ("Resume Analysis", "test_user", json.dumps(result))
            )

            conn.commit()
            conn.close()
            print("💾 Resume saved")

        except Exception as db_err:
            print("DB ERROR:", db_err)

        return jsonify(result)

    except Exception as e:
        print("RESUME ERROR:", e)
        return jsonify({"error": "Server crash"}), 500
@app.route('/api/jobs', methods=['POST'])
def get_jobs():
    try:
        import json
        import sqlite3

        data = request.json
        role = (data.get('role') or "").lower().strip()

        jobs = []

        # 🔥 SMART ROLE MATCHING
        if any(x in role for x in ["backend", "python", "django"]):
            jobs = [
                {
                    "title": "Backend Developer",
                    "company": "TCS",
                    "link": "https://www.tcs.com/careers"
                },
                {
                    "title": "Python Developer",
                    "company": "Infosys",
                    "link": "https://www.infosys.com/careers"
                },
                {
                    "title": "Django Developer",
                    "company": "Zoho",
                    "link": "https://www.zoho.com/careers.html"
                }
            ]

        elif any(x in role for x in ["data", "analyst", "sql"]):
            jobs = [
                {
                    "title": "Data Analyst",
                    "company": "Wipro",
                    "link": "https://careers.wipro.com"
                },
                {
                    "title": "Business Analyst",
                    "company": "Accenture",
                    "link": "https://www.accenture.com/in-en/careers"
                },
                {
                    "title": "Data Scientist",
                    "company": "IBM",
                    "link": "https://www.ibm.com/careers"
                }
            ]

        elif any(x in role for x in ["ai", "ml", "machine learning"]):
            jobs = [
                {
                    "title": "AI Engineer",
                    "company": "Google",
                    "link": "https://careers.google.com/jobs/results/"
                },
                {
                    "title": "ML Engineer",
                    "company": "Amazon",
                    "link": "https://www.amazon.jobs/en/"
                },
                {
                    "title": "AI Research Intern",
                    "company": "Microsoft",
                    "link": "https://careers.microsoft.com"
                }
            ]

        elif any(x in role for x in ["frontend", "react", "web"]):
            jobs = [
                {
                    "title": "Frontend Developer",
                    "company": "Flipkart",
                    "link": "https://www.flipkartcareers.com"
                },
                {
                    "title": "React Developer",
                    "company": "Paytm",
                    "link": "https://paytm.com/careers"
                }
            ]

        elif any(x in role for x in ["full stack", "fullstack"]):
            jobs = [
                {
                    "title": "Full Stack Developer",
                    "company": "Startup",
                    "link": "https://angel.co/jobs"
                },
                {
                    "title": "Software Engineer",
                    "company": "Adobe",
                    "link": "https://careers.adobe.com"
                }
            ]

        else:
            jobs = [
                {
                    "title": "Software Developer",
                    "company": "Naukri",
                    "link": "https://www.naukri.com"
                },
                {
                    "title": "Engineer",
                    "company": "LinkedIn Jobs",
                    "link": "https://www.linkedin.com/jobs"
                }
            ]

        print("🔥 JOBS GENERATED:", jobs)

        # ✅ SAVE HISTORY (ONLY SQLITE — CLEAN)
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO history (action, email, result) VALUES (?, ?, ?)",
            ("Job Search", "test_user", json.dumps(jobs))
        )

        conn.commit()
        conn.close()

        print("💾 JOB HISTORY SAVED")

        return jsonify({"jobs": jobs})

    except Exception as e:
        print("JOB ERROR:", e)
        return jsonify({"message": "Server error"}), 500
@app.route("/api/history", methods=["GET"])
def get_history():
    try:
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()

        cursor.execute("SELECT action, result FROM history")
        rows = cursor.fetchall()

        history_data = []

        for row in rows:
            action, result = row

            try:
                parsed = json.loads(result)
            except:
                parsed = []

            history_data.append({
                "action": action,
                "result": parsed
            })

        conn.close()
        return jsonify(history_data)

    except Exception as e:
        print("HISTORY ERROR:", e)
        return jsonify({"error": "Failed"}), 500
@app.route('/api/clear-history', methods=['DELETE'])
def clear_history():
    try:
        History.query.delete()
        db.session.commit()

        print("🧹 History cleared")

        return jsonify({"message": "History cleared successfully"})

    except Exception as e:
        print("CLEAR ERROR:", e)
        return jsonify({"message": "Error clearing history"}), 500


import os
from groq import Groq
import os

client = Groq(api_key="API KEY")  # direct for now

@app.route('/api/chat', methods=['POST'])
def chatbot():
    try:
        data = request.json
        messages = data.get("messages")  

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.7,
            max_tokens=300
        )

        answer = response.choices[0].message.content

        print("BOT:", answer)

        return jsonify({"answer": answer})

    except Exception as e:
        print("FULL ERROR:", str(e))   # 🔥 IMPORTANT
        return jsonify({"answer": "Error from AI"}), 500

@app.route('/api/roadmap', methods=['POST'])
def roadmap():
    try:
        import sqlite3
        import json

        data = request.json
        role = data.get("role", "").lower()

        # ✅ ROADMAP DATA
        roadmap_data = {
            "phases": [
                {
                    "title": "Phase 1: Basics",
                    "steps": [
                        "Learn Python fundamentals",
                        "Understand problem solving",
                        "Learn basic data structures"
                    ]
                },
                {
                    "title": "Phase 2: Intermediate",
                    "steps": [
                        "Learn core concepts of the field",
                        "Build small projects",
                        "Understand real-world applications"
                    ]
                },
                {
                    "title": "Phase 3: Advanced",
                    "steps": [
                        "Work on advanced projects",
                        "Learn system design",
                        "Prepare for interviews"
                    ]
                }
            ],
            "tools": ["Python", "Git", "VS Code", "Postman"],
            "projects": [
                "Build real-world project",
                "Deploy application",
                "Create portfolio"
            ],
            "timeline": "3 to 6 months depending on consistency"
        }

        # ✅ SAVE TO HISTORY
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO history (action, email, result) VALUES (?, ?, ?)",
            (
                "Roadmap Generator",
                "test_user",
                json.dumps({
                    "role": role,
                    "roadmap": roadmap_data
                })
            )
        )

        conn.commit()
        conn.close()

        print("💾 ROADMAP SAVED")

        return jsonify(roadmap_data)

    except Exception as e:
        print("ROADMAP ERROR:", e)
        return jsonify({"error": "Server error"}), 500
       
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)