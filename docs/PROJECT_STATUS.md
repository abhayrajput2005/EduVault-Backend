# EduVault AI
## Project Status
Version: v1.0 Production Candidate

---

# Project Overview

EduVault AI is an AI-powered academic platform that helps students organize study materials and learn efficiently.

Primary features:

- AI Summary Generation
- AI Quiz Generation
- AI Tutor (Chat with Notes)
- Personal Repository
- Subject Library
- Admin Dashboard
- Material Request System

Target users:

- Students
- Faculty
- Admin

---

# Tech Stack

## Frontend

- React
- TanStack Router
- TypeScript
- Tailwind CSS
- Vite

## Backend

- Python
- Flask
- JWT Authentication

## AI

- Google Gemini API

## Database

MongoDB Atlas

Collections include:

- users
- notes
- quizzes
- summaries
- library_subjects
- library_files
- material_requests

## Storage

Current:
- Local uploads (development)

Production:
- Cloudinary

Deployment:

Frontend:
- Vercel

Backend:
- Render / Railway

Database:
- MongoDB Atlas

Storage:
- Cloudinary

---

# Authentication

Supports:

- Register
- Login
- JWT Authentication
- Protected Routes

Admin support required.

Admin pages must only be accessible to admins.

---

# Current Features

## Authentication

✅ Login

✅ Register

✅ JWT

---

## Dashboard

✅ User Dashboard

✅ Profile

---

## Repository

Users can

- Upload Notes
- View Notes
- Delete Notes
- Search Notes

Repository integrates with

- Summary
- Quiz
- AI Tutor

---

## AI Summary

Generate concise summaries from uploaded documents.

Supported:

- PDF
- PPT
- DOCX
- TXT

---

## AI Quiz

Generate MCQs from uploaded notes.

Supports:

- Quiz Generation
- Answer Validation
- Score Calculation

---

## AI Tutor

Allows students to ask questions based on uploaded notes.

Uses existing note content.

---

## Subject Library

Purpose:

Shared academic repository.

Students search by

- Subject Code
- Subject Name

Library supports

- PPT
- PDF
- DOCX
- Lab Manuals
- Previous Year Papers

Every file supports

- View
- Download
- Summary
- Quiz
- AI Tutor

---

## Material Requests

If no material exists

Students can

Request Material

Admin reviews requests.

---

## Admin Dashboard

Admin should be able to

- Manage Subjects
- Upload Files
- Delete Files
- Replace Files
- Manage Requests
- View Analytics

---

# Planned Improvements

Subject Cards

Display

- Subject Code
- Subject Name
- Department
- Semester
- Total Files
- Downloads
- Rating
- Last Updated

Trending Subjects

Recently Added

Bookmarks

Ratings

Feedback

Analytics

---

# Upload System

Development

Local uploads.

Production

Cloudinary.

Upload flow

Admin

↓

Upload File

↓

Cloudinary

↓

MongoDB Metadata

↓

Available to all students

---

# Search

Supports

- Subject Code
- Subject Name

Future

- Department
- Semester
- Keywords

Autocomplete

Suggestions

---

# Database Collections

users

notes

summaries

quizzes

library_subjects

library_files

material_requests

Future

analytics

ratings

bookmarks

---

# API Structure

Authentication

/api/auth/*

Repository

/api/upload/*

Summary

/api/summary/*

Quiz

/api/quiz/*

Tutor

/api/chat/*

Subject Library

/api/library/*

Admin

/api/admin/*

---

# Environment Variables

Backend

MONGO_URI

DB_NAME

SECRET_KEY

JWT_SECRET

GEMINI_API_KEY

ADMIN_EMAIL

ADMIN_PASSWORD

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET

Frontend

VITE_API_URL

---

# Deployment Target

Frontend

Vercel

Backend

Render

Database

MongoDB Atlas

Storage

Cloudinary

---

# Coding Rules

Do NOT remove existing functionality.

Reuse existing APIs whenever possible.

Avoid duplicate logic.

Keep UI consistent with EduVault design.

Maintain responsive layouts.

Do not hardcode secrets.

Always use environment variables.

Do not break Summary, Quiz or AI Tutor while adding new features.

---

# QA Checklist

Every button works.

Every route loads.

Every API returns proper JSON.

No console errors.

No backend tracebacks.

No dead links.

No placeholder buttons.

No TODO code.

Production build passes.

Deployment ready.

---

# Current Known Issues

(None if fixed.)

Future work should only extend functionality without breaking existing features.

---

# Instructions for Future Development

Before making changes:

1. Read this document completely.

2. Understand the current architecture.

3. Preserve all working features.

4. Extend the project without introducing regressions.

5. After completing work, provide:

- Files Modified
- APIs Changed
- Database Changes
- Remaining Issues
- Deployment Readiness