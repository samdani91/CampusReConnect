# CampusReConnect

**A Platform for Research Activities Within the University of Dhaka**

## 🧠 Overview

CampusReConnect is a social-academic web platform designed to enhance research collaboration among students and faculty members of the University of Dhaka. Inspired by platforms like ResearchGate, it fosters interdisciplinary connections, community formation, and effective communication for academic growth.

This repository contains the Software Requirements Specification (SRS), data models, design diagrams, and user manual necessary for developing and understanding the CampusReConnect application.

---

## ✨ Features

### 🔐 Authentication & Security
- Institutional email verification
- Secure login and password management (reset, change, logout)
- User roles: Student, Faculty, Moderator

### 👤 Profile Management
- Detailed academic profiles with citation count, h-index, and interests
- Profile editing and statistics update
- Research contributions, skills, and disciplines

### 📰 Content Feed
- Domain-specific feed based on department and research interests
- Personalized suggestions
- Auto-summary feature for posts and documents

### 🧵 Posting & Interaction
- Post research updates, papers, and queries
- React and comment (upvotes/downvotes)
- Tag-based categorization

### 💬 Messaging & Notification
- Real-time messaging with inbox
- Notifications for post interactions and system alerts

### 👥 Community
- Faculty-led research communities
- Member approval, post moderation, and group collaboration
- Community feeds, discussions, and role-based access

### 🏅 Gamification
- Points and badge system to encourage contribution
- Leaderboards and activity recognition

---

## 📊 System Design

### 🔎 Use Case Diagrams
- Core modules: Authentication, User, Post, Message, Notification, Community, Gamification
- Actors: Student, Faculty, Moderator, Gemini API, SendGrid API

### 🏗 Data Modeling
- ER and Schema diagrams
- Data objects include: User, Post, Community, Comment, Message, Notification, etc.

### 🧱 Class-Based Design
- Detailed CRC and Class diagrams
- Driver class to link all modules cohesively

### 🔁 Behavioral Modeling
- State Transition Diagrams
- Event Tables for every system interaction
- Sequence Diagrams to visualize workflows



## 🛠️ Technology Stack

| Layer       | Technology                      |
|-------------|----------------------------------|
| Frontend    | `React.js`                      |
| Backend     | `Node.js`                       |
| Database    | `MySQL`                       |
| AI Features | `Gemini API` (Summary genaration) |

## Environment Variables

To run this project, you will need to add the following environment variables to your backend .env file

`GEMINI_API_KEYY`

`SENDGRID_API_KEY`

## Run Locally

Clone the project

```bash
  git clone https://github.com/samdani91/CampusReConnect
```

Go to the project directory

```bash
  cd CampusReConnect
```
Go to backend directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Start the backend server

```bash
  npm run dev
```

Go to frontend directory

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start the frontend server

```bash
  npm run dev
```

## 🚧 Challenges Faced

- Coordinating team work in a large-scale project
- First-time GitHub collaboration
- Implementing real-time socket communication
- Backend and database dependency handling
- Simultaneous learning and development

---



## 🚀 Future Enhancements

- Smarter content recommendation algorithms
- File attachments in direct messages
- Expansion beyond DU to enable cross-university collaboration

---

## 📚 Reference

- ResearchGate: [https://www.researchgate.net](https://www.researchgate.net)

---

## 👥 Authors

- **Mohammed Yasin** (BSSE 1406)
- **A. M Samdani Mozumder** (BSSE 1412)

**Supervised by:**  
Dr. Md. Nurul Ahad Tawhid  
Associate Professor, Institute of Information Technology, University of Dhaka

---

## 📅 Submission Date

**March 9, 2025**

