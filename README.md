# 🎨 Smart Workplace Management Portal - Frontend

![React](https://img.shields.io/badge/React-18.3-61DAFB)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC)
![AI Chatbot](https://img.shields.io/badge/AI-Chatbot-purple)

A modern, responsive React frontend for workplace management with AI-powered assistance, real-time updates, and beautiful UI/UX.

## 🌟 Features

### User Features
- 🔐 **Secure Authentication** - JWT-based login/registration
- 📊 **Interactive Dashboard** - Real-time statistics and insights
- 📅 **Leave Management** - Apply, track, and manage leaves
- 📝 **Complaint System** - File and track complaints
- 🤖 **AI Chatbot** - Intelligent workplace assistant
- 📱 **Responsive Design** - Works on all devices
- 🌙 **Modern UI** - Clean, intuitive interface

### Manager/Admin Features
- 👥 **User Management** - Manage all users
- ✅ **Approve/Reject Leaves** - Quick decision making
- 📈 **Analytics Dashboard** - System insights
- ⚙️ **System Settings** - Configure application
- 📊 **Reports & Statistics** - Detailed analytics

## 🛠️ Tech Stack

- **React 18.3** - UI library
- **Vite 5.4** - Build tool & dev server
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS 3.4** - Utility-first CSS
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications
- **React Context API** - State management

## 📋 Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm 9+** or **yarn 1.22+**

## 📁 Project Structure
```
src/
├── api/
│ └── axios.js # API client configuration
├── components/
│ ├── auth/
│ │ ├── Login.jsx # Login page
│ │ └── Register.jsx # Registration page
│ ├── dashboard/
│ │ └── Dashboard.jsx # Main dashboard
│ ├── leaves/
│ │ ├── LeaveList.jsx # List of leaves
│ │ ├── LeaveForm.jsx # Leave request form
│ │ └── LeaveCard.jsx # Individual leave card
│ ├── complaints/
│ │ ├── ComplaintList.jsx # List of complaints
│ │ ├── ComplaintForm.jsx # Complaint form
│ │ └── ComplaintCard.jsx # Individual complaint card
│ ├── admin/
│ │ ├── AdminDashboard.jsx # Admin overview
│ │ ├── UserManagement.jsx # User CRUD
│ │ ├── Analytics.jsx # System analytics
│ │ └── SystemSettings.jsx # Settings page
│ ├── chatbot/
│ │ └── AIChatbot.jsx # AI assistant
│ └── layout/
│ ├── Layout.jsx # Main layout wrapper
│ ├── Sidebar.jsx # Navigation sidebar
│ └── Header.jsx # Top header
├── context/
│ └── AuthContext.jsx # Authentication context
├── utils/
│ └── ProtectedRoute.jsx # Route guard
├── App.jsx # Main app component
├── main.jsx # Entry point
└── index.css # Global styles
```


