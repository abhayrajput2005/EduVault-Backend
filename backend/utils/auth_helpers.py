import os

import jwt
from flask import jsonify, request

from models.user_model import users_collection

FILE_CATEGORIES = {
    "ppt": "PPT",
    "pptx": "PPTX",
    "pdf": "PDF",
    "doc": "DOC",
    "docx": "DOCX",
    "lab_manual": "Lab Manual",
    "previous_year_papers": "Previous Year Papers",
}


def _secret_key():
    secret = os.getenv("SECRET_KEY")
    if not secret:
        return None
    return secret


def _token_payload():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "", 1).strip()
    if not token:
        return None, (jsonify({"message": "Authentication required"}), 401)

    secret = _secret_key()
    if not secret:
        return None, (jsonify({"message": "SECRET_KEY is not configured"}), 500)

    try:
        return jwt.decode(token, secret, algorithms=["HS256"]), None
    except Exception:
        return None, (jsonify({"message": "Invalid or expired token"}), 401)


def require_auth():
    payload, error = _token_payload()
    if error:
        return None, error

    user = users_collection.find_one({"email": payload.get("email")})
    if not user:
        return None, (jsonify({"message": "User not found"}), 404)

    return user, None


def require_admin():
    user, error = require_auth()
    if error:
        return None, error

    if not user.get("is_admin", False):
        return None, (jsonify({"message": "Admin access required"}), 403)

    return user, None
