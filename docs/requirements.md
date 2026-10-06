# System Requirements

## Functional Requirements

### FR01 — User Registration
The system shall allow employees to create an account using their name, email address, and password.

### FR02 — User Login
The system shall allow registered users to securely log in using their email address and password.

### FR03 — Role-Based Access
The system shall provide different system permissions based on whether the logged-in user is an Employee or IT Administrator.

### FR04 — Employee Management
The IT Administrator shall be able to view and manage employee accounts.

### FR05 — Asset Creation
The IT Administrator shall be able to register new IT assets in the system.

### FR06 — Asset Management
The IT Administrator shall be able to view, update, and archive existing IT assets.

### FR07 — Asset Assignment
The IT Administrator shall be able to assign and unassign IT assets to employees.

### FR08 — Assigned Asset Viewing
Employees shall be able to view IT assets currently assigned to them.

### FR09 — Ticket Creation
Employees shall be able to create support tickets for IT assets assigned to them.

### FR10 — Ticket Viewing
Employees shall be able to view and track their own support tickets.

### FR11 — Ticket Management
The IT Administrator shall be able to view and manage all support tickets.

### FR12 — Ticket Assignment
The IT Administrator shall be able to assign support tickets to IT support staff.

### FR13 — Ticket Priority
The IT Administrator shall be able to classify tickets as Low, Medium, or High priority.

### FR14 — Ticket Status
The IT Administrator shall be able to update ticket status as Open, In Progress, or Resolved.

### FR15 — Ticket Comments
Employees and IT Administrators shall be able to add comments to relevant support tickets.

### FR16 — Dashboard
The system shall display summary information about IT assets and support tickets through a dashboard.

### FR17 — Logout
Authenticated users shall be able to securely log out of the system.


## Non-Functional Requirements

### NFR01 — Security
User passwords shall be securely hashed before being stored in the database, and protected routes shall require authentication and appropriate authorisation.

### NFR02 — Usability
The system shall provide a clear and consistent user interface that allows users to navigate the application easily.

### NFR03 — Responsiveness
The user interface shall adapt appropriately to desktop, tablet, and mobile screen sizes.

### NFR04 — Performance
The system should respond to normal user requests within a reasonable time under expected coursework-level usage.

### NFR05 — Reliability
The system shall handle invalid requests and application errors without crashing and shall provide meaningful error messages.

### NFR06 — Maintainability
The application code shall be organised into reusable components and separate routes, controllers, models, and middleware where appropriate.

### NFR07 — Data Validation
User input shall be validated before relevant data is processed or stored in the database.

### NFR08 — Configuration Security
Sensitive configuration values such as database connection strings and authentication secrets shall be stored using environment variables and shall not be committed to the public GitHub repository.

### NFR09 — Accessibility
Forms shall use appropriate labels and the interface shall follow basic accessibility practices such as semantic HTML and readable contrast.

### NFR10 — Availability
The completed application shall be deployed to a cloud platform and remain publicly accessible during the assessment period.

## Project Scope

### In Scope

The first version of the IT Asset & Support Management System will include:

- Employee and IT Administrator user roles
- User registration and authentication
- Role-based access control
- Employee management
- IT asset registration and management
- Asset assignment and unassignment
- Asset status tracking
- Support ticket creation and management
- Ticket priority and status management
- Ticket comments
- Dashboard statistics
- REST API communication between the frontend and backend
- Server-side validation and error handling
- Responsive user interface
- Cloud database
- Public cloud deployment

### Out of Scope

The following features will not be included in the initial version:

- Real-time live chat
- AI chatbot or AI-based ticket resolution
- Automatic hardware discovery
- Integration with enterprise systems such as Microsoft Intune
- Complex inventory procurement and supplier management
- Real payment processing
- Native Android or iOS applications
- Multi-organisation or multi-tenant support
- Advanced analytics or machine learning

## User Stories

### Employee User Stories

**US01**  
As an employee, I want to create an account and log in so that I can securely access the system.

**US02**  
As an employee, I want to view the IT assets assigned to me so that I know which company equipment I am responsible for.

**US03**  
As an employee, I want to create a support ticket for an assigned asset so that I can report technical problems to the IT support team.

**US04**  
As an employee, I want to view my support tickets so that I can track the progress of reported issues.

**US05**  
As an employee, I want to add comments to my support ticket so that I can provide additional information to IT support.

### IT Administrator User Stories

**US06**  
As an IT administrator, I want to view employees so that I can manage users within the system.

**US07**  
As an IT administrator, I want to register and manage IT assets so that the organisation has an accurate record of its equipment.

**US08**  
As an IT administrator, I want to assign and unassign assets to employees so that equipment ownership and responsibility can be tracked.

**US09**  
As an IT administrator, I want to view all support tickets so that I can manage employee technical issues.

**US10**  
As an IT administrator, I want to assign priorities and update ticket statuses so that support requests can be handled efficiently.

**US11**  
As an IT administrator, I want to add comments to support tickets so that I can communicate updates to employees.

**US12**  
As an IT administrator, I want to view dashboard statistics so that I can quickly understand the current status of assets and support requests.