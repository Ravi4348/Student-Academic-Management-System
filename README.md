# Academic Engagement, Student Risk & Academic Support Management System

## 1. Project Overview
The Student Academic Management System is a comprehensive platform designed to streamline and centralize academic administration. It provides role-based access for students, coordinators, department heads, and administrators to effectively monitor student performance, track attendance, identify at-risk students, and coordinate academic support programs such as remedial classes and guest lectures. By consolidating fragmented academic data, the system empowers institutions to proactively support student success through actionable analytics and event-driven notifications.

## 2. Problem Statement
Educational institutions often struggle with fragmented academic data spread across disparate systems, making it difficult to maintain a holistic view of student performance. Key challenges include:
- Fragmented and delayed result management.
- Inefficient monitoring of active backlogs and attendance.
- Delayed identification of at-risk students who need immediate intervention.
- Poor communication regarding remedial support and guest lectures.
- Lack of role-specific insights for HODs, Coordinators, and CTPOs to administer academic protocols effectively.

## 3. Solution
This platform offers a robust, centralized MERN-based solution that unifies academic data management. It provides a secure, role-based ecosystem where students can access their performance metrics, while faculty and administrators receive advanced diagnostic tools to monitor risks, organize remedial support, and track overall institutional performance. Automated notifications and structured workflows ensure that critical academic interventions are communicated promptly and accurately.

## 4. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React | UI |
| Frontend Language | JavaScript / JSX | Application development |
| UI | shadcn/ui | UI components |
| Styling | Tailwind CSS | Styling |
| Build Tool | Vite | Frontend build |
| Routing | React Router | Navigation |
| Charts | Recharts | Analytics visualization |
| Backend | Node.js | Runtime |
| API | Express.js | REST API |
| Backend Language | JavaScript | Server development |
| Database | MongoDB | Data storage |
| ODM | Mongoose | MongoDB access |
| File Storage | MongoDB GridFS | Persistent storage for avatars/media |
| Authentication | JWT | Authentication |
| Password Security | bcrypt | Password hashing |
| Result Processing | Python | PDF/result processing only |

## 5. Languages Used

### Application Languages
- JavaScript
- JSX

### Supporting Processing Language
- Python — used only by the result-processing pipeline for PDF extraction.

## System Architecture Flowchart

```mermaid
flowchart TD
    Users["Users"]
    ReactFrontend["React Frontend"]
    ReactRouterAuth["React Router / Auth Provider"]
    ExpressREST["Express REST API"]
    AuthRBAC["Authentication / RBAC"]
    Controllers["Controllers"]
    Services["Services"]
    MongoDB["MongoDB"]
    NotificationsAnalytics["Notifications / Analytics"]
    JSONResponse["JSON Response"]
    ReactUI["React UI"]
    PythonProcessor["Python Result Processor"]

    Users --> ReactFrontend
    ReactFrontend --> ReactRouterAuth
    ReactRouterAuth --> ExpressREST
    ExpressREST --> AuthRBAC
    AuthRBAC --> Controllers
    Controllers --> Services
    Services --> MongoDB
    Services --> NotificationsAnalytics
    Services --> JSONResponse
    JSONResponse --> ReactUI
    
    PythonProcessor -->|"Structured result data"| MongoDB
```

## Overall System Workflow

```mermaid
flowchart TD
    AppOpen["Application Open"]
    LoginPage["Login Page"]
    CredsValid{"Credentials Valid?"}
    JWTToken["JWT Token"]
    FetchUser["Fetch Authenticated User"]
    DetermineRole["Determine Role"]
    RoleDashboard["Role Dashboard"]
    Admin["Admin"]
    Principal["Principal"]
    HOD["HOD"]
    Coordinator["Coordinator"]
    CTPO["CTPO"]
    Student["Student"]
    InteractModules["Interact with Modules"]
    APIRequest["API Request"]
    AuthScope["Authentication + Scope Validation"]
    Controller["Controller"]
    BusinessService["Business Service"]
    MongoDB["MongoDB"]
    NotifsResults["Notifications / Analytics / Results"]
    JSONResponse["JSON Response"]
    ReactState["React State Update"]
    UIRender["UI Render"]

    AppOpen --> LoginPage
    LoginPage --> CredsValid
    CredsValid -->|"No"| LoginPage
    CredsValid -->|"Yes"| JWTToken
    JWTToken --> FetchUser
    FetchUser --> DetermineRole
    DetermineRole --> RoleDashboard
    RoleDashboard --> Admin
    RoleDashboard --> Principal
    RoleDashboard --> HOD
    RoleDashboard --> Coordinator
    RoleDashboard --> CTPO
    RoleDashboard --> Student
    Admin --> InteractModules
    Principal --> InteractModules
    HOD --> InteractModules
    Coordinator --> InteractModules
    CTPO --> InteractModules
    Student --> InteractModules
    InteractModules --> APIRequest
    APIRequest --> AuthScope
    AuthScope --> Controller
    Controller --> BusinessService
    BusinessService --> MongoDB
    BusinessService --> NotifsResults
    NotifsResults --> JSONResponse
    MongoDB --> JSONResponse
    JSONResponse --> ReactState
    ReactState --> UIRender
```

## Authentication / Authorization Workflow

```mermaid
flowchart TD
    Login["Login"]
    ValidateCreds["Validate credentials"]
    BcryptVerify["bcrypt/password verification"]
    JWTGen["JWT generation"]
    AuthContext["Authenticated user context"]
    RoleDet["Role determination"]
    RBAC["RBAC"]
    ScopeVal["Scope validation"]
    AuthAccess["Authorized module access"]

    Login --> ValidateCreds
    ValidateCreds --> BcryptVerify
    BcryptVerify --> JWTGen
    JWTGen --> AuthContext
    AuthContext --> RoleDet
    RoleDet --> RBAC
    RBAC --> ScopeVal
    ScopeVal --> AuthAccess
```
*Security Note: The system utilizes role-based access control (RBAC) paired with scope validation to ensure strict student identity protection. Students are rigorously isolated to only their own data.*

## Role Workflow

```mermaid
flowchart TD
    Admin["Admin: System Config & Audits"]
    Principal["Principal: Global Overview & Analytics"]
    HOD["HOD: Departmental Analytics & Approvals"]
    Coordinator["Coordinator: Class Monitoring & Remedial Scheduling"]
    CTPO["CTPO: Placements & Risk Assessment"]
    Student["Student: Results, Attendance & Backlogs"]

    Admin --- Principal
    Principal --- HOD
    HOD --- Coordinator
    Coordinator --- CTPO
    CTPO --- Student
```

## Student Academic Workflow

```mermaid
flowchart TD
    StudentLogin["Student Login"]
    Dashboard["Dashboard"]
    AcadInfo["Academic Information"]
    Results["Results"]
    SemSelection["Semester Selection"]
    SubjectResults["Subject Results"]
    SGPA["SGPA"]
    CGPA["CGPA"]
    Backlogs["Backlogs"]
    Attendance["Attendance"]
    RemedialClasses["Remedial Classes"]
    GuestLectures["Guest Lectures"]
    Notifications["Notifications"]

    StudentLogin --> Dashboard
    Dashboard --> AcadInfo
    Dashboard --> Results
    Results --> SemSelection
    SemSelection --> SubjectResults
    SubjectResults --> SGPA
    SubjectResults --> CGPA
    Dashboard --> Backlogs
    Dashboard --> Attendance
    Dashboard --> RemedialClasses
    Dashboard --> GuestLectures
    Dashboard --> Notifications
```

## Result Processing Workflow

```mermaid
flowchart TD
    PDFUpload["PDF Upload"]
    NodeExpress["Node.js / Express"]
    FileHandling["File handling"]
    PythonProcessor["Python PDF Processor"]
    ExtractData["Extract Result Data"]
    Validate["Validate"]
    MapSubjects["Map Subjects/Semesters"]
    StoreData["Store Structured Data"]
    MongoDB["MongoDB"]
    ResultsAPI["Results API"]
    ReactUI["React Results UI"]

    PDFUpload --> NodeExpress
    NodeExpress --> FileHandling
    FileHandling --> PythonProcessor
    PythonProcessor --> ExtractData
    ExtractData --> Validate
    Validate --> MapSubjects
    MapSubjects --> StoreData
    StoreData --> MongoDB
    MongoDB --> ResultsAPI
    ResultsAPI --> ReactUI
```

## SGPA / CGPA Workflow
Academic calculations are derived from subject credits and grade points. Semesters calculate SGPA individually, while cumulative metrics track across the entire student lifecycle based on the official source of truth in the database.

```mermaid
flowchart TD
    FetchResults["Fetch Subject Results"]
    MapCredits["Map Credits & Grades"]
    CalcGradePoints["Calculate Grade Points"]
    AggSemester["Aggregate Semester Credits"]
    CalcSGPA["Calculate SGPA"]
    AggTotal["Aggregate Cumulative Credits"]
    CalcCGPA["Calculate CGPA"]
    SaveDB["Store in Database"]

    FetchResults --> MapCredits
    MapCredits --> CalcGradePoints
    CalcGradePoints --> AggSemester
    AggSemester --> CalcSGPA
    CalcGradePoints --> AggTotal
    AggTotal --> CalcCGPA
    CalcSGPA --> SaveDB
    CalcCGPA --> SaveDB
```

## Avatar / Profile Workflow
Avatars are managed securely through MongoDB GridFS.

```mermaid
flowchart TD
    ProfileImage["Profile Image Upload"]
    FormData["FormData"]
    Express["Express Route"]
    MulterStorage["Multer Memory Storage"]
    GridFS["MongoDB GridFS"]
    AvatarId["avatarFileId in User Document"]
    AuthEndpoint["Authenticated Avatar Endpoint"]
    ReactAvatar["React Avatar Component"]
    ProfileUI["Profile / Topbar / Dashboard UI"]

    ProfileImage --> FormData
    FormData --> Express
    Express --> MulterStorage
    MulterStorage --> GridFS
    GridFS --> AvatarId
    AvatarId --> AuthEndpoint
    AuthEndpoint --> ReactAvatar
    ReactAvatar --> ProfileUI
```

## Notification Workflow
The system features event-driven notifications to keep students informed of critical academic support opportunities.

```mermaid
flowchart TD
    Event["Event Trigger (e.g. Remedial Class Created/Updated)"]
    NotifService["Notification Service"]
    Recipients["Identify Eligible Recipients"]
    MongoDB["Store in MongoDB"]
    NotifUI["Notification UI Dashboard"]

    Event --> NotifService
    NotifService --> Recipients
    Recipients --> MongoDB
    MongoDB --> NotifUI
```

## Analytics Workflow

```mermaid
flowchart TD
    AcadData["Academic Data"]
    AggServices["Aggregation Services"]
    Metrics["Performance Metrics"]
    Risk["Risk / Backlog / Attendance Analytics"]
    DashCharts["Dashboard Charts"]
    RoleUI["Role-specific UI"]

    AcadData --> AggServices
    AggServices --> Metrics
    Metrics --> Risk
    Risk --> DashCharts
    DashCharts --> RoleUI
```

## Project Structure
```text
project/
├── backend/               # Node.js Express backend and API logic
├── frontend/              # React/Vite JavaScript frontend application
├── result-processor/      # Python utility for PDF parsing and data extraction
├── source-data/           # Original seed and curriculum source files
├── reference/             # Project documentation and specifications
├── .gitignore
└── README.md
```
