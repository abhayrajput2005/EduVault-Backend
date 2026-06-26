import json

from flask import jsonify


def api_error(message: str, status: int = 400):
    return jsonify({"message": message}), status


def handle_exception(exc: Exception, fallback: str = "Something went wrong. Please try again."):
    error = str(exc)

    if "429" in error or "quota" in error.lower():
        return api_error("AI service quota exceeded. Please try again later.", 429)

    if isinstance(exc, (ValueError, KeyError, json.JSONDecodeError)):
        return api_error("We could not process the AI response. Please try again.", 502)

    return api_error(fallback, 500)
