import os
from urllib.parse import urlparse

import cloudinary
import cloudinary.uploader


def configure_cloudinary():
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        secure=True,
    )


def cloudinary_configured():
    return all(
        os.getenv(name)
        for name in ("CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET")
    )


def upload_material(file_storage, *, subject_code: str, file_id: str):
    if not cloudinary_configured():
        raise RuntimeError("Cloudinary environment variables are not configured")

    configure_cloudinary()
    folder = f"eduvault/subject-library/{subject_code}"
    public_id = f"{folder}/{file_id}"
    return cloudinary.uploader.upload(
        file_storage,
        public_id=public_id,
        resource_type="raw",
        overwrite=True,
        use_filename=False,
        unique_filename=False,
    )


def delete_material(public_id: str):
    if not public_id or not cloudinary_configured():
        return

    configure_cloudinary()
    cloudinary.uploader.destroy(public_id, resource_type="raw", invalidate=True)


def original_extension(url: str):
    path = urlparse(url or "").path
    _, ext = os.path.splitext(path)
    return ext
