from flask import Blueprint, request, jsonify
from models.user_model import users_collection
import bcrypt
import jwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

auth = Blueprint("auth", __name__)

# ---------------- REGISTER ----------------

@auth.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and Password required"}), 400

    existing = users_collection.find_one({"email": email})

    if existing:
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    users_collection.insert_one({
        "email": email,
        "password": hashed_password
    })

    return jsonify({"message": "Registration Successful"}), 201


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

        token = jwt.encode(
            {
                "email": user["email"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
            },
            os.getenv("SECRET_KEY"),
            algorithm="HS256"
        )

        return jsonify({
            "message": "Login Successful",
            "token": token
        }), 200

    return jsonify({"message": "Invalid Password"}), 401