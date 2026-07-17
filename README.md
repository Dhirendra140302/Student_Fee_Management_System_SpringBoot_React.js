# 🎓 Student Fee Management System

A full-stack **Student Fee Management System** built with **Spring Boot**, **React.js**, **MySQL**, and **Spring Security**. The application enables administrators to manage students, courses, and fee records while allowing students to securely access their own fee information through a dedicated portal.

---

## 📌 Project Overview

The Student Fee Management System is designed to simplify and automate the process of managing student fee records in educational institutions. It replaces manual record-keeping with a secure, responsive, and user-friendly web application.

The system provides role-based authentication, allowing administrators to perform complete CRUD operations while students can securely log in and view their personal fee details.

---

# 🚀 Features

### 👨‍💼 Admin Module

* Secure Admin Login
* Dashboard with system statistics
* Manage Students

  * Add Student
  * Update Student
  * Delete Student
  * View Students
* Manage Courses

  * Add Course
  * Update Course
  * Delete Course
* Manage Fee Records

  * Assign Fees
  * Update Fees
  * Delete Fee Records
  * View Fee Status
* Search Students
* Responsive Admin Dashboard

---

### 👨‍🎓 Student Module

* Secure Student Login
* View Profile
* View Enrolled Course
* View Total Fees
* View Paid Amount
* View Pending Amount
* Responsive Student Portal

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Context API
* HTML5
* CSS3
* JavaScript (ES6+)
* Vite

### Backend

* Java 17+
* Spring Boot
* Spring MVC
* Spring Data JPA
* Spring Security
* REST API
* Maven

### Database

* MySQL

### Tools

* Eclipse IDE
* VS Code
* Postman
* Git
* GitHub

---

# 🏗 System Architecture

```text
React Frontend
       │
       │ REST API (JSON)
       ▼
Spring Boot Backend
       │
       ▼
Spring Security
       │
       ▼
Service Layer
       │
       ▼
Repository Layer (JPA)
       │
       ▼
MySQL Database
```

---

# 📂 Project Structure

```text
Student_Fee_Management_System/
│
├── StudentFeeManagement/                 # Spring Boot Backend
│   ├── src/main/java
│   │      ├── config
│   │      ├── controller
│   │      ├── dto
│   │      ├── entity
│   │      ├── exception
│   │      ├── repository
│   │      ├── response
│   │      ├── service
│   │      └── StudentFeeManagementApplication.java
│   │
│   ├── src/main/resources
│   │      └── application.properties
│   │
│   └── pom.xml
│
├── StudentFeeManagementfrontend/         # React Frontend
│   ├── src
│   │      ├── components
│   │      ├── context
│   │      ├── pages
│   │      ├── services
│   │      ├── App.jsx
│   │      └── main.jsx
│   │
│   ├── public
│   └── package.json
│
└── README.md
```

---

# 🗄 Database Design

The application uses MySQL to store and manage all data.

Main entities include:

* Admin
* Student
* Course
* Fee

Relationships are managed using **Spring Data JPA**.

---

# 🔐 Authentication & Security

The project uses **Spring Security** to secure the application.

Features include:

* Role-based authentication
* BCrypt password encryption
* Secure login
* Protected REST APIs
* Unauthorized access prevention

---

# 🔄 Application Workflow

### Admin Flow

```text
Admin Login
      ↓
Dashboard
      ↓
Manage Students
      ↓
Manage Courses
      ↓
Manage Fees
      ↓
Database Updated
```

---

### Student Flow

```text
Student Login
      ↓
Student Dashboard
      ↓
View Fee Details
      ↓
Logout
```

---

# 📡 REST APIs

### Authentication

* Admin Login
* Student Login

### Student APIs

* Create Student
* Update Student
* Delete Student
* Get Student
* Get All Students

### Course APIs

* Create Course
* Update Course
* Delete Course
* Get Course
* Get All Courses

### Fee APIs

* Add Fee
* Update Fee
* Delete Fee
* Get Fee Details
* Get All Fees

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/Dhirendra140302/Student_Fee_Management_System_SpringBoot_React.js.git
```

---

## Backend Setup

```bash
cd StudentFeeManagement
```

Configure MySQL in

```properties
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_fee_management
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
```

Run:

```bash
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

## Frontend Setup

```bash
cd StudentFeeManagementfrontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173

---

# 🧪 Testing

The APIs were tested using:

* Postman
* Browser Testing

---

# 🎯 Future Enhancements

* Email Notifications
* Online Fee Payment Integration
* PDF Fee Receipt Generation
* Attendance Management
* Result Management
* Student Profile Image Upload
* Dashboard Analytics
* Excel Report Export
* JWT Authentication
* Docker Deployment
* Cloud Deployment (AWS/Azure)

---

# 💼 Skills Demonstrated

* Full Stack Development
* REST API Development
* Spring Boot
* Spring Security
* Spring Data JPA
* React.js
* MySQL Database Design
* Authentication & Authorization
* CRUD Operations
* Component-Based Architecture
* Responsive UI Design
* API Integration
* Git & GitHub

---

# 👨‍💻 Author

**Dhirendra Yadav**

Java Full Stack Developer

### Technical Skills

* Java
* Spring Boot
* Spring Security
* Hibernate
* JPA
* REST APIs
* React.js
* JavaScript
* HTML5
* CSS3
* MySQL
* Git
* GitHub

GitHub:
https://github.com/Dhirendra140302

