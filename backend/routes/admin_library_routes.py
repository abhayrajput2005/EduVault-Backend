from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from bson import ObjectId
from datetime import datetime
import math
import os
import re

from models.note_model import notes_collection
from models.summary_model import summaries_collection
from models.mcq_model import mcqs_collection
from models.quiz_model import quiz_collection
from utils.db import db
from models.subject_library_model import (
    subjects_collection,
    files_collection,
    requests_collection,
)
from routes.library_routes import (
    _normalize_code,
    _serialize_subject,
    _serialize_file,
    _ai_filename,
    sync_library_file_to_notes,
    CATEGORY_ORDER,
)
from utils.auth_helpers import require_admin, FILE_CATEGORIES
from utils.cloudinary_storage import delete_material, upload_material
from utils.errors import api_error, handle_exception
from utils.paths import resolve_library_filepath, subject_library_dir

admin_library = Blueprint("admin_library", __name__)
chat_collection = db["chat_messages"]

ALLOWED_EXTENSIONS = {".pdf", ".ppt", ".pptx", ".docx", ".doc", ".txt"}


def _allowed_file(name: str) -> bool:
    ext = os.path.splitext(name)[1].lower()
    return ext in ALLOWED_EXTENSIONS


def _keywords(value):
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    return [item.strip() for item in str(value or "").split(",") if item.strip()]


@admin_library.route("/library/subjects", methods=["GET"])
def list_subjects():
    _, error = require_admin()
    if error:
        return error

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    q = _normalize_code(request.args.get("q", ""))

    query = {}
    if q:
        query = {
            "$or": [
                {"subject_code": {"$regex": re.escape(q), "$options": "i"}},
                {"subject_name": {"$regex": re.escape(q), "$options": "i"}},
            ]
        }

    total = subjects_collection.count_documents(query)
    page = max(1, page)
    limit = max(1, min(limit, 50))
    items = list(
        subjects_collection.find(query)
        .sort([("subject_code", 1)])
        .skip((page - 1) * limit)
        .limit(limit)
    )

    return jsonify({
        "items": [_serialize_subject(item) for item in items],
        "total": total,
        "page": page,
        "pages": math.ceil(total / limit) if total else 0,
    })


@admin_library.route("/library/subjects", methods=["POST"])
def create_subject():
    _, error = require_admin()
    if error:
        return error

    data = request.get_json(silent=True) or {}
    subject_code = _normalize_code(data.get("subject_code", ""))
    subject_name = (data.get("subject_name") or "").strip()

    if not subject_code or not subject_name:
        return api_error("Subject code and subject name are required", 400)

    if subjects_collection.find_one({"subject_code": subject_code}):
        return api_error("Subject code already exists", 400)

    doc = {
        "subject_code": subject_code,
        "subject_name": subject_name,
        "semester": (data.get("semester") or "").strip(),
        "department": (data.get("department") or "").strip(),
        "unit": (data.get("unit") or "").strip(),
        "keywords": _keywords(data.get("keywords")),
        "downloads": 0,
        "views": 0,
        "summary_generations": 0,
        "quiz_generations": 0,
        "tutor_sessions": 0,
        "file_count": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = subjects_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    subject_library_dir(subject_code)

    return jsonify(_serialize_subject(doc)), 201


@admin_library.route("/library/subjects/<subject_id>", methods=["PATCH"])
def update_subject(subject_id):
    _, error = require_admin()
    if error:
        return error

    subject = subjects_collection.find_one({"_id": ObjectId(subject_id)})
    if not subject:
        return api_error("Subject not found", 404)

    data = request.get_json(silent=True) or {}
    updates = {}

    if "subject_code" in data:
        code = _normalize_code(data["subject_code"])
        if not code:
            return api_error("Subject code cannot be empty", 400)
        existing = subjects_collection.find_one({
            "subject_code": code,
            "_id": {"$ne": subject["_id"]},
        })
        if existing:
            return api_error("Subject code already exists", 400)
        updates["subject_code"] = code

    for field in ("subject_name", "semester", "department", "unit"):
        if field in data:
            updates[field] = (data[field] or "").strip()
    if "keywords" in data:
        updates["keywords"] = _keywords(data.get("keywords"))

    if not updates:
        return api_error("No updates provided", 400)

    updates["updated_at"] = datetime.utcnow()
    subjects_collection.update_one({"_id": subject["_id"]}, {"$set": updates})

    updated = subjects_collection.find_one({"_id": subject["_id"]})
    return jsonify(_serialize_subject(updated))


@admin_library.route("/library/subjects/<subject_id>", methods=["DELETE"])
def delete_subject(subject_id):
    _, error = require_admin()
    if error:
        return error

    subject = subjects_collection.find_one({"_id": ObjectId(subject_id)})
    if not subject:
        return api_error("Subject not found", 404)

    file_docs = list(files_collection.find({"subject_id": subject["_id"]}))
    for file_doc in file_docs:
        _delete_file_record(file_doc)

    subjects_collection.delete_one({"_id": subject["_id"]})
    return jsonify({"message": "Subject deleted"})


def _delete_file_record(file_doc):
    filename = file_doc.get("filename", "")
    filepath = file_doc.get("filepath", "")
    delete_material(file_doc.get("cloudinary_public_id", ""))

    files_collection.delete_one({"_id": file_doc["_id"]})
    notes_collection.delete_many({"library_file_id": str(file_doc["_id"])})
    summaries_collection.delete_many({"filename": filename})
    mcqs_collection.delete_many({"filename": filename})
    quiz_collection.delete_many({"filename": filename})
    chat_collection.delete_many({"filename": filename})

    if filepath and os.path.exists(filepath):
        os.remove(filepath)

    if file_doc.get("subject_id"):
        subjects_collection.update_one(
            {"_id": file_doc["subject_id"]},
            {
                "$set": {
                    "updated_at": datetime.utcnow(),
                    "file_count": files_collection.count_documents({"subject_id": file_doc["subject_id"]}),
                }
            },
        )


@admin_library.route("/library/subjects/<subject_id>/files", methods=["POST"])
def upload_file(subject_id):
    _, error = require_admin()
    if error:
        return error

    subject = subjects_collection.find_one({"_id": ObjectId(subject_id)})
    if not subject:
        return api_error("Subject not found", 404)

    incoming_files = request.files.getlist("files") or request.files.getlist("file")
    incoming_files = [item for item in incoming_files if item and item.filename]
    if not incoming_files:
        return api_error("No file selected", 400)

    category = (request.form.get("category") or "pdf").strip()
    if category not in FILE_CATEGORIES:
        return api_error("Invalid file category", 400)

    unit = (request.form.get("unit") or subject.get("unit", "")).strip()
    uploaded = []

    for file in incoming_files:
        original_name = secure_filename(file.filename)
        if not original_name or not _allowed_file(original_name):
            return api_error(f"Unsupported file type: {file.filename}", 400)

        file_id = str(ObjectId())
        cloudinary_result = upload_material(file, subject_code=subject["subject_code"], file_id=file_id)
        ai_name = _ai_filename(subject["subject_code"], file_id, original_name)
        file_size = int(cloudinary_result.get("bytes") or request.content_length or 0)

        file_doc = {
            "_id": ObjectId(file_id),
            "subject_id": subject["_id"],
            "subject_code": subject["subject_code"],
            "subject_name": subject["subject_name"],
            "category": category,
            "original_name": original_name,
            "storage_name": "",
            "filename": ai_name,
            "filepath": "",
            "cloudinary_url": cloudinary_result.get("secure_url", ""),
            "cloudinary_public_id": cloudinary_result.get("public_id", ""),
            "unit": unit,
            "semester": subject.get("semester", ""),
            "department": subject.get("department", ""),
            "file_size": file_size,
            "downloads": 0,
            "views": 0,
            "summary_generations": 0,
            "quiz_generations": 0,
            "tutor_sessions": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }

        files_collection.insert_one(file_doc)
        sync_library_file_to_notes(file_doc, subject)
        uploaded.append(_serialize_file(file_doc, subject))

    subjects_collection.update_one(
        {"_id": subject["_id"]},
        {"$set": {"updated_at": datetime.utcnow(), "file_count": files_collection.count_documents({"subject_id": subject["_id"]})}},
    )

    if len(uploaded) == 1:
        return jsonify(uploaded[0]), 201
    return jsonify({"items": uploaded, "total": len(uploaded)}), 201


@admin_library.route("/library/files/<file_id>", methods=["PATCH"])
def update_file_metadata(file_id):
    _, error = require_admin()
    if error:
        return error

    file_doc = files_collection.find_one({"_id": ObjectId(file_id)})
    if not file_doc:
        return api_error("File not found", 404)

    subject = subjects_collection.find_one({"_id": file_doc.get("subject_id")})
    data = request.get_json(silent=True) or {}
    updates = {}

    if "category" in data:
        category = data["category"]
        if category not in FILE_CATEGORIES:
            return api_error("Invalid file category", 400)
        updates["category"] = category

    if "unit" in data:
        updates["unit"] = (data["unit"] or "").strip()

    if "original_name" in data:
        name = secure_filename(data["original_name"])
        if name:
            updates["original_name"] = name

    if not updates:
        return api_error("No updates provided", 400)

    updates["updated_at"] = datetime.utcnow()
    files_collection.update_one({"_id": file_doc["_id"]}, {"$set": updates})

    updated = files_collection.find_one({"_id": file_doc["_id"]})
    if subject:
        sync_library_file_to_notes(updated, subject)

    return jsonify(_serialize_file(updated, subject))


@admin_library.route("/library/files/<file_id>", methods=["PUT"])
def replace_file(file_id):
    _, error = require_admin()
    if error:
        return error

    file_doc = files_collection.find_one({"_id": ObjectId(file_id)})
    if not file_doc:
        return api_error("File not found", 404)

    subject = subjects_collection.find_one({"_id": file_doc.get("subject_id")})
    if not subject:
        return api_error("Subject not found", 404)

    if "file" not in request.files:
        return api_error("No file selected", 400)

    file = request.files["file"]
    if not file or file.filename == "":
        return api_error("No file selected", 400)

    original_name = secure_filename(file.filename)
    if not original_name or not _allowed_file(original_name):
        return api_error("Unsupported file type", 400)

    delete_material(file_doc.get("cloudinary_public_id", ""))
    cloudinary_result = upload_material(file, subject_code=subject["subject_code"], file_id=str(file_doc["_id"]))

    category = (request.form.get("category") or file_doc.get("category", "pdf")).strip()
    if category not in FILE_CATEGORIES:
        category = file_doc.get("category", "pdf")

    updates = {
        "original_name": original_name,
        "storage_name": "",
        "filepath": "",
        "cloudinary_url": cloudinary_result.get("secure_url", ""),
        "cloudinary_public_id": cloudinary_result.get("public_id", ""),
        "category": category,
        "unit": (request.form.get("unit") or file_doc.get("unit", "")).strip(),
        "file_size": int(cloudinary_result.get("bytes") or request.content_length or 0),
        "updated_at": datetime.utcnow(),
    }

    files_collection.update_one({"_id": file_doc["_id"]}, {"$set": updates})
    updated = files_collection.find_one({"_id": file_doc["_id"]})
    sync_library_file_to_notes(updated, subject)

    return jsonify(_serialize_file(updated, subject))


@admin_library.route("/library/files/<file_id>", methods=["DELETE"])
def delete_file(file_id):
    _, error = require_admin()
    if error:
        return error

    file_doc = files_collection.find_one({"_id": ObjectId(file_id)})
    if not file_doc:
        return api_error("File not found", 404)

    _delete_file_record(file_doc)
    return jsonify({"message": "File deleted"})


@admin_library.route("/library/requests", methods=["GET"])
def list_requests():
    _, error = require_admin()
    if error:
        return error

    status = request.args.get("status", "pending").strip()
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))

    query = {}
    if status and status != "all":
        query["status"] = status

    total = requests_collection.count_documents(query)
    page = max(1, page)
    limit = max(1, min(limit, 50))

    items = list(
        requests_collection.find(query)
        .sort([("created_at", -1)])
        .skip((page - 1) * limit)
        .limit(limit)
    )

    serialized = [{
        "id": str(item["_id"]),
        "subject_code": item.get("subject_code", ""),
        "subject_name": item.get("subject_name", ""),
        "student_email": item.get("student_email", ""),
        "student_name": item.get("student_name", ""),
        "message": item.get("message", ""),
        "status": item.get("status", "pending"),
        "created_at": item.get("created_at").isoformat() if item.get("created_at") else "",
    } for item in items]

    return jsonify({
        "items": serialized,
        "total": total,
        "page": page,
        "pages": math.ceil(total / limit) if total else 0,
    })


@admin_library.route("/library/requests/<request_id>", methods=["PATCH"])
def update_request(request_id):
    _, error = require_admin()
    if error:
        return error

    doc = requests_collection.find_one({"_id": ObjectId(request_id)})
    if not doc:
        return api_error("Request not found", 404)

    data = request.get_json(silent=True) or {}
    status = (data.get("status") or "resolved").strip()

    requests_collection.update_one(
        {"_id": doc["_id"]},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}},
    )

    return jsonify({"message": "Request updated"})
