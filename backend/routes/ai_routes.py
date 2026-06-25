from flask import Blueprint, jsonify, request
import google.generativeai as genai
from dotenv import load_dotenv
from pptx import Presentation
from models.summary_model import summaries_collection
from models.mcq_model import mcqs_collection
from models.quiz_model import quiz_collection
from models.note_model import notes_collection
from datetime import datetime
import fitz
import json
import os

load_dotenv()

# ==========================================
# GEMINI CONFIG
# ==========================================

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")

ai = Blueprint("ai", __name__)

UPLOAD_FOLDER = "uploads"

# ==========================================
# HELPER FUNCTIONS
# ==========================================

def extract_text(filepath):

    text = ""

    if filepath.lower().endswith(".pptx"):

        prs = Presentation(filepath)

        for slide in prs.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    text += shape.text + "\n"

    elif filepath.lower().endswith(".pdf"):

        pdf = fitz.open(filepath)

        for page in pdf:
            text += page.get_text()

        pdf.close()

    else:
        raise Exception("Unsupported file format")

    return text


def clean_json(raw_text):

    raw_text = raw_text.strip()

    raw_text = raw_text.replace("```json", "")
    raw_text = raw_text.replace("```", "")

    return raw_text.strip()


# ==========================================
# TEST ROUTE
# ==========================================

@ai.route("/test", methods=["GET"])
def test():

    return jsonify({
        "message": "AI Routes Working Successfully 🚀"
    })


# ==========================================
# SUMMARY ROUTE
# ==========================================

@ai.route("/summary/<path:filename>", methods=["GET"])
def generate_summary(filename):

    try:

        # -----------------------
        # Check MongoDB Cache
        # -----------------------

        existing = summaries_collection.find_one({
            "filename": filename
        })

        if existing:

            return jsonify({

                "filename": filename,

                "subject": existing.get("subject"),

                "unit": existing.get("unit"),

                "summary": existing["summary"],

                "key_points": existing.get("key_points", []),

                "important_topics": existing.get(
                    "important_topics",
                    []
                ),

                "source": "cache"

            })

        # -----------------------
        # Get Subject & Unit
        # -----------------------

        note = notes_collection.find_one({
            "filename": filename
        })

        subject = ""
        unit = ""

        if note:

            subject = note.get("subject", "")

            unit = note.get("unit", "")

        filepath = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        if not os.path.exists(filepath):

            return jsonify({

                "message": "File not found"

            }), 404

        # -----------------------
        # Extract Text
        # -----------------------

        text = extract_text(filepath)

        if len(text.strip()) == 0:

            return jsonify({

                "message": "No text found"

            }), 400

        # -----------------------
        # Gemini Prompt
        # -----------------------

        prompt = f"""
You are an expert teacher.

Analyze the study material.

Return ONLY valid JSON.

Format:

{{
    "summary":[
        "Paragraph 1",
        "Paragraph 2"
    ],

    "key_points":[
        "Point 1",
        "Point 2",
        "Point 3",
        "Point 4",
        "Point 5"
    ],

    "important_topics":[
        "Topic 1",
        "Topic 2",
        "Topic 3",
        "Topic 4",
        "Topic 5"
    ]
}}

Rules:

1. Do NOT return markdown.
2. Do NOT return explanation.
3. Return JSON only.
4. Summary should be student-friendly.
5. Keep important topics short.

Study Material:

{text[:15000]}
"""

        response = model.generate_content(prompt)

        raw = clean_json(response.text)

        summary_json = json.loads(raw)

        summary = summary_json.get("summary", [])

        key_points = summary_json.get("key_points", [])

        important_topics = summary_json.get(
            "important_topics",
            []
        )

        summaries_collection.insert_one({

            "filename": filename,

            "subject": subject,

            "unit": unit,

            "summary": summary,

            "key_points": key_points,

            "important_topics": important_topics,

            "created_at": datetime.utcnow()

        })

        return jsonify({

            "filename": filename,

            "subject": subject,

            "unit": unit,

            "summary": summary,

            "key_points": key_points,

            "important_topics": important_topics,

            "source": "gemini"

        })

    except Exception as e:

        error = str(e)

        if "429" in error:

            return jsonify({

                "message": "Gemini quota exceeded. Please try again later."

            }), 429

        return jsonify({

            "error": error

        }), 500


# ==========================================
# PART 2 STARTS HERE
# ==========================================
# ==========================================
# MCQ ROUTE
# ==========================================

@ai.route("/mcq/<path:filename>", methods=["GET"])
def generate_mcqs(filename):

    try:

        # -----------------------
        # Check MongoDB Cache
        # -----------------------

        existing = mcqs_collection.find_one({
            "filename": filename
        })

        if existing:

            return jsonify({

                "filename": filename,

                "mcqs": existing["mcqs"],

                "source": "cache"

            })

        # -----------------------
        # Get Summary
        # -----------------------

        summary_doc = summaries_collection.find_one({
            "filename": filename
        })

        if not summary_doc:

            return jsonify({

                "message": "Generate summary first."

            }), 400

        summary_text = "\n".join(summary_doc.get("summary", []))

        prompt = f"""
You are an expert teacher.

Generate exactly 10 multiple choice questions.

Return ONLY valid JSON.

Format:

[
    {{
        "question":"Question",

        "options":[
            "Option A",
            "Option B",
            "Option C",
            "Option D"
        ],

        "answer":"Correct Option"
    }}
]

Rules:

1. JSON only.
2. No markdown.
3. Four options.
4. One correct answer.
5. Questions should help students prepare for exams.

Study Notes:

{summary_text}
"""

        response = model.generate_content(prompt)

        raw = clean_json(response.text)

        mcqs = json.loads(raw)

        mcqs_collection.insert_one({

            "filename": filename,

            "mcqs": mcqs,

            "created_at": datetime.utcnow()

        })

        return jsonify({

            "filename": filename,

            "mcqs": mcqs,

            "source": "gemini"

        })

    except Exception as e:

        error = str(e)

        if "429" in error:

            return jsonify({

                "message": "Gemini quota exceeded. Please try again later."

            }), 429

        return jsonify({

            "error": error

        }), 500


# ==========================================
# QUIZ SUBMIT
# ==========================================

@ai.route("/quiz/submit", methods=["POST"])
def submit_quiz():

    try:

        data = request.get_json()

        filename = data.get("filename")
        answers = data.get("answers", [])

        mcq_doc = mcqs_collection.find_one({

            "filename": filename

        })

        if not mcq_doc:

            return jsonify({

                "message": "MCQs not found."

            }), 404

        mcqs = mcq_doc["mcqs"]

        score = 0

        review = []

        for i, mcq in enumerate(mcqs):

            correct = mcq["answer"]

            user_answer = answers[i] if i < len(answers) else ""

            is_correct = user_answer == correct

            if is_correct:
                score += 1

            review.append({

                "question": mcq["question"],

                "selected": user_answer,

                "correct": correct,

                "is_correct": is_correct

            })

        total = len(mcqs)

        percentage = round(

            (score / total) * 100,

            2

        )

        if percentage >= 90:

            performance = "Excellent"

        elif percentage >= 75:

            performance = "Very Good"

        elif percentage >= 60:

            performance = "Good"

        elif percentage >= 40:

            performance = "Needs Improvement"

        else:

            performance = "Practice More"

        quiz_collection.insert_one({

            "filename": filename,

            "score": score,

            "total": total,

            "percentage": percentage,

            "performance": performance,

            "submitted_at": datetime.utcnow()

        })

        return jsonify({

            "filename": filename,

            "score": score,

            "total": total,

            "percentage": percentage,

            "performance": performance,

            "review": review

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500


# ==========================================
# QUIZ HISTORY
# ==========================================

@ai.route("/quiz/history", methods=["GET"])
def quiz_history():

    try:

        history = []

        quizzes = quiz_collection.find().sort([

            ("submitted_at", -1)

        ])

        for quiz in quizzes:

            history.append({

                "id": str(quiz["_id"]),

                "filename": quiz.get("filename"),

                "score": quiz.get("score"),

                "total": quiz.get("total"),

                "percentage": quiz.get("percentage"),

                "performance": quiz.get("performance"),

                "submitted_at": quiz.get("submitted_at").isoformat()

                if quiz.get("submitted_at") else ""

            })

        return jsonify(history)

    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500