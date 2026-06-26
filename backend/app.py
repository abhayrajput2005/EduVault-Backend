from flask import Flask, jsonify
from flask_cors import CORS
import os

from routes.auth_routes import auth
from routes.upload_routes import upload
from routes.ai_routes import ai
from routes.admin_routes import admin
from routes.library_routes import library
from routes.admin_library_routes import admin_library
from utils.startup import initialize_app_state

app = Flask(__name__)
initialize_app_state()

CORS(
    app,
    resources={r"/api/*": {"origins": os.getenv("CORS_ORIGINS", "*")}},
    supports_credentials=True,
)

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(upload, url_prefix="/api/upload")
app.register_blueprint(ai, url_prefix="/api/ai")
app.register_blueprint(admin, url_prefix="/api/admin")
app.register_blueprint(library, url_prefix="/api/library")
app.register_blueprint(admin_library, url_prefix="/api/admin")


@app.route("/")
def home():
    return jsonify({"message": "EduVault AI Backend Running"})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "eduvault-backend"}), 200


@app.errorhandler(404)
def not_found(_error):
    return jsonify({"message": "Resource not found"}), 404


@app.errorhandler(405)
def method_not_allowed(_error):
    return jsonify({"message": "Method not allowed"}), 405


@app.errorhandler(500)
def internal_error(_error):
    return jsonify({"message": "Internal server error"}), 500


if __name__ == "__main__":
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug, host=os.getenv("HOST", "127.0.0.1"), port=int(os.getenv("PORT", "5000")))
