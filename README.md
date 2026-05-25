# AI Resume Analyzer

A production-grade, full-stack web application that leverages OpenAI's GPT API to analyze uploaded resumes (PDF or DOCX). It provides an ATS compatibility score, detects missing keywords, identifies skill gaps, offers formatting feedback, and recommends matching job roles.

## Tech Stack

| Component     | Technologies Used                                                                 |
| ------------- | --------------------------------------------------------------------------------- |
| **Frontend**  | React 18, Vite, Tailwind CSS v3, React Router v6, Recharts, Axios, react-dropzone |
| **Backend**   | Node.js, Express.js, JWT Auth, Multer, pdf-parse, mammoth, OpenAI API             |
| **Database**  | MongoDB, Mongoose                                                                 |
| **DevOps**    | Docker, Docker Compose, Nginx, AWS SDK                                            |

## Folder Structure

```
ai-resume-analyzer/
├── backend/                  # Node/Express API
│   ├── config/               # Database configuration
│   ├── controllers/          # Route logic
│   ├── middleware/           # Auth, Upload, Validation
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── services/             # OpenAI, Parsing, S3 logic
│   └── utils/                # Helpers
└── frontend/                 # React UI
    ├── src/
    │   ├── api/              # Axios instance and services
    │   ├── components/       # Reusable UI components
    │   ├── context/          # React context (Auth)
    │   ├── hooks/            # Custom hooks
    │   ├── pages/            # View components
    │   └── utils/            # Helper functions
```

## Local Development Setup

1. **Clone and setup environment variables:**
   - Copy `backend/.env.example` to `backend/.env` and fill in your MongoDB URI, JWT Secret, and OpenAI API Key.
   - Copy `frontend/.env.example` to `frontend/.env`.

2. **Start the Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Start the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Docker Deployment

To run the entire application stack (Frontend, Backend, MongoDB) using Docker:

```bash
docker-compose up --build
```

The application will be available at `http://localhost`.

## AWS EC2 Deployment Step-by-Step

1. **Provision EC2 Instance:**
   - Launch an Ubuntu Server instance.
   - Configure Security Groups: Open ports 80 (HTTP), 443 (HTTPS), and 22 (SSH).

2. **Install Dependencies:**
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose git
   sudo systemctl enable docker
   ```

3. **Clone Repository & Configure:**
   ```bash
   git clone <your-repo-url>
   cd ai-resume-analyzer
   # Create and populate .env file in backend/
   nano backend/.env
   ```

4. **Deploy with Docker Compose:**
   ```bash
   sudo docker-compose up -d --build
   ```

## Complete API Reference

| Endpoint                           | Method | Auth Required | Body/Params                    | Description                        |
| ---------------------------------- | ------ | ------------- | ------------------------------ | ---------------------------------- |
| `/api/auth/signup`               | POST   | No            | `name`, `email`, `password` | Register a new user                |
| `/api/auth/login`                | POST   | No            | `email`, `password`          | Authenticate user                  |
| `/api/auth/me`                   | GET    | Yes           | -                              | Get current user details           |
| `/api/auth/profile`              | PUT    | Yes           | `name`                         | Update profile                     |
| `/api/auth/change-password`      | PUT    | Yes           | `currentPassword`, `newPassword`| Change user password               |
| `/api/resumes/upload`            | POST   | Yes           | `resume` (file)                | Upload a PDF/DOCX resume           |
| `/api/resumes/`                  | GET    | Yes           | -                              | Get all user resumes               |
| `/api/resumes/:id`               | GET    | Yes           | -                              | Get a specific resume              |
| `/api/resumes/:id`               | DELETE | Yes           | -                              | Delete a specific resume           |
| `/api/analysis/:resumeId`        | POST   | Yes           | -                              | Run/Create analysis for a resume   |
| `/api/analysis/:resumeId/reanalyze`| POST | Yes           | -                              | Re-run analysis for a resume       |
| `/api/analysis/:resumeId`        | GET    | Yes           | -                              | Get analysis by resume ID          |
| `/api/analysis/`                 | GET    | Yes           | -                              | Get all user analyses              |
| `/api/analysis/:resumeId`        | DELETE | Yes           | -                              | Delete analysis by resume ID       |

## Analysis Response JSON Schema

```json
{
  "atsScore": 85,
  "detectedSkills": ["JavaScript", "React", "Node.js"],
  "missingKeywords": ["AWS", "Docker"],
  "strengths": ["Strong action verbs used", "Clear progression"],
  "weaknesses": ["Lack of quantifiable metrics"],
  "suggestions": ["Include more data points to back up achievements"],
  "formattingFeedback": ["Consistent font usage", "Good whitespace"],
  "recommendedRoles": ["Frontend Developer", "Full Stack Engineer"],
  "sectionScores": {
    "contactInfo": 100,
    "summary": 80,
    "experience": 90,
    "education": 100,
    "skills": 85,
    "formatting": 95
  },
  "overallFeedback": "Your resume is strong for mid-level engineering roles..."
}
```

## Security Features

- **Password Hashing:** bcryptjs with saltRounds=12
- **JWT Authentication:** Secure token-based access
- **File Validation:** MIME type and extension validation (.pdf, .docx)
- **HTTP Headers:** Secured using Helmet.js
- **CORS:** Origin restriction
- **Rate Limiting:** Multi-tiered (General, Auth, Analysis)
- **Storage:** Namespaced local uploads with optional AWS S3 integration
