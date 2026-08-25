# Guarded Exams

PROJECT: PROCTOR GUARD AI

TYPE: Production-quality AI-assisted Online Examination & Proctoring Platform

Build a complete, production-quality full-stack web application called "Proctor Guard AI".

The purpose of this application is to provide a secure online examination platform with AI-assisted proctoring, suspicious-activity monitoring, risk scoring, evidence management, analytics, and administrative controls.

IMPORTANT:

This is NOT a simple landing page or a generic AI-generated dashboard.

Build the application as if it were designed and engineered by an experienced human product designer, UX designer, frontend engineer, backend engineer, and security engineer.

The final application should feel like a real university/professional examination security platform that could be deployed publicly and demonstrated in a portfolio.

==================================================

1. DESIGN PHILOSOPHY

==================================================

The most important requirement is that the application must look HUMAN-DESIGNED and PROFESSIONAL.

It must NOT look like a generic AI-generated website.

Avoid:

- Excessive gradients

- Neon effects

- Excessive glassmorphism

- Purple/blue "AI" gradients

- Huge rounded cards everywhere

- Excessive shadows

- Excessive animations

- Random decorative illustrations

- Generic AI brain graphics

- Marketing-heavy fake statistics

- "AI Magic" type labels

- Unnecessary icons

- Template-like dashboard layouts

Prefer:

- Strong visual hierarchy

- Professional typography

- Consistent spacing

- Subtle borders

- Dark charcoal interface

- Green brand accent

- White/gray typography

- Functional data tables

- Meaningful charts

- Compact information-dense layouts

- Subtle animations only where useful

- Clear status indicators

- Excellent accessibility

- Responsive layouts

- Realistic data

The application should communicate:

SECURITY + TRUST + RELIABILITY + PROFESSIONALISM.

Use green selectively as the primary brand color.

Suggested visual direction:

Background:

Dark charcoal / near-black

Primary:

Professional green

Success:

Green

Warning:

Amber

Danger:

Red

Neutral:

Gray

Do not make every element green.

==================================================

2. RESPONSIVE DESIGN

==================================================

The application MUST work properly on:

- Desktop

- Laptop

- Tablet

- Mobile phone

Do not simply shrink the desktop interface for mobile.

Create proper responsive layouts.

The student exam interface must be usable on mobile browsers.

The admin dashboard must remain usable on mobile.

Use:

- Responsive navigation

- Mobile bottom navigation where appropriate

- Touch-friendly buttons

- Responsive tables

- Responsive charts

- Collapsible sections

- Mobile-friendly question navigation

==================================================

3. TECHNOLOGY

==================================================

Use:

- React

- TypeScript

- Modern component architecture

- Tailwind CSS or clean CSS

- Supabase for authentication/database where appropriate

- Reusable components

- API service abstraction

Use a clean folder structure.

Create:

- components

- pages

- layouts

- services

- hooks

- types

- utils

- constants

Avoid duplicated code.

==================================================

4. BRAND

==================================================

Application name:

PROCTOR GUARD AI

Tagline:

"Intelligent Examination Security"

Use a simple professional shield/check style logo.

Do not use a generic robot or brain icon.

The logo should work in:

- Sidebar

- Navbar

- Login page

- Mobile header

- Favicon-style context

==================================================

5. LANDING PAGE

==================================================

Create a professional landing page.

Sections:

1. Navigation

2. Hero

3. How it works

4. AI-assisted proctoring

5. Examination experience

6. Risk analytics

7. Security

8. Features

9. Demo quiz

10. FAQ

11. Footer

Hero copy:

"Intelligent Examination Security"

Supporting text:

"Conduct secure online assessments with real-time monitoring, suspicious-activity analysis, risk scoring, and detailed examination reports."

Buttons:

"Try Demo Exam"

"Admin Login"

Do not make unsupported claims about perfect cheating detection.

==================================================

6. AUTHENTICATION

==================================================

Create authentication architecture for:

STUDENT

ADMIN

Features:

- Login

- Registration

- Forgot password

- Logout

- Session handling

- Protected routes

- Role-based access control

Roles:

student

admin

Students must not access admin routes.

Admins must have access to administrative functionality.

==================================================

7. STUDENT DASHBOARD

==================================================

Create a professional student dashboard.

Show:

- Student name

- Student ID

- Upcoming exams

- Active exams

- Completed exams

- Recent activity

Exam cards must display:

- Exam name

- Subject

- Date

- Duration

- Number of questions

- Status

- Start button

Use realistic demo data.

==================================================

8. SYSTEM CHECK

==================================================

Before starting an exam, show a system compatibility screen.

Checks:

- Camera

- Microphone

- Browser

- Internet connection

- Fullscreen availability

Status:

✓ Ready

⚠ Warning

✕ Failed

Include:

- Camera permission request

- Microphone permission request

- Exam instructions

- Privacy/consent notice

- Start Exam button

Clearly explain that monitoring is active during the exam.

==================================================

9. DEMO QUIZ

==================================================

Create a fully functional DEMO PROCTORED QUIZ.

This is important because the entire proctoring system needs a realistic testing environment.

Create:

Exam:

"AI Fundamentals — Proctored Assessment"

10 multiple-choice questions.

Duration:

15 minutes.

Difficulty:

Mixed.

Questions should be realistic Computer Science / AI fundamentals questions.

Features:

- Question navigation

- Previous button

- Next button

- Question palette

- Mark for review

- Answer selection

- Answer state

- Countdown timer

- Exam progress

- Manual submit

- Submit confirmation

- Auto-submit when timer expires

==================================================

10. STUDENT EXAM INTERFACE

==================================================

Create a serious professional exam interface.

Main area:

- Question

- Question number

- Answer options

- Navigation

- Mark for review

Side panel:

- Camera preview

- Monitoring status

- Risk score

- Risk level

- Camera status

- Face status

- Microphone status

- Suspicious event count

Top:

- Exam name

- Student name

- Timer

- Connection status

Bottom:

- Question navigation

- Submit button

Mobile version must reorganize this layout appropriately.

==================================================

11. AI PROCTORING INTERFACE

==================================================

Create an API-ready AI monitoring interface.

Display:

Camera:

Connected / Disconnected

Face:

Detected / Missing

Multiple Faces:

Clear / Detected

Object Detection:

Clear / Suspicious Object Detected

Attention:

Normal / Looking Away

Microphone:

Connected / Disconnected

Monitoring:

Active / Paused

Risk Score:

0–100

Risk levels:

0–30 NORMAL

31–60 WARNING

61–80 SUSPICIOUS

81–100 HIGH RISK

IMPORTANT:

At this stage, DO NOT implement fake real AI.

Use clearly labeled DEMO/TEST mock data.

Create a clean service abstraction so real Python AI APIs can replace the mock implementation later.

==================================================

12. PROCTORING EVENTS

==================================================

Create a real-time-style event timeline.

Example events:

- Face detected

- Face missing

- Multiple faces detected

- Looking away

- Phone/object detected

- Camera disconnected

- Microphone disconnected

- Fullscreen exited

- Tab switched

Each event should contain:

- Event type

- Timestamp

- Severity

- Description

- Risk impact

Example:

10:42:18

Phone detected

Severity: High

Risk +40

Use professional event presentation.

==================================================

13. RISK SCORING ENGINE

==================================================

Create a modular risk scoring service.

Initial demo weights:

Phone detected = +40

Multiple faces = +50

Face missing = +30

Looking away = +10

Camera disconnected = +30

Tab switched = +20

Fullscreen exited = +15

Risk score must:

- Increase when events occur

- Never exceed 100

- Be configurable

- Be stored with events

- Update the UI immediately

Risk levels:

0–30 NORMAL

31–60 WARNING

61–80 SUSPICIOUS

81–100 HIGH RISK

Do not label one isolated event as confirmed cheating.

Use terms like:

"Suspicious Activity"

"Attention Event"

"Potential Violation"

rather than claiming certainty.

==================================================

14. TESTING MODE

==================================================

Create a developer/admin "Testing Mode".

Allow the admin/developer to simulate:

1. Normal behaviour

2. Face missing

3. Multiple faces

4. Looking away

5. Phone detected

6. Camera disconnected

7. Tab switched

8. Fullscreen exited

When a test event is triggered:

- Create an event

- Add timestamp

- Update risk score

- Update risk level

- Update event timeline

- Display appropriate warning

- Update dashboard statistics

Every simulated event MUST clearly show:

DEMO / TEST EVENT

Never present simulated events as real AI detections.

==================================================

15. EXAM RESULT

==================================================

After submission, create a professional result page.

Show:

Score

Correct answers

Incorrect answers

Questions attempted

Time taken

Final risk score

Final risk level

Total suspicious events

Show:

"Exam Performance"

and

"Proctoring Summary"

Do not reveal answers unnecessarily if the exam is configured to hide them.

==================================================

16. ADMIN DASHBOARD

==================================================

Create a professional admin dashboard.

Top metrics:

Total Students

Active Exams

Active Sessions

Normal

Warning

Suspicious

High Risk

Charts:

- Risk distribution

- Suspicious events over time

- Event categories

- Exam participation

- Average risk score

Use real-looking demo data.

Do not use fake marketing statistics.

==================================================

17. LIVE MONITORING

==================================================

Create a live monitoring page.

Display student monitoring cards/table.

Each student:

- Name

- Student ID

- Exam

- Camera status

- Monitoring status

- Risk score

- Risk level

- Latest event

- Last activity

- Session duration

Filters:

All

Normal

Warning

Suspicious

High Risk

Search:

Student name

Student ID

Sort:

Risk score

Latest activity

Student name

==================================================

18. STUDENT DETAIL / INVESTIGATION

==================================================

When admin selects a student, show:

- Student information

- Exam information

- Current risk score

- Risk history

- Risk graph

- Event timeline

- Suspicious events

- Evidence

- Exam progress

- Final report

Make this page feel like a professional investigation/incident review interface.

==================================================

19. EVIDENCE MANAGEMENT

==================================================

Create an evidence page.

Evidence item:

- Screenshot/image placeholder

- Event type

- Timestamp

- Student

- Severity

- Description

Features:

- Search

- Filters

- Sort

- Preview

- Event details

For now use demo placeholders.

Actual evidence storage will be connected later.

==================================================

20. EXAM MANAGEMENT

==================================================

Admin can:

- Create exam

- Edit exam

- Delete exam

- Publish/unpublish

- Set duration

- Set start/end date

- Add questions

- Edit questions

- Delete questions

- View participants

Create proper forms and validation.

==================================================

21. QUESTION MANAGEMENT

==================================================

Admin should be able to create MCQs.

Fields:

- Question

- Option A

- Option B

- Option C

- Option D

- Correct answer

- Marks

- Difficulty

Support:

Easy

Medium

Hard

==================================================

22. STUDENT MANAGEMENT

==================================================

Admin can:

- View students

- Search students

- Add students

- Edit students

- Enable/disable accounts

- View student details

- View exam history

==================================================

23. REPORTS

==================================================

Create a professional reports section.

Report types:

- Exam report

- Student report

- Proctoring report

- Suspicious activity report

Include:

- Date filters

- Exam filters

- Student filters

- Risk filters

Provide UI for:

Generate Report

Export Report

The actual backend report generation can be implemented later.

==================================================

24. DATABASE ARCHITECTURE

==================================================

Create database-ready models/interfaces for:

users

students

admins

exams

questions

exam_sessions

exam_answers

proctor_events

risk_scores

evidence

reports

Use proper relationships.

Make the architecture compatible with Supabase/PostgreSQL.

==================================================

25. FUTURE AI BACKEND INTEGRATION

==================================================

IMPORTANT:

The real AI detection engine will later be implemented in Python using:

- YOLO

- OpenCV

- MediaPipe

- Behaviour analysis

- Machine learning risk analysis

The React frontend must NOT implement the heavy AI inference directly.

Create a centralized AI/proctoring service abstraction.

Future API endpoints:

POST /api/proctor/start

POST /api/proctor/frame

GET /api/proctor/status

GET /api/proctor/events

GET /api/proctor/risk

POST /api/proctor/stop

For now use mock/demo responses.

Keep the interface strongly typed.

Make replacing mock services with real API calls easy.

==================================================

26. SECURITY

==================================================

Implement:

- Protected routes

- Role-based access

- Secure session handling

- Logout

- Form validation

- Error handling

- API abstraction

- No secret keys in frontend

- Clear privacy/consent UI

Do not expose sensitive credentials.

==================================================

27. UX DETAILS

==================================================

Every major page must include:

- Loading state

- Empty state

- Error state

- Success feedback

- Toast notifications where appropriate

Avoid unnecessary popups.

Use confirmations for destructive actions.

Use clear human-readable messages.

==================================================

28. ACCESSIBILITY

==================================================

Ensure:

- Keyboard navigation

- Proper labels

- Accessible buttons

- Good contrast

- Visible focus states

- Responsive text

- Screen-reader-friendly structure where possible

==================================================

29. MOBILE EXPERIENCE

==================================================

Prioritize the mobile exam experience.

On mobile:

- Camera preview should remain visible

- Risk status should remain accessible

- Questions should be easy to read

- Options should be touch-friendly

- Timer should remain visible

- Navigation should be easy

- Submit confirmation should be clear

Admin pages should also work on mobile.

==================================================

30. CODE QUALITY

==================================================

Use:

- TypeScript types

- Reusable components

- Clean folder structure

- Service layer

- Centralized constants

- Reusable UI components

- Proper error handling

- Form validation

- No unnecessary duplication

Do not put everything into one large component.

==================================================

31. REALISTIC DEMO DATA

==================================================

Populate the application with realistic demo data.

Example students:

Aarav Sharma

Riya Patel

Aditya Verma

Ananya Singh

Rahul Mehta

Example exams:

AI Fundamentals

Data Structures

Machine Learning Basics

Computer Networks

Example proctoring events:

Phone detected

Looking away

Face missing

Multiple faces

Tab switched

Fullscreen exited

Clearly mark demo data wherever necessary.

==================================================

32. FINAL PRODUCT QUALITY

==================================================

The final application should feel like:

A real professional examination security platform.

It should NOT feel like:

- A college mini-project

- A generic admin template

- An AI-generated mockup

- A simple quiz website

Prioritize usability over decoration.

Every component should serve a purpose.

Use realistic professional copy.

Do not make unsupported claims about AI accuracy.

Make all navigation functional.

Make the demo quiz fully usable.

Make the testing mode fully usable.

Make the architecture ready for the real Python AI backend.

==================================================

33. FINAL NAVIGATION

==================================================

Student navigation:

Dashboard

Exams

Demo Quiz

Exam History

Profile

Admin navigation:

Dashboard

Live Monitoring

Students

Exams

Questions

Evidence

Reports

Testing Mode

Settings

==================================================

34. FINAL REQUIREMENT

==================================================

Build the complete application now.

Do not stop at the landing page.

Implement the pages, routes, reusable components, responsive layouts, demo quiz, admin dashboard, testing mode, risk scoring mock service, database-ready architecture, and API-ready proctoring service.

The result should be polished enough to use as the foundation for a real deployed product.

Do not claim real AI functionality until the Python YOLO/OpenCV/MediaPipe backend is connected.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0e67ebde-fe16-444f-b1f6-fc7805888942).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
