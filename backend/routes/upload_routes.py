from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from models.note_model import notes_collection
from models.summary_model import summaries_collection
from models.mcq_model import mcqs_collection
from models.quiz_model import quiz_collection
from utils.paths import UPLOAD_FOLDER, resolve_note_filepath, resolve_upload_filepath
from utils.errors import api_error, handle_exception
from datetime import datetime
from bson import ObjectId
import os

upload = Blueprint("upload", __name__)


# =====================================================
# UPLOAD FILE
# =====================================================

@upload.route("/upload", methods=["POST"])
def upload_file():

    try:

        if "file" not in request.files:
            return jsonify({
                "message": "No file selected"
            }), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({
                "message": "No file selected"
            }), 400

        subject = request.form.get("subject", "General")
        unit = request.form.get("unit", "Unit 1")

        filename = secure_filename(file.filename)

        existing = notes_collection.find_one({
            "filename": filename,
            "subject": subject,
            "unit": unit
        })

        if existing:
            return jsonify({
                "message": "This note already exists."
            }), 400

        filepath = resolve_upload_filepath(filename)

        file.save(filepath)

        created_at = datetime.utcnow()

        result = notes_collection.insert_one({

            "subject": subject,
            "unit": unit,

            "filename": filename,
            "filepath": filepath,

            "uploaded_by": "Admin",

            "approved": True,

            "created_at": created_at

        })

        return jsonify({

            "message": "Upload Successful",

            "id": str(result.inserted_id),

            "subject": subject,

            "unit": unit,

            "file_name": filename,

            "upload_date": created_at.isoformat(),

            "summary_url": f"/dashboard/summary/{filename}",

            "mcq_url": f"/dashboard/quiz/{filename}",

            "download_url": f"/upload/files/{filename}"

        }), 200

    except Exception as e:
        return handle_exception(e, "Upload failed. Please try again.")


# =====================================================
# GET ALL NOTES
# =====================================================

@upload.route("/notes", methods=["GET"])
def get_notes():

    try:

        notes = []

        for note in notes_collection.find().sort([
            ("subject", 1),
            ("unit", 1)
        ]):

            filename = note.get("filename", "")
            filepath = resolve_note_filepath(note)

            notes.append({

                "id": str(note["_id"]),

                "subject": note.get("subject"),

                "unit": note.get("unit"),

                "file_name": filename,

                "uploaded_by": note.get("uploaded_by"),

                "approved": note.get("approved"),

                "upload_date": note.get("created_at").isoformat()
                if note.get("created_at") else "",

                "summary_url": f"/dashboard/summary/{filename}",

                "mcq_url": f"/dashboard/quiz/{filename}",

                "download_url": f"/upload/files/{filename}"

            })

        return jsonify(notes), 200

    except Exception as e:
        return handle_exception(e, "Unable to load notes.")


# =====================================================
# REPOSITORY API
# =====================================================

@upload.route("/repository", methods=["GET"])
def repository():

    try:

        repository = []

        for note in notes_collection.find(
            {"approved": True}
        ).sort([
            ("subject", 1),
            ("unit", 1)
        ]):

            filename = note.get("filename", "")
            filepath = resolve_note_filepath(note)

            repository.append({

                "id": str(note["_id"]),

                "subject": note.get("subject"),

                "unit": note.get("unit"),

                "file_name": filename,

                "upload_date": note.get("created_at").isoformat()
                if note.get("created_at") else "",

                "summary_url": f"/dashboard/summary/{filename}",

                "mcq_url": f"/dashboard/quiz/{filename}",

                "download_url": f"/upload/files/{filename}",

                "preview_url": f"/upload/files/{filename}?preview=true",

                "file_type": filename.split(".")[-1].upper()
                if "." in filename else "",

                "file_size": os.path.getsize(filepath) if os.path.exists(filepath) else 0,

                "has_summary": summaries_collection.count_documents({"filename": filename}) > 0,

                "has_mcqs": mcqs_collection.count_documents({"filename": filename}) > 0,

                "quiz_attempts": quiz_collection.count_documents({"filename": filename})

            })

        return jsonify(repository), 200

    except Exception as e:
        return handle_exception(e, "Unable to load repository.")


# =====================================================
# GET SINGLE NOTE
# =====================================================

@upload.route("/note/<note_id>", methods=["GET"])
def get_note(note_id):

    try:

        note = notes_collection.find_one({
            "_id": ObjectId(note_id)
        })

        if not note:

            return jsonify({
                "message": "Note not found"
            }), 404

        filename = note.get("filename", "")

        return jsonify({

            "id": str(note["_id"]),

            "subject": note.get("subject"),

            "unit": note.get("unit"),

            "file_name": filename,

            "uploaded_by": note.get("uploaded_by"),

            "approved": note.get("approved"),

            "upload_date": note.get("created_at").isoformat()
            if note.get("created_at") else "",

            "summary_url": f"/dashboard/summary/{filename}",

            "mcq_url": f"/dashboard/quiz/{filename}",

                "download_url": f"/upload/files/{filename}"

        }), 200

    except Exception as e:
        return handle_exception(e, "Unable to load note.")


# =====================================================
# DOWNLOAD / PREVIEW FILE
# =====================================================

@upload.route("/files/<path:filename>", methods=["GET"])
def download_file(filename):

    safe_name = secure_filename(filename)

    if not safe_name:
        return jsonify({
            "message": "Invalid filename"
        }), 400

    filepath = resolve_upload_filepath(safe_name)

    if not os.path.exists(filepath):
        return jsonify({
            "message": "File not found"
        }), 404

    return send_from_directory(
        UPLOAD_FOLDER,
        safe_name,
        as_attachment=request.args.get("preview") != "true"
    )


# =====================================================
# DELETE NOTE
# =====================================================

@upload.route("/note/<note_id>", methods=["DELETE"])
def delete_note(note_id):

    try:

        note = notes_collection.find_one({
            "_id": ObjectId(note_id)
        })

        if not note:
            return jsonify({
                "message": "Note not found"
            }), 404

        filename = note.get("filename", "")
        filepath = resolve_note_filepath(note)

        notes_collection.delete_one({
            "_id": ObjectId(note_id)
        })

        if filepath and os.path.exists(filepath):
            os.remove(filepath)

        return jsonify({
            "message": "Note deleted successfully"
        }), 200

    except Exception as e:
        return handle_exception(e, "Unable to delete note.")


# =====================================================
# TOTAL NOTES
# =====================================================

@upload.route("/count", methods=["GET"])
def count_notes():

    try:

        total = notes_collection.count_documents({})

        approved = notes_collection.count_documents({
            "approved": True
        })

        return jsonify({

            "total_notes": total,

            "approved_notes": approved

        }), 200

    except Exception as e:
        return handle_exception(e, "Unable to count notes.")
