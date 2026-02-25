# CVET TELEMEDICINE Project Documentation

## Abstract
The **CVET Telemedicine** system is a comprehensive digital platform designed to bridge the gap between farmers and veterinary professionals. In many rural and underserved areas, access to timely veterinary care is a major challenge, leading to significant livestock losses. This project provides a web-based solution that allows farmers to manage their livestock, book virtual consultations, track medical cases, and receive expert advice remotely. By integrating real-time communication, data analytics, and electronic health records for animals, CVET Telemedicine aims to improve animal health outcomes and support the livelihood of farming communities.

## 1. Introduction

### 1.1 Importance of the project
Livestock farming is a critical component of the global economy and food security. However, traditional veterinary services often face logistical barriers such as distance, cost, and a shortage of professionals. The importance of this project lies in:
- **Accessibility**: Providing farmers with immediate access to veterinary expertise regardless of their location.
- **Cost-Effectiveness**: Reducing the need for physical travel for routine consultations.
- **Early Intervention**: Enabling quicker diagnosis and treatment through virtual consultations, which can prevent the spread of diseases.
- **Data Management**: Maintaining digital records of animal health, medications, and treatments for better long-term care and tracking.

### 1.2 General organization of the report
This report is organized into several chapters to provide a clear understanding of the project:
- **Chapter 2: System Analysis** - Defines the problem, examines the existing system, proposes the new solution, and lists hardware and software requirements.
- **Chapter 3: System Design** - Details the architectural design, database structure, and graphical user interface (GUI) design.
- **Chapter 4: Project Description** - Provides an overview of the core functionalities and goals.
- **Chapter 5: System Development** - Details the tools, languages, and core logic used.
- **Chapter 6: System Testing and Validations** - Describes the testing methodologies and data validation layers.

## 2. System Analysis

### 2.1 Problem Definition
Currently, many farmers rely on traditional, manual methods for livestock health management. When an animal falls ill, the farmer must either wait for a traveling vet or transport the animal to a clinic, both of which are time-consuming and expensive. There is often no central record of animal health history, making it difficult for vets to provide accurate long-term care. Furthermore, communication between vets and farmers is often disjointed and lacks a professional tracking mechanism.

### 2.2 Existing System
The existing system is largely manual and fragmented:
- **Manual Record Keeping**: Paper-based or non-existent health records for livestock.
- **Physical Consultations**: Heavy reliance on physical visits, which are limited by geography and professional availability.
- **Informal Communication**: Using basic phone calls or messaging apps that do not store medical context or history.
- **Lack of Analytics**: No way to track disease trends or vet performance across a region.

### 2.3 Proposed System
The proposed **CVET Telemedicine** system is a centralized, multi-role platform (Farmer, Vet, Admin) that automates and digitizes the veterinary care workflow:
- **Livestock Management**: Farmers can create digital profiles for each animal.
- **Virtual Consultations**: Integrated video/chat/messaging for remote diagnosis.
- **Appointment Scheduling**: Automated booking and reminder system.
- **Electronic Health Records (EHR)**: Centralized storage for cases, lab results, and prescriptions.
- **Role-Based Dashboards**: Customized interfaces for farmers, vets, and administrators to manage their specific tasks and view relevant analytics.

### 2.4 System Requirement

#### 2.4.1 Hardware Requirement
- **Server Side**:
  - Processor: Quad-core 2.4 GHz or higher.
  - RAM: 8 GB or more.
  - Storage: 100 GB SSD or higher for database and media uploads.
- **Client Side**:
  - Device: Smartphone, Tablet, or Laptop/PC.
  - Camera/Microphone: Required for virtual consultations.
  - Internet Connection: Stable broadband or 4G/5G mobile data.

#### 2.4.2 Software Requirement
- **Frontend**: React.js, Vite, Bootstrap, Tailwind CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL (managed via Sequelize ORM).
- **Real-time Communication**: Socket.io.
- **Mapping**: Leaflet.js.
- **Charting**: Chart.js / Recharts.
- **Development Tools**: Visual Studio Code, Git, npm/yarn.

## 3. System Design

### 3.1 Architectural Design
The system follows a **Client-Server Architecture** using the MERN-like stack (substituting MySQL for MongoDB):
- **Presentation Layer**: Built with React.js, providing a responsive and interactive UI for all users.
- **Application Layer**: Node.js and Express.js handle API requests, business logic, authentication (JWT), and real-time events.
- **Data Layer**: A MySQL relational database stores persistent data including users, animals, cases, appointments, and notifications.
- **Services Integration**: External services like Twilio for SMS and Multer for file storage.

### 3.2 Database Design
The database is structured using relational tables. Key entities include:
- **Users**: Stores profile information and roles (Admin, Vet, Farmer).
- **Animals/Livestock**: Stores details about specific animals (Species, Breed, DOB, OwnerID).
- **Appointments**: Tracks scheduled consultations (Date, Time, Status, Participants).
- **Cases**: Medical records linked to animals and vets (Diagnosis, Status, Severity).
- **Medications/Treatments**: Records prescribed drugs and treatment plans.
- **Notifications/Messages**: Stores communication logs and alerts.

### 3.3 GUI Design
The GUI is designed to be intuitive and accessible:
- **Responsive Layout**: Works seamlessly on mobile devices (essential for farmers in the field) and desktops.
- **Dashboard Overview**: Role-specific landing pages with quick-action cards and summary charts.
- **Sidebar Navigation**: Clear access to all modules like 'My Animals', 'Appointments', and 'Medical Cases'.
- **Forms and Tables**: Standardized input fields and data tables for consistent user experience.
- **Notification System**: Real-time alerts displayed via a topbar bell icon.

## 4. Project Description
The **CVET Telemedicine** portal is a robust full-stack application that facilitates remote veterinary services. It features a multi-interface system (Farmer, Veterinarian, and Administrator). Key functionalities include animal registration, case history tracking, virtual consultations via real-time messaging, and automated health reminders. The project emphasizes data security using JWT authentication and provides real-time updates for notifications and messages.

## 5. System Development

### 5.1 Language / Tool
- **Programming Languages**: JavaScript (ES6+), SQL, CSS3, HTML5.
- **Frontend Framework**: React.js with Vite for fast builds and HMR.
- **Backend Environment**: Node.js with Express.js framework.
- **Database Management**: MySQL database with Sequelize ORM for schema management and migrations.
- **State Management & Routing**: React Router DOM for client-side routing.
- **Styling Tools**: Tailwind CSS for utility-first styling and Bootstrap for responsive components.
- **Real-time Engine**: Socket.io for bi-directional communication.
- **API Client**: Axios for handling HTTP requests.

### 5.2 Pseudo code
Below is a high-level pseudo-code for the **Animal Case Submission** workflow:

```text
ALGORITHM SubmitMedicalCase
  INPUT: AnimalID, Symptoms, Severity, Images
  BEGIN
    IF user is NOT authenticated THEN
      RETURN Error "Unauthorized"
    END IF

    VALIDATE input fields (AnimalID, Symptoms)
    IF validation fails THEN
      RETURN Error "Invalid Data"
    END IF

    IF images exist THEN
      UPLOAD images to storage
      GET storage URLs
    END IF

    CREATE new Case record in Database with:
      animal_id = AnimalID
      symptoms = Symptoms
      severity = Severity
      image_urls = URLs
      status = "Pending"
      created_at = CURRENT_TIMESTAMP

    SEND real-time notification to available Veterinarians via Socket.io
    RETURN Success Message "Case Submitted"
  END
```

## 6. System Testing and Validations

### 6.1 Unit Testing
Unit testing focuses on individual components and functions:
- **Authentication Helpers**: Testing JWT signing and verification logic.
- **Utility Functions**: Testing date formatters and string manipulators.
- **Form Components**: Ensuring individual input fields correctly capture and validate user data before state updates.

### 6.2 Integration Testing
Integration testing ensures different modules work together:
- **API Endpoints**: Testing the connection between React frontend and Express backend using tools like Postman or Insomnia.
- **Database Operations**: Verifying that Sequelize models correctly perform CRUD operations on the MySQL database.
- **Socket Communication**: Ensuring that messages sent by a Farmer are correctly received by the assigned Veterinarian in real-time.

### 6.3 Acceptance Testing
Acceptance testing validates the system against business requirements:
- **User Workflows**: Verifying that a Farmer can successfully register an animal and book an appointment.
- **Role Permissions**: Ensuring that Vets cannot access Admin-only analytics and Farmers cannot modify Vet diagnostics.
- **Responsiveness**: Testing the UI on various screen sizes (Mobile, Tablet, Desktop) to ensure usability.

### 6.4 Validations
The system implements multiple layers of validation:
- **Client-Side Validation**: Using HTML5 attributes and React state to prevent empty submissions and invalid formats (e.g., Email regex).
- **Middleware Validation**: Using `express-validator` on the backend to sanitize inputs and enforce schema constraints.
- **Database Constraints**: Using MySQL constraints (NOT NULL, UNIQUE, FOREIGN KEY) to maintain data integrity.
- **Rate Limiting**: Implementing `express-rate-limit` to prevent brute-force attacks on authentication endpoints.
