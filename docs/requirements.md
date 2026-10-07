# IT Asset & Support Management System — Requirements

## 1. Problem Statement

Organisations use IT assets such as laptops, monitors, and mobile phones for daily operations. Managing asset records and technical support requests separately can make it difficult for IT staff to track equipment ownership and related technical issues.

The IT Asset & Support Management System will provide a centralised web application where IT Administrators can manage organisational IT assets and support requests, while Employees can view their assigned assets and report technical problems.

## 2. Target Users

### Employee
Employees will be able to:
- Register and log in
- View their assigned assets
- Create support tickets for assigned assets
- Track their own tickets
- Add comments to their tickets
- View their profile

### IT Administrator / Support Staff
Administrators will be able to:
- Manage employees
- Manage IT assets
- Assign and unassign assets
- Manage support tickets
- Set ticket priority and status
- Assign tickets
- Add comments
- View dashboard statistics

---

## 3. Functional Requirements

**FR01 — Registration:** Employees shall be able to create an account using their name, email, password, and department.

**FR02 — Login:** Registered users shall be able to securely log in using their email and password.

**FR03 — Role-Based Access:** The system shall restrict functionality according to Employee and IT Administrator roles.

**FR04 — Employee Management:** Administrators shall be able to view and manage employee accounts.

**FR05 — Asset Creation:** Administrators shall be able to register new IT assets.

**FR06 — Asset Management:** Administrators shall be able to view, update, and archive IT assets.

**FR07 — Asset Assignment:** Administrators shall be able to assign and unassign assets to employees.

**FR08 — Assigned Assets:** Employees shall be able to view assets currently assigned to them.

**FR09 — Ticket Creation:** Employees shall be able to create support tickets for their assigned assets.

**FR10 — Ticket Viewing:** Employees shall be able to view and track only their own support tickets.

**FR11 — Ticket Management:** Administrators shall be able to view and manage all support tickets.

**FR12 — Ticket Assignment:** Administrators shall be able to assign tickets to IT support staff.

**FR13 — Ticket Priority:** Administrators shall be able to set ticket priority as Low, Medium, or High.

**FR14 — Ticket Status:** Administrators shall be able to set ticket status as Open, In Progress, or Resolved.

**FR15 — Ticket Comments:** Employees and Administrators shall be able to add comments to tickets they are authorised to access.

**FR16 — Dashboard:** The system shall display relevant asset and ticket summary information through role-appropriate dashboards.

**FR17 — Profile:** Authenticated employees shall be able to view their profile information.

**FR18 — Logout:** Authenticated users shall be able to log out.

---

## 4. Non-Functional Requirements

**NFR01 — Security:** Passwords shall be hashed and protected routes shall require authentication and appropriate role authorisation.

**NFR02 — Validation:** Relevant user input shall be validated on the server before processing or storage.

**NFR03 — Configuration Security:** Database credentials and authentication secrets shall use environment variables and shall not be committed to GitHub.

**NFR04 — Usability:** The application shall provide clear, consistent, and easy-to-understand navigation and feedback.

**NFR05 — Responsiveness:** The interface shall support desktop, tablet, and mobile screen sizes.

**NFR06 — Accessibility:** The interface shall use labelled forms, semantic HTML, readable contrast, and basic keyboard accessibility.

**NFR07 — Reliability:** Invalid requests and application errors shall be handled without crashing the application and shall return meaningful messages.

**NFR08 — Maintainability:** Code shall use a modular structure with clearly separated responsibilities.

**NFR09 — Data Integrity:** User emails and asset tags shall be unique, and relationships between records shall remain valid.

**NFR10 — Deployment:** The completed application shall be deployed to the cloud and publicly accessible during assessment.

---

## 5. Project Scope

### In Scope
- Employee and Administrator roles
- Authentication and role-based access
- Employee management
- IT asset CRUD and archiving
- Asset assignment and status tracking
- Support ticket creation and management
- Ticket assignment, priority, status, and comments
- Role-based dashboards
- User profile
- REST API
- Server-side validation and error handling
- Responsive and accessible interface
- MongoDB cloud database
- Public cloud deployment

### Out of Scope
- Real-time chat
- AI chatbot or AI ticket resolution
- Automatic hardware discovery
- Microsoft Intune or similar enterprise integrations
- Procurement and supplier management
- Native mobile applications
- Multi-organisation support
- Advanced analytics or machine learning
- Email/SMS notification automation

---

## 6. User Stories

### Employee

**US01:** As an employee, I want to register and log in so that I can securely access the system.

**US02:** As an employee, I want to view my assigned assets so that I know which equipment I am responsible for.

**US03:** As an employee, I want to create a support ticket for an assigned asset so that I can report a technical problem.

**US04:** As an employee, I want to view my tickets so that I can track their progress.

**US05:** As an employee, I want to add comments to my tickets so that I can provide additional information.

**US06:** As an employee, I want to view my profile so that I can check my account information.

### IT Administrator

**US07:** As an administrator, I want to manage employees so that system users can be maintained.

**US08:** As an administrator, I want to manage IT assets so that accurate equipment records are maintained.

**US09:** As an administrator, I want to assign and unassign assets so that equipment responsibility can be tracked.

**US10:** As an administrator, I want to archive assets that are no longer active so that historical records are retained.

**US11:** As an administrator, I want to manage support tickets so that employee technical issues can be handled.

**US12:** As an administrator, I want to assign tickets to support staff so that responsibility is clear.

**US13:** As an administrator, I want to manage ticket priority and status so that issues can be handled effectively.

**US14:** As an administrator, I want to add ticket comments so that I can communicate updates.

**US15:** As an administrator, I want to view dashboard statistics so that I can quickly understand asset and ticket activity.

---

## 7. Data Requirements

### User
- Name
- Email (unique)
- Password (hashed)
- Role
- Department
- Account Status
- Created At
- Updated At

### IT Asset
- Asset Name
- Asset Tag (unique)
- Category
- Brand
- Model
- Serial Number
- Status: Available, Assigned, Under Repair, Archived
- Assigned To
- Purchase Date
- Notes
- Created At
- Updated At

### Support Ticket
- Title
- Description
- Category: Hardware, Software, Network, Other
- Priority: Low, Medium, High
- Status: Open, In Progress, Resolved
- Created By
- Related Asset
- Assigned To
- Created At
- Updated At
- Resolved At

### Ticket Comment
- Ticket
- Author
- Message
- Created At
- Updated At

---

## 8. Entity Relationships

- One Employee can be assigned multiple Assets; an Asset can be assigned to one Employee at a time.
- One Employee can create multiple Support Tickets; each Ticket belongs to one Employee.
- One Asset can have multiple Support Tickets over time; each Ticket relates to one Asset.
- A Ticket can be assigned to an IT Administrator / Support Staff member.
- One Ticket can contain multiple Comments.
- Each Comment belongs to one Ticket and is created by one User.

---

## 9. Key Business Rules

1. Employees can only view assets assigned to them.
2. Employees can only create tickets for their assigned assets.
3. Employees can only access their own tickets.
4. Only Administrators can manage employees and assets.
5. Only Administrators can assign assets and manage ticket priority, status, and assignment.
6. An asset can be assigned to only one employee at a time.
7. User email addresses and asset tags must be unique.
8. Archived assets cannot be assigned as active equipment.
9. Users may only comment on tickets they are authorised to access.