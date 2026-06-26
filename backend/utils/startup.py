import os
from datetime import datetime

import bcrypt
from pymongo import ASCENDING, DESCENDING, TEXT

from models.note_model import notes_collection
from models.subject_library_model import (
    analytics_collection,
    bookmarks_collection,
    files_collection,
    ratings_collection,
    requests_collection,
    subjects_collection,
)
from models.user_model import users_collection


def ensure_admin_user():
    email = os.getenv("ADMIN_EMAIL", "").strip().lower()
    password = os.getenv("ADMIN_PASSWORD", "").strip()

    if not email or not password:
        return

    existing = users_collection.find_one({"email": email})
    if existing:
        if not existing.get("is_admin", False):
            users_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": {"is_admin": True, "updated_at": datetime.utcnow()}},
            )
        return

    users_collection.insert_one(
        {
            "email": email,
            "name": os.getenv("ADMIN_NAME", "EduVault Admin"),
            "password": bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()),
            "is_admin": True,
            "created_at": datetime.utcnow(),
        }
    )


def ensure_indexes():
    users_collection.create_index([("email", ASCENDING)], unique=True)

    subjects_collection.create_index([("subject_code", ASCENDING)], unique=True)
    subjects_collection.create_index(
        [
            ("subject_code", TEXT),
            ("subject_name", TEXT),
            ("department", TEXT),
            ("semester", TEXT),
            ("keywords", TEXT),
        ],
        name="subject_library_text",
        default_language="none",
    )
    subjects_collection.create_index([("updated_at", DESCENDING)])
    subjects_collection.create_index([("downloads", DESCENDING), ("file_count", DESCENDING)])

    files_collection.create_index([("subject_id", ASCENDING), ("category", ASCENDING)])
    files_collection.create_index([("subject_code", ASCENDING)])
    files_collection.create_index([("created_at", DESCENDING)])
    files_collection.create_index([("downloads", DESCENDING)])

    requests_collection.create_index([("status", ASCENDING), ("created_at", DESCENDING)])
    ratings_collection.create_index([("file_id", ASCENDING), ("user_id", ASCENDING)], unique=True)
    bookmarks_collection.create_index([("subject_id", ASCENDING), ("user_id", ASCENDING)], unique=True)
    analytics_collection.create_index([("event", ASCENDING), ("created_at", DESCENDING)])
    analytics_collection.create_index([("file_id", ASCENDING), ("event", ASCENDING)])
    notes_collection.create_index([("library_file_id", ASCENDING)])


def initialize_app_state():
    ensure_admin_user()
    ensure_indexes()
