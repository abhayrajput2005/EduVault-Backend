from flask import Blueprint, jsonify, redirect, request, send_file
from werkzeug.utils import secure_filename
from bson import ObjectId
from datetime import datetime
import math
import os
import re

from models.note_model import notes_collection
from models.summary_model import summaries_collection
from models.mcq_model import mcqs_collection
from models.subject_library_model import (
    subjects_collection,
    files_collection,
    requests_collection,
    ratings_collection,
    bookmarks_collection,
    analytics_collection,
)
from utils.auth_helpers import require_auth, FILE_CATEGORIES
from utils.errors import api_error, handle_exception
from utils.paths import resolve_library_filepath

library = Blueprint("library", __name__)

CATEGORY_ORDER = [
    "ppt",
    "pptx",
    "pdf",
    "doc",
    "docx",
    "lab_manual",
    "previous_year_papers",
]


def _normalize_code(value: str) -> str:
    return re.sub(r"\s+", "", (value or "").strip().upper())


COUNTER_BY_EVENT = {
    "view": "views",
    "download": "downloads",
    "summary": "summary_generations",
    "quiz": "quiz_generations",
    "tutor": "tutor_sessions",
}


def _rating_stats(file_ids):
    ids = [str(file_id) for file_id in file_ids]
    if not ids:
        return 0, 0

    rows = list(ratings_collection.find({"file_id": {"$in": ids}}, {"rating": 1}))
    if not rows:
        return 0, 0

    total = len(rows)
    average = round(sum(float(row.get("rating", 0)) for row in rows) / total, 1)
    return average, total


def _serialize_subject(doc, user=None):
    file_count = doc.get("file_count")
    if file_count is None:
        file_count = files_collection.count_documents({"subject_id": doc["_id"]})

    file_ids = [item["_id"] for item in files_collection.find({"subject_id": doc["_id"]}, {"_id": 1})]
    average_rating, total_ratings = _rating_stats(file_ids)
    user_id = str(user["_id"]) if user else ""

    return {
        "id": str(doc["_id"]),
        "subject_code": doc.get("subject_code", ""),
        "subject_name": doc.get("subject_name", ""),
        "semester": doc.get("semester", ""),
        "department": doc.get("department", ""),
        "unit": doc.get("unit", ""),
        "keywords": doc.get("keywords", []),
        "file_count": file_count,
        "downloads": int(doc.get("downloads", 0)),
        "views": int(doc.get("views", 0)),
        "average_rating": average_rating,
        "total_ratings": total_ratings,
        "last_updated": doc.get("updated_at").isoformat() if doc.get("updated_at") else "",
        "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else "",
        "bookmarked": bool(
            user_id and bookmarks_collection.find_one({
                "user_id": user_id,
                "subject_id": str(doc["_id"]),
            })
        ),
    }


def _ai_filename(subject_code: str, file_id: str, original_name: str) -> str:
    base = secure_filename(original_name) or "file"
    code = _normalize_code(subject_code)
    return f"lib_{code}_{file_id}_{base}"


def _serialize_file(doc, subject=None, user=None):
    filename = doc.get("filename", "")
    original_name = doc.get("original_name", filename)
    category = doc.get("category", "pdf")
    average_rating, total_ratings = _rating_stats([doc["_id"]])
    user_rating = None
    user_id = str(user["_id"]) if user else ""
    if user_id:
        rating_doc = ratings_collection.find_one({"file_id": str(doc["_id"]), "user_id": user_id})
        if rating_doc:
            user_rating = rating_doc.get("rating")

    return {
        "id": str(doc["_id"]),
        "subject_id": str(doc.get("subject_id", "")),
        "subject_code": subject.get("subject_code", "") if subject else doc.get("subject_code", ""),
        "subject_name": subject.get("subject_name", "") if subject else doc.get("subject_name", ""),
        "filename": filename,
        "original_name": original_name,
        "category": category,
        "category_label": FILE_CATEGORIES.get(category, category),
        "unit": doc.get("unit", ""),
        "semester": doc.get("semester", ""),
        "department": doc.get("department", ""),
        "file_type": original_name.split(".")[-1].upper() if "." in original_name else "",
        "file_size": doc.get("file_size", 0),
        "upload_date": doc.get("created_at").isoformat() if doc.get("created_at") else "",
        "updated_at": doc.get("updated_at").isoformat() if doc.get("updated_at") else "",
        "cloudinary_url": doc.get("cloudinary_url", ""),
        "downloads": int(doc.get("downloads", 0)),
        "views": int(doc.get("views", 0)),
        "summary_generations": int(doc.get("summary_generations", 0)),
        "quiz_generations": int(doc.get("quiz_generations", 0)),
        "tutor_sessions": int(doc.get("tutor_sessions", 0)),
        "average_rating": average_rating,
        "total_ratings": total_ratings,
        "user_rating": user_rating,
        "has_summary": summaries_collection.count_documents({"filename": filename}) > 0,
        "has_mcqs": mcqs_collection.count_documents({"filename": filename}) > 0,
        "download_url": f"/library/files/{doc['_id']}/download",
        "preview_url": f"/library/files/{doc['_id']}/download?preview=true",
    }


def _paginate(collection, query, page: int, limit: int, sort=None):
    page = max(1, page)
    limit = max(1, min(limit, 50))
    total = collection.count_documents(query)
    cursor = collection.find(query).sort(sort or [("subject_code", 1)]).skip((page - 1) * limit).limit(limit)
    return list(cursor), total, page, limit


def _track_file_event(file_doc, event, user=None):
    field = COUNTER_BY_EVENT.get(event)
    if not file_doc or not field:
        return

    now = datetime.utcnow()
    files_collection.update_one({"_id": file_doc["_id"]}, {"$inc": {field: 1}, "$set": {"updated_at": now}})
    subject_id = file_doc.get("subject_id")
    if subject_id:
        subjects_collection.update_one(
            {"_id": subject_id},
            {"$inc": {field: 1}, "$set": {"updated_at": now}},
        )
    analytics_collection.insert_one({
        "event": event,
        "file_id": str(file_doc["_id"]),
        "subject_id": str(subject_id or ""),
        "subject_code": file_doc.get("subject_code", ""),
        "user_id": str(user["_id"]) if user else "",
        "created_at": now,
    })


def track_library_file_event_by_filename(filename, event, user_id=None):
    file_doc = files_collection.find_one({"filename": filename})
    if not file_doc:
        return
    now = datetime.utcnow()
    field = COUNTER_BY_EVENT.get(event)
    if not field:
        return
    files_collection.update_one({"_id": file_doc["_id"]}, {"$inc": {field: 1}, "$set": {"updated_at": now}})
    if file_doc.get("subject_id"):
        subjects_collection.update_one(
            {"_id": file_doc["subject_id"]},
            {"$inc": {field: 1}, "$set": {"updated_at": now}},
        )
    analytics_collection.insert_one({
        "event": event,
        "file_id": str(file_doc["_id"]),
        "subject_id": str(file_doc.get("subject_id", "")),
        "subject_code": file_doc.get("subject_code", ""),
        "user_id": user_id or "",
        "created_at": now,
    })


@library.route("/subjects/search", methods=["GET"])
def search_subjects():
    try:
        user, error = require_auth()
        if error:
            return error

        raw_q = (request.args.get("q", "") or "").strip()
        code_q = _normalize_code(raw_q)
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))

        query = {}
        if raw_q:
            escaped = re.escape(raw_q)
            query = {
                "$or": [
                    {"subject_code": {"$regex": re.escape(code_q), "$options": "i"}},
                    {"subject_name": {"$regex": escaped, "$options": "i"}},
                    {"department": {"$regex": escaped, "$options": "i"}},
                    {"semester": {"$regex": escaped, "$options": "i"}},
                    {"keywords": {"$regex": escaped, "$options": "i"}},
                ]
            }

        items, total, page, limit = _paginate(
            subjects_collection,
            query,
            page,
            limit,
            [("downloads", -1), ("updated_at", -1), ("subject_code", 1)] if not raw_q else [("subject_code", 1)],
        )

        return jsonify({
            "items": [_serialize_subject(item, user) for item in items],
            "total": total,
            "page": page,
            "pages": math.ceil(total / limit) if total else 0,
        }), 200

    except Exception as e:
        return handle_exception(e, "Unable to search subjects.")


@library.route("/subjects/suggestions", methods=["GET"])
def subject_suggestions():
    try:
        _, error = require_auth()
        if error:
            return error

        raw_q = (request.args.get("q", "") or "").strip()
        code_q = _normalize_code(raw_q)
        if len(raw_q) < 2:
            return jsonify([]), 200

        escaped = re.escape(raw_q)
        matches = subjects_collection.find({
            "$or": [
                {"subject_code": {"$regex": f"^{re.escape(code_q)}", "$options": "i"}},
                {"subject_name": {"$regex": escaped, "$options": "i"}},
                {"department": {"$regex": escaped, "$options": "i"}},
                {"semester": {"$regex": escaped, "$options": "i"}},
                {"keywords": {"$regex": escaped, "$options": "i"}},
            ]
        }).sort([("downloads", -1), ("subject_code", 1)]).limit(8)

        suggestions = []
        for doc in matches:
            label = f"{doc.get('subject_code', '')} - {doc.get('subject_name', '')}".strip(" -")
            if label:
                suggestions.append(label)

        return jsonify(suggestions), 200

    except Exception as e:
        return handle_exception(e, "Unable to load suggestions.")


@library.route("/subjects/sections", methods=["GET"])
def subject_sections():
    try:
        user, error = require_auth()
        if error:
            return error

        trending = list(subjects_collection.find().sort([("downloads", -1), ("views", -1)]).limit(6))
        recent = list(subjects_collection.find().sort([("created_at", -1), ("updated_at", -1)]).limit(6))
        bookmark_subject_ids = [
            ObjectId(item["subject_id"])
            for item in bookmarks_collection.find({"user_id": str(user["_id"])}, {"subject_id": 1}).limit(12)
            if ObjectId.is_valid(item.get("subject_id", ""))
        ]
        bookmarked = list(subjects_collection.find({"_id": {"$in": bookmark_subject_ids}}).limit(6))

        return jsonify({
            "trending": [_serialize_subject(item, user) for item in trending],
            "recently_added": [_serialize_subject(item, user) for item in recent],
            "bookmarked": [_serialize_subject(item, user) for item in bookmarked],
        }), 200

    except Exception as e:
        return handle_exception(e, "Unable to load subject library sections.")


@library.route("/subjects/<subject_code>/files", methods=["GET"])
def files_by_subject(subject_code):
    try:
        user, error = require_auth()
        if error:
            return error

        code = _normalize_code(subject_code)
        subject = subjects_collection.find_one({"subject_code": {"$regex": f"^{re.escape(code)}$", "$options": "i"}})

        if not subject:
            return jsonify({
                "subject": None,
                "groups": {},
                "files": [],
                "total": 0,
                "page": 1,
                "pages": 0,
            }), 200

        category = request.args.get("category", "").strip()
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 20))

        file_query = {"subject_id": subject["_id"]}
        if category and category in FILE_CATEGORIES:
            file_query["category"] = category

        items, total, page, limit = _paginate(
            files_collection,
            file_query,
            page,
            limit,
            [("category", 1), ("created_at", -1)],
        )

        serialized = [_serialize_file(item, subject, user) for item in items]
        groups = {key: [] for key in CATEGORY_ORDER}
        for item in serialized:
            groups.setdefault(item["category"], []).append(item)

        return jsonify({
            "subject": _serialize_subject(subject, user),
            "groups": {k: groups.get(k, []) for k in CATEGORY_ORDER},
            "files": serialized,
            "total": total,
            "page": page,
            "pages": math.ceil(total / limit) if total else 0,
        }), 200

    except Exception as e:
        return handle_exception(e, "Unable to load subject files.")


@library.route("/files/<file_id>/download", methods=["GET"])
def download_file(file_id):
    try:
        user, error = require_auth()
        if error:
            return error

        doc = files_collection.find_one({"_id": ObjectId(file_id)})
        if not doc:
            return api_error("File not found", 404)

        preview = request.args.get("preview") == "true"
        _track_file_event(doc, "view" if preview else "download", user)

        if doc.get("cloudinary_url"):
            return redirect(doc["cloudinary_url"], code=302)

        subject = subjects_collection.find_one({"_id": doc.get("subject_id")})
        filepath = doc.get("filepath") or resolve_library_filepath(
            subject.get("subject_code", "") if subject else "",
            doc.get("storage_name", doc.get("original_name", "")),
        )

        if not os.path.exists(filepath):
            return api_error("File not found on server", 404)

        return send_file(
            filepath,
            as_attachment=not preview,
            download_name=doc.get("original_name", "download"),
        )

    except Exception as e:
        return handle_exception(e, "Download failed.")


@library.route("/subjects/<subject_id>/bookmark", methods=["POST", "DELETE"])
def toggle_subject_bookmark(subject_id):
    try:
        user, error = require_auth()
        if error:
            return error

        if not ObjectId.is_valid(subject_id):
            return api_error("Invalid subject id", 400)

        subject = subjects_collection.find_one({"_id": ObjectId(subject_id)})
        if not subject:
            return api_error("Subject not found", 404)

        query = {"subject_id": subject_id, "user_id": str(user["_id"])}
        if request.method == "DELETE":
            bookmarks_collection.delete_one(query)
            return jsonify({"bookmarked": False}), 200

        bookmarks_collection.update_one(
            query,
            {
                "$set": {
                    "subject_id": subject_id,
                    "subject_code": subject.get("subject_code", ""),
                    "user_id": str(user["_id"]),
                    "updated_at": datetime.utcnow(),
                },
                "$setOnInsert": {"created_at": datetime.utcnow()},
            },
            upsert=True,
        )
        return jsonify({"bookmarked": True}), 200

    except Exception as e:
        return handle_exception(e, "Unable to update bookmark.")


@library.route("/files/<file_id>/ratings", methods=["GET"])
def file_ratings(file_id):
    try:
        user, error = require_auth()
        if error:
            return error

        if not ObjectId.is_valid(file_id):
            return api_error("Invalid file id", 400)

        reviews = []
        for item in ratings_collection.find({"file_id": file_id}).sort([("created_at", -1)]).limit(10):
            reviews.append({
                "id": str(item["_id"]),
                "rating": item.get("rating", 0),
                "feedback": item.get("feedback", ""),
                "student_name": item.get("student_name", "Student"),
                "created_at": item.get("created_at").isoformat() if item.get("created_at") else "",
                "mine": item.get("user_id") == str(user["_id"]),
            })

        average_rating, total_ratings = _rating_stats([ObjectId(file_id)])
        return jsonify({
            "average_rating": average_rating,
            "total_ratings": total_ratings,
            "reviews": reviews,
        }), 200

    except Exception as e:
        return handle_exception(e, "Unable to load ratings.")


@library.route("/files/<file_id>/ratings", methods=["POST"])
def rate_file(file_id):
    try:
        user, error = require_auth()
        if error:
            return error

        if not ObjectId.is_valid(file_id):
            return api_error("Invalid file id", 400)

        file_doc = files_collection.find_one({"_id": ObjectId(file_id)})
        if not file_doc:
            return api_error("File not found", 404)

        data = request.get_json(silent=True) or {}
        rating = int(data.get("rating", 0))
        feedback = (data.get("feedback") or "").strip()

        if rating < 1 or rating > 5:
            return api_error("Rating must be between 1 and 5", 400)

        query = {"file_id": file_id, "user_id": str(user["_id"])}
        if ratings_collection.find_one(query):
            return api_error("You have already rated this file", 400)

        ratings_collection.insert_one({
            **query,
            "subject_id": str(file_doc.get("subject_id", "")),
            "subject_code": file_doc.get("subject_code", ""),
            "rating": rating,
            "feedback": feedback,
            "student_name": user.get("name", "") or user.get("email", "Student"),
            "created_at": datetime.utcnow(),
        })

        analytics_collection.insert_one({
            "event": "rating",
            "file_id": file_id,
            "subject_id": str(file_doc.get("subject_id", "")),
            "subject_code": file_doc.get("subject_code", ""),
            "user_id": str(user["_id"]),
            "created_at": datetime.utcnow(),
        })

        return jsonify({"message": "Rating submitted"}), 201

    except Exception as e:
        return handle_exception(e, "Unable to submit rating.")


@library.route("/requests", methods=["POST"])
def submit_request():
    try:
        user, error = require_auth()
        if error:
            return error

        data = request.get_json(silent=True) or {}
        subject_code = _normalize_code(data.get("subject_code", ""))
        message = (data.get("message") or "").strip()

        if not subject_code:
            return api_error("Subject code is required", 400)

        subject = subjects_collection.find_one({
            "subject_code": {"$regex": f"^{re.escape(subject_code)}$", "$options": "i"}
        })

        requests_collection.insert_one({
            "subject_code": subject_code,
            "subject_name": subject.get("subject_name", "") if subject else data.get("subject_name", ""),
            "student_id": str(user["_id"]),
            "student_email": user.get("email", ""),
            "student_name": user.get("name", ""),
            "message": message,
            "status": "pending",
            "created_at": datetime.utcnow(),
        })

        return jsonify({"message": "Material request submitted. An admin will review it."}), 201

    except Exception as e:
        return handle_exception(e, "Unable to submit request.")


def sync_library_file_to_notes(file_doc, subject_doc):
    """Register library file in notes collection for AI features."""
    filename = file_doc.get("filename", "")
    if not filename:
        return

    notes_collection.update_one(
        {"library_file_id": str(file_doc["_id"])},
        {
            "$set": {
                "subject": subject_doc.get("subject_name", ""),
                "unit": file_doc.get("unit") or subject_doc.get("unit", ""),
                "filename": filename,
                "filepath": file_doc.get("filepath", ""),
                "cloudinary_url": file_doc.get("cloudinary_url", ""),
                "cloudinary_public_id": file_doc.get("cloudinary_public_id", ""),
                "original_name": file_doc.get("original_name", ""),
                "uploaded_by": "Subject Library",
                "approved": True,
                "library_file_id": str(file_doc["_id"]),
                "updated_at": datetime.utcnow(),
            },
            "$setOnInsert": {"created_at": datetime.utcnow()},
        },
        upsert=True,
    )
