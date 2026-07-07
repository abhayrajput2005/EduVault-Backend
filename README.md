# 🎓 EduVault AI

> An AI-powered academic resource management platform that helps students organize, access, and learn from study materials more efficiently.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Flask](https://img.shields.io/badge/Flask-Python-black?logo=flask)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-Frontend-purple?logo=vite)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📖 Overview

EduVault AI is a centralized platform for students to upload, organize, and access academic resources such as PPTs, PDFs, DOCX files, lab manuals, and previous year question papers.

The platform integrates Artificial Intelligence to automatically summarize presentations, generate quizzes, and provide intelligent learning assistance, making studying faster and more interactive.

---

## ✨ Features

### 👨‍🎓 Student Features

- Subject-wise resource library
- Search by Subject Name or Subject Code
- AI-generated PPT Summaries
- AI-generated MCQs
- Download learning materials
- Request unavailable resources
- Responsive UI
- Secure Authentication

### 👨‍💼 Admin Features

- Admin Dashboard
- Manage Subjects
- Upload Study Materials
- Replace Existing Files
- Delete Resources
- Review Student Requests
- Manage Library Content

### 🤖 AI Features

- PPT Summarization
- Automatic MCQ Generation
- AI Tutor (Future Enhancement)
- Intelligent Content Processing

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Axios

## Backend

- Flask
- Python
- Flask-CORS
- PyMongo
- bcrypt

## Database

- MongoDB Atlas

## AI Libraries

- Google Gemini API
- python-pptx
- PyMuPDF
- python-dotenv

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

# 📂 Project Structure

```
EduVault-AI/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   └── assets/
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── models/
│   ├── app.py
│   └── requirements.txt
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/eduvault-ai.git

cd eduvault-ai
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate

pip install -r requirements.txt

python app.py
```

Backend runs on

```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
MONGO_URI=your_mongodb_connection_string

DB_NAME=EduVault

SECRET_KEY=your_secret_key

GOOGLE_API_KEY=your_gemini_api_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

# 📸 Screenshots

## Home Page

_Add Screenshot_

---

## Subject Library

_Add Screenshot_

---

## Admin Dashboard

_Add Screenshot_

---

## AI Summary

_Add Screenshot_

---

## AI Quiz Generator

_Add Screenshot_

---

# 🔄 API Endpoints

## Authentication

```
POST /api/auth/register

POST /api/auth/login
```

## Uploads

```
POST /api/upload

GET /api/notes

GET /api/download/<id>
```

## AI

```
POST /api/summary

POST /api/mcq
```

## Admin

```
POST /api/admin/subject

PUT /api/admin/subject

DELETE /api/admin/subject
```

---

# 📈 Future Improvements

- Bookmark Resources
- Ratings & Reviews
- AI Tutor Chatbot
- Semantic Search
- Learning Analytics Dashboard
- Dark Mode
- Notifications
- Resource Recommendation System
- OCR for Scanned Notes
- Mobile Application

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```
git checkout -b feature/new-feature
```

3. Commit changes

```
git commit -m "Added new feature"
```

4. Push

```
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Abhay Kumar**

- GitHub: https://github.com/abhayrajput2005
- LinkedIn: https://www.linkedin.com/in/abhay-kumar-2005-
- Email: abhayrajputg0007@gmail.com

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

## 📜 License

This project is licensed under the MIT License.

```

## 🌟 Project Highlights

- 📚 Centralized Academic Resource Repository
- 🤖 AI-Powered Study Assistant
- 📄 Automatic PPT Summarization
- 📝 AI-Based MCQ Generation
- 🔐 Secure Authentication
- ☁️ Cloud-Based Storage
- ⚡ Fast React + Flask Architecture
- 📱 Responsive Design

> *EduVault AI helps students spend less time searching for notes and more time learning.*
