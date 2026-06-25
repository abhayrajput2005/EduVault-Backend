from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from models.note_model import notes_collection
from datetime import datetime
from bson import ObjectId
import os

upload = Blueprint("upload", __name__)

UPLOAD_FOLDER = "uploads"

# Create uploads folder automatically
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


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

        filepath = os.path.join(UPLOAD_FOLDER, filename)

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

            "download_url": f"/uploads/{filename}"

        }), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


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

                "download_url": f"/uploads/{filename}"

            })

        return jsonify(notes), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


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

            repository.append({

                "id": str(note["_id"]),

                "subject": note.get("subject"),

                "unit": note.get("unit"),

                "file_name": filename,

                "upload_date": note.get("created_at").isoformat()
                if note.get("created_at") else "",

                "summary_url": f"/dashboard/summary/{filename}",

                "mcq_url": f"/dashboard/quiz/{filename}",

                "download_url": f"/uploads/{filename}",

                "file_type": filename.split(".")[-1].upper()
                if "." in filename else "",

                "file_size": 0

            })

        return jsonify(repository), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


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

            "download_url": f"/uploads/{filename}"

        }), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


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

        return jsonify({
            "error": str(e)
        }), 500