# AssetFlow — IT Asset & Support Management System

A full-stack web application developed using the MERN stack to manage organisational IT assets, employee assignments, and technical support requests.

## 1. Project Overview

AssetFlow is an IT Asset & Support Management System developed as an individual academic project for the MSc Information Systems with Computing programme at Dublin Business School.

The application provides a centralised platform where organisations can maintain IT equipment records, assign assets to employees, and manage technical support requests.

Employees can view their assigned equipment and report technical issues, while IT administrators can manage employees, assets, support tickets, and their associated workflows.

## 2. Live Application

**Frontend:** https://assetflow-frontend-rb22.onrender.com

**Backend:** https://assetflow-backend-tz6h.onrender.com

**GitHub Repository:** https://github.com/gauravsaini9782/IT-Asset-Support-Management-System

The application is deployed using Render and MongoDB Atlas. The free hosting tier may require additional time to respond after a period of inactivity.

## 3. Technology Stack

| Layer           | Technologies                    |
| --------------- | ------------------------------- |
| Frontend        | React.js, Vite, Tailwind CSS    |
| Backend         | Node.js, Express.js             |
| Database        | MongoDB Atlas, Mongoose         |
| Authentication  | JSON Web Tokens (JWT), bcryptjs |
| API             | RESTful HTTP APIs               |
| Version Control | Git, GitHub                     |
| Deployment      | Render                          |

## 4. User Roles and Features

### Employee

- Register and log in securely
- View personal profile
- View assigned IT assets
- Create support tickets for assigned equipment
- View and track personal support tickets
- Add comments to authorised tickets
- Log out with a confirmation dialog

### IT Administrator

- Log in to the administrator workspace
- View dashboard statistics
- View and update employee information and account status
- Create, view and update IT assets
- Assign and unassign assets
- Archive and restore assets
- Delete assets where permitted by the system's business rules
- Search and filter asset records
- View and manage support tickets
- Assign tickets to support staff
- Update ticket priority and status
- Add comments to support tickets
- Log out with a confirmation dialog

## 5. Main Application Features

### Authentication and Authorisation

AssetFlow uses JWT-based authentication and bcryptjs password hashing.

- Employee registration and login
- Protected backend API routes
- Employee and administrator role-based authorisation
- Restrictions on inactive user accounts
- Session restoration through token validation
- Logout confirmation to reduce accidental sign-outs

### IT Asset Management

The system maintains asset details such as asset name, tag, category, brand, model, serial number and status.

Assets can be assigned to employees, unassigned, archived and restored. Asset tags are configured to be unique, and assignment rules help prevent an asset from being assigned to multiple employees simultaneously.

### Support Ticket Management

Employees can create tickets associated with their assigned equipment. Each ticket includes a title, description, category, priority, status and relevant user and asset references.

Administrators can manage ticket assignments, priorities and statuses. Both roles can communicate through ticket comments, subject to the application's access restrictions.

### Dashboard and User Experience

Role-specific dashboards present relevant information and actions.

The interface includes responsive layouts, search and filtering controls, status indicators, form feedback and a custom logout confirmation dialog.

The logout dialog provides **Cancel** and **Yes, log out** actions and supports closing with the Escape key.

## 6. Project Structure

```text
IT-Asset-Support-Management-System/
├── client/                 # React frontend
├── server/                 # Express backend
├── docs/                   # Requirements and planning documents
└── README.md
```

The backend uses separate models, controllers, routes and middleware to organise application responsibilities.

The main MongoDB models are:

- **User:** Employee and administrator accounts
- **Asset:** IT equipment and assignment information
- **Ticket:** Technical support requests
- **Comment:** Communication associated with tickets

## 7. Local Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas database
- Git

### Clone the repository

```bash
git clone https://github.com/gauravsaini9782/IT-Asset-Support-Management-System.git
cd IT-Asset-Support-Management-System
```

### Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and configure the required environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

Start the backend using the development script:

```bash
npm run dev
```

### Frontend setup

Open a separate terminal:

```bash
cd client
npm install
```

Create `client/.env.development` with:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local address displayed by Vite in the terminal.

**Security note:** Real database credentials and JWT secrets must never be committed to GitHub. Environment variables should be configured separately for local development and deployment.

## 8. Deployment

The application uses three cloud-hosted components:

1. **Render Static Site:** React frontend
2. **Render Web Service:** Node.js and Express backend
3. **MongoDB Atlas:** Cloud-hosted MongoDB database

The frontend communicates with the backend through REST API requests. The backend accesses MongoDB Atlas through Mongoose.

Production environment variables are configured through the hosting services rather than being stored directly in the source code.

## 9. Testing

Manual functional testing was carried out on the deployed application.

The following workflows were checked:

- Employee login and dashboard access
- Employee profile and assigned-asset display
- Support ticket creation and persistence after refresh
- Administrator login and dashboard access
- Administrator ticket status update
- Updated ticket status appearing in the employee workspace
- Logout confirmation for both Employee and Administrator accounts
- Cancellation of logout without ending the session
- Confirmed logout returning the user to the login page

These checks provide evidence of the main workflows. They do not constitute comprehensive automated, performance, accessibility or security testing.

## 10. Project Scope and Limitations

AssetFlow focuses on essential asset management and support ticket functionality.

The following features are outside the current project scope:

- Automatic hardware discovery
- Real-time chat
- Email or SMS notifications
- AI-powered ticket resolution
- Procurement and supplier management
- Enterprise device-management integrations
- Multi-organisation support
- Native mobile applications

Further development could include automated testing, improved accessibility, stronger validation and additional deployment security controls.

## 11. AI Usage Declaration

AssetFlow was developed as an individual academic assignment for the MSc Information Systems with Computing programme at Dublin Business School.

ChatGPT (OpenAI) was used as a supplementary learning and development tool throughout the project. Its assistance included requirements planning, explanations of development concepts, implementation guidance, code examples, debugging support, documentation drafting and deployment troubleshooting.

The application was assembled, configured, reviewed and manually tested as part of the individual project. AI-assisted suggestions were evaluated against the application's requirements and observed behaviour.

### AI Conversation Records

The following shared ChatGPT conversations are provided for transparency:

1. [ChatGPT Conversation 1](https://chatgpt.com/share/6af3a62e-7b94-83eb-b88e-82a01fa85779)
2. [ChatGPT Conversation 2](https://chatgpt.com/share/6af3a643-eba8-83ed-ad15-01945dc786ea)
3. [ChatGPT Conversation 3](https://chatgpt.com/share/6af3a657-9ed4-83ed-9499-148f636ea7ff)

### Academic Integrity

This project is submitted as individual coursework. AI assistance is disclosed to distinguish supporting guidance and generated suggestions from the implementation, testing and project decisions made during development.

---

**Project:** AssetFlow — IT Asset & Support Management System

**Programme:** MSc Information Systems with Computing

**Institution:** Dublin Business School

**Module:** B9IS130 — Web Development for Information Systems
