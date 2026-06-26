from flask import Blueprint, request, jsonify
from models.user_model import users_collection
import bcrypt
import jwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

auth = Blueprint("auth", __name__)


def _secret_key():
    secret = os.getenv("SECRET_KEY")
    if not secret:
        raise RuntimeError("SECRET_KEY is not configured")
    return secret


def _serialize_user(user):
    return {
        "id": str(user.get("_id", "")),
        "email": user.get("email", ""),
        "name": user.get("name", ""),
        "isAdmin": bool(user.get("is_admin", False)),
    }


def _make_token(user):
    return jwt.encode(
        {
            "id": str(user["_id"]),
            "email": user["email"],
            "is_admin": bool(user.get("is_admin", False)),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
        },
        _secret_key(),
        algorithm="HS256",
    )

# ---------------- REGISTER ----------------

@auth.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    name = data.get("name", "")

    if not email or not password:
        return jsonify({"message": "Email and Password required"}), 400

    existing = users_collection.find_one({"email": email})

    if existing:
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    is_first_user = users_collection.count_documents({}) == 0
    admin_email = os.getenv("ADMIN_EMAIL", "").strip().lower()

    inserted = users_collection.insert_one({
        "email": email,
        "name": name,
        "password": hashed_password,
        "is_admin": is_first_user or email.lower() == admin_email,
        "created_at": datetime.datetime.utcnow(),
    })

    user = users_collection.find_one({"_id": inserted.inserted_id})

    return jsonify({
        "message": "Registration Successful",
        "token": _make_token(user),
        "user": _serialize_user(user),
    }), 201


# ---------------- LOGIN ----------------

@auth.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"message": "User not found"}), 404

    if bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"]
    ):

        return jsonify({
            "message": "Login Successful",
            "token": _make_token(user),
            "user": _serialize_user(user),
        }), 200

    return jsonify({"message": "Invalid Password"}), 401


# ---------------- CURRENT USER ----------------

def _user_from_token():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "", 1).strip()

    if not token:
        return None, (jsonify({"message": "Authentication required"}), 401)

    try:
        payload = jwt.decode(token, _secret_key(), algorithms=["HS256"])
    except Exception:
        return None, (jsonify({"message": "Invalid or expired token"}), 401)

    user = users_collection.find_one({"email": payload.get("email")})

    if not user:
        return None, (jsonify({"message": "User not found"}), 404)

    return user, None


@auth.route("/me", methods=["GET"])
def me():
    user, error = _user_from_token()
    if error:
        return error

    return jsonify({"user": _serialize_user(user)}), 200
