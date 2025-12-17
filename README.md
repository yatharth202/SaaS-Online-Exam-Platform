# SaaS Online Exam Platform (Backend)

A secure and scalable backend system for conducting online exams with role-based access, server-controlled exam attempts, and automatic evaluation.
This project is designed to mimic a real-world online examination system with strict time enforcement, immutable exams after publish, and secure result handling.


## Tech Stack

- **Backend:** Node.js, Express (ES Modules)
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (Access & Refresh Tokens)
- **Authorization:** Role-Based Access Control (Admin / Student)
- **Testing:** Postman
- **Architecture:** MVC, centralized error handling


## User Roles

### Admin
- Create exams
- Add questions to exams
- Publish / unpublish exams
- View student attempts and analytics

### Student
- View available exams (time-based)
- Start exam
- Submit exam
- View own results


## Core Features

### Authentication & Authorization
- JWT-based authentication
- Access and refresh token flow
- Role-based middleware for Admin and Student

### Exam Lifecycle Management (Admin)
- Create exams with:
  - Duration
  - Total marks
  - Passing marks
  - Start and end time
  - Positive and negative marking
- Add questions to exams
- Publish / unpublish exams
- **Published exams become immutable**

### Student Exam Visibility
- Students can view only:
  - Published exams
  - Exams active within the current time window
- Server-side time filtering

### Student Exam Attempt System (Core Feature)
- One attempt per student per exam
- Server-authoritative time enforcement
- Idempotent start exam API (refresh-safe)
- Auto-submit on time expiry
- Automatic evaluation:
  - +positive marks for correct answers
  - −negative marks for wrong answers
  - 0 marks for unattempted questions
- Pass / fail determination
- No re-submission allowed

### Results & Analytics

#### Student
- View own exam result after submission

#### Admin
- View all exam attempts
- Analytics including:
  - Total attempts
  - Average score
  - Pass percentage


## Project Structure

backend/
  src/
    controllers/
    models/
    routes/
    middlewares/
    utils/
    app.js
    server.js





## Important API Endpoints

### Authentication
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/logout`

### Exam (Admin)
- POST `/api/v1/exams`
- POST `/api/v1/exams/:examId/questions`
- PATCH `/api/v1/exams/:examId/publish`
- PATCH `/api/v1/exams/:examId/unpublish`

### Exam (Student)
- GET `/api/v1/exams/available`

### Attempt System
- POST `/api/v1/attempts/start/:examId`
- POST `/api/v1/attempts/submit/:attemptId`
- GET `/api/v1/attempts/my/:examId`

### Admin Analytics
- GET `/api/v1/attempts/exam/:examId`


##  Design & Security Decisions

- Backend does not trust frontend time
- Exam attempts are state-based (`in-progress`, `submitted`)
- One attempt enforced using database-level unique index
- Published exams cannot be modified
- Correct answers are never exposed in API responses


## Testing

All APIs are tested using **Postman**, including:
- Authentication flows
- Role-based access
- Exam lifecycle
- Attempt start, submit, and result retrieval
- Admin analytics


##  What This Project Demonstrates

- Real-world backend architecture
- Secure exam system design
- Server-side time enforcement
- Idempotent APIs
- Role-based authorization
- Analytics and aggregation logic


##  Future Enhancements

- Frontend integration (React)
- Cron-based auto-submit
- Question randomization
- Result export
- Proctoring support

## Author

**Yatharth Patel**  
Backend Developer | Node.js | MongoDB | REST APIs
