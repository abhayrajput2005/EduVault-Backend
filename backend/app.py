from flask import Flask
from flask_cors import CORS

from routes.auth_routes import auth
from routes.upload_routes import upload
from routes.ai_routes import ai

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    supports_credentials=True
)

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(upload, url_prefix="/api/upload")
app.register_blueprint(ai, url_prefix="/api/ai")

@app.route("/")
def home():
    return {
        "message": "EduVault AI Backend Running 🚀"
    }

if __name__ == "__main__":
    app.run(debug=True)