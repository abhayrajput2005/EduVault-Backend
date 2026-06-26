from flask import Blueprint, jsonify, request
from bson import ObjectId
from dotenv import load_dotenv
from datetime import datetime
import jwt
import os

from models.user_model import users_collection
from models.note_model import notes_collection
from models.summary_model import summaries_collection
from models.mcq_model import mcqs_collection
from models.quiz_model import quiz_collection
from utils.db import db
from utils.paths import resolve_note_filepath
from models.subject_library_model import (
    analytics_collection,
    files_collection,
    requests_collection,
    subjects_collection,
)

load_dotenv()

admin = Blueprint("admin", __name__)
chat_collection = db["chat_messages"]


def _require_admin():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "", 1).strip()

    if not token:
        return None, (jsonify({"message": "Authentication required"}), 401)

    secret = os.getenv("SECRET_KEY")
    if not secret:
        return None, (jsonify({"message": "SECRET_KEY is not configured"}), 500)

    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
    except Exception:
        return None, (jsonify({"message": "Invalid or expired token"}), 401)

    user = users_collection.find_one({"email": payload.get("email")})

    if not user or not user.get("is_admin", False):
        return None, (jsonify({"message": "Admin access required"}), 403)

    return user, None


def _serialize_upload(note):
    filename = note.get("filename", "")

    return {
        "id": str(note["_id"]),
        "userId": str(note.get("user_id", "")),
        "filename": filename,
        "subject": note.get("subject", ""),
        "unit": note.get("unit", ""),
        "fileType": filename.split(".")[-1].upper() if "." in filename else "",
        "approved": bool(note.get("approved", False)),
        "hasSummary": summaries_collection.count_documents({"filename": filename}) > 0,
        "hasMcqs": mcqs_collection.count_documents({"filename": filename}) > 0,
        "uploadDate": note.get("created_at").isoformat()
        if note.get("created_at") else "",
    }


@admin.route("/analytics", methods=["GET"])
def analytics():
    _, error = _require_admin()
    if error:
        return error

    quiz_scores = list(quiz_collection.find({}, {"percentage": 1}))
    average_quiz_score = 0

    if quiz_scores:
        average_quiz_score = round(
            sum(float(q.get("percentage", 0)) for q in quiz_scores) / len(quiz_scores),
            1,
        )

    return jsonify({
        "users": users_collection.count_documents({}),
        "uploads": notes_collection.count_documents({}),
        "approved_uploads": notes_collection.count_documents({"approved": True}),
        "pending_uploads": notes_collection.count_documents({"approved": {"$ne": True}}),
        "quiz_attempts": quiz_collection.count_documents({}),
        "average_quiz_score": average_quiz_score,
        "total_subjects": subjects_collection.count_documents({}),
        "total_files": files_collection.count_documents({}),
        "total_downloads": sum(int(item.get("downloads", 0)) for item in files_collection.find({}, {"downloads": 1})),
        "summaries_generated": summaries_collection.count_documents({}),
        "quizzes_generated": mcqs_collection.count_documents({}),
        "ai_tutor_sessions": chat_collection.count_documents({}),
        "pending_requests": requests_collection.count_documents({"status": "pending"}),
        "recent_uploads": [
            {
                "id": str(item["_id"]),
                "subject_code": item.get("subject_code", ""),
                "subject_name": item.get("subject_name", ""),
                "original_name": item.get("original_name", ""),
                "category": item.get("category", ""),
                "created_at": item.get("created_at").isoformat() if item.get("created_at") else "",
            }
            for item in files_collection.find().sort([("created_at", -1)]).limit(5)
        ],
        "trending_subjects": [
            {
                "id": str(item["_id"]),
                "subject_code": item.get("subject_code", ""),
                "subject_name": item.get("subject_name", ""),
                "downloads": int(item.get("downloads", 0)),
                "file_count": item.get("file_count", files_collection.count_documents({"subject_id": item["_id"]})),
            }
            for item in subjects_collection.find().sort([("downloads", -1), ("views", -1)]).limit(5)
        ],
        "library_activity": analytics_collection.count_documents({}),
    })


@admin.route("/users", methods=["GET"])
def users():
    _, error = _require_admin()
    if error:
        return error

    items = []

    for user in users_collection.find().sort([("email", 1)]):
        items.append({
            "id": str(user["_id"]),
            "email": user.get("email", ""),
            "name": user.get("name", ""),
            "isAdmin": bool(user.get("is_admin", False)),
        })

    return jsonify(items)


@admin.route("/uploads", methods=["GET"])
def uploads():
    _, error = _require_admin()
    if error:
        return error

    items = [
        _serialize_upload(note)
        for note in notes_collection.find().sort([("created_at", -1)])
    ]

    return jsonify(items)


@admin.route("/uploads/<note_id>/approve", methods=["PATCH"])
def approve_upload(note_id):
    _, error = _require_admin()
    if error:
        return error

    result = notes_collection.update_one(
        {"_id": ObjectId(note_id)},
        {"$set": {"approved": True, "approved_at": datetime.utcnow()}},
    )

    if result.matched_count == 0:
        return jsonify({"message": "Upload not found"}), 404

    return jsonify({"message": "Upload approved"})


@admin.route("/uploads/<note_id>", methods=["DELETE"])
def delete_upload(note_id):
    _, error = _require_admin()
    if error:
        return error

    note = notes_collection.find_one({"_id": ObjectId(note_id)})

    if not note:
        return jsonify({"message": "Upload not found"}), 404

    filename = note.get("filename", "")
    filepath = resolve_note_filepath(note)

    notes_collection.delete_one({"_id": ObjectId(note_id)})
    summaries_collection.delete_many({"filename": filename})
    mcqs_collection.delete_many({"filename": filename})
    quiz_collection.delete_many({"filename": filename})
    chat_collection.delete_many({"filename": filename})

    if filepath and os.path.exists(filepath):
        os.remove(filepath)

    return jsonify({"message": "Upload deleted"})
