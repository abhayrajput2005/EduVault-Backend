import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
SUBJECT_LIBRARY_FOLDER = os.path.join(UPLOAD_FOLDER, "subject-library")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(SUBJECT_LIBRARY_FOLDER, exist_ok=True)


def resolve_note_filepath(note: dict) -> str:
    """Return the on-disk path for a note, falling back to uploads/filename."""
    filename = note.get("filename", "")
    stored = note.get("filepath") or note.get("file_path") or ""
    if stored and os.path.isabs(stored):
        return stored
    if stored:
        return os.path.normpath(os.path.join(BASE_DIR, stored))
    return os.path.join(UPLOAD_FOLDER, filename)


def resolve_upload_filepath(filename: str) -> str:
    return os.path.join(UPLOAD_FOLDER, filename)


def subject_library_dir(subject_code: str) -> str:
    safe_code = "".join(c for c in subject_code.upper() if c.isalnum() or c in "-_")
    folder = os.path.join(SUBJECT_LIBRARY_FOLDER, safe_code)
    os.makedirs(folder, exist_ok=True)
    return folder


def resolve_library_filepath(subject_code: str, filename: str) -> str:
    return os.path.join(subject_library_dir(subject_code), filename)
