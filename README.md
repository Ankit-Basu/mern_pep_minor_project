# 📝 Online Complaint / Issue Tracker System

A full-stack web application for tracking and managing complaints, built with **Vanilla HTML/CSS/JS** and **Node.js/Express**. This project demonstrates a complete CRUD system using in-memory data structures, designed with a premium, responsive UI.

## 🚀 Features

### Core Functionality (Per Requirements)

- **User Module**:
  - Submit complaints with Name, Email, Title, Description, and Priority.
  - Auto-generated Complaint IDs.
  - Default status set to `Pending`.
- **Admin Module**:
  - View all complaints in a grid layout.
  - Update status (`Pending` ➝ `Resolved` / `Rejected`).
  - Delete complaints.
- **API**: Full RESTful API implementation.

### ✨ Advanced Features (Bonus)

- **🎨 Premium UI**: Glassmorphism design with animated backgrounds.
- **🌓 Dark/Light Mode**: Fully functional theme toggle with local storage persistence.
- **📊 Admin Dashboard**:
  - Live Statistics (Total, Pending, Resolved, Rejected).
  - **Search & Filter**: Real-time filtering by status and priority.
  - **Export to CSV**: One-click download of all complaint data for reporting.
- **📱 Responsive Design**: Optimized for Desktops, Tablets, and Mobile devices.
- **⚡ In-Memory Storage**: Fast execution using volatile data structures (Arrays).

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (No frameworks).
- **Backend**: Node.js, Express.js.
- **Data**: In-Memory Data Structures (No Database).

---

## 📂 Project Structure

```bash
complaint-tracker/
├── controllers/          # Business logic & request handling
│   └── complaint.controller.js
├── middleware/           # Express middleware
│   ├── auth.middleware.js
│   └── logger.middleware.js
├── public/               # Static frontend files
│   ├── admin.html        # Admin Dashboard
│   ├── index.html        # User Submission Page
│   ├── script.js         # Client-side logic (Fetch API)
│   └── style.css         # Global styles & themes
├── routes/               # API Route definitions
│   └── complaint.routes.js
├── app.js                # App configuration
├── server.js             # Server entry point
└── package.json          # Dependencies
```

---

## 🔌 API Endpoints

| Method   | Endpoint             | Description                    |
| :------- | :------------------- | :----------------------------- |
| `GET`    | `/complaints`        | Retrieve all complaints        |
| `POST`   | `/complaints`        | Create a new complaint         |
| `GET`    | `/complaints/:id`    | Get a specific complaint by ID |
| `GET`    | `/complaints/export` | Download complaints as CSV     |
| `PUT`    | `/complaints/:id`    | Update complaint status        |
| `DELETE` | `/complaints/:id`    | Delete a complaint             |

---

## 🏁 How to Run

1.  **Clone the repository** (if applicable):

    ```bash
    git clone https://github.com/Ankit-Basu/mern_pep_minor_project.git
    cd mern_pep_minor_project
    ```

2.  **Navigate to the project directory**:

    ```bash
    cd complaint-tracker
    ```

3.  **Install Dependencies**:

    ```bash
    npm install
    ```

4.  **Start the Server**:

    ```bash
    node server.js
    # OR
    npm start
    ```

5.  **Access the Application**:
    - **User Form**: [http://localhost:3000](http://localhost:3000)
    - **Admin Dashboard**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

---

> **Note**: Since this application uses **In-Memory Storage**, all data will be reset when the server is restarted. This is by design as per the project constraints.
