# **SaaS Management Platform: End-to-End Architecture**

**Version:** 1.0
**Audience:** Senior Development Lead
**Project Goal:** To build a secure, scalable, and maintainable platform for managing SaaS user licenses, based on the provided requirements documents.

## 1. Architectural Philosophy & Overview

The system will be architected as a modern **Single Page Application (SPA)** communicating with a backend **RESTful API**. This separation of concerns is crucial for maintainability, scalability, and allowing frontend and backend development to proceed in parallel.

Our core principles are:
*   **Security by Design:** Every component is designed with SOC 2 compliance in mind, from authentication and authorization to data handling and auditing.
*   **Performance at Scale:** The architecture must handle a large number of users and connections without degradation, utilizing asynchronous processing for long-running tasks.
*   **Maintainability & Extensibility:** The system is broken down into logical, loosely coupled components, making it easy to update and add new features (like connecting to new SaaS providers).
*   **Open-Source First:** The technology stack is based on proven, well-supported, and high-performance open-source technologies.

### 1.1. High-Level Component Diagram

```
                 +-----------------------+
                 |    User's Browser     |
                 |  (React SPA Client)   |
                 +-----------+-----------+
                             | (HTTPS / REST API Calls)
                             |
+----------------------------V-----------------------------+
|                     Backend Services                      |
|                                                           |
|  +-----------------+   +-------------------------------+  |
|  |   Web API Server  |   |    Asynchronous Worker(s)     |  |
|  |  (ASP.NET Core)   |<--+      (Background Jobs)      |  |
|  +--------+--------+-+  +---------------+---------------+  |
|           |          |                  |                  |
| (DB Calls)|          | (API Calls)      | (Read/Write Jobs)|
|           |  +-------+------------------+-------+          |
|           |  |                                 |          |
| +---------V--V--+  +-----------------+  +-------V-------+  |
| |  PostgreSQL   |  |   External SaaS |  |   RabbitMQ    |  |
| |   Database    |  |      APIs       |  | (Message Queue) |  |
| +---------------+  +-----------------+  +---------------+  |
+-----------------------------------------------------------+
```

## 2. Recommended Technology Stack

| Component                  | Technology                                     | Justification                                                                                                                              |
| -------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend (Client)**      | React 20+ with TypeScript & TailwindCSS        | A modern, component-based framework for building interactive UIs. TypeScript adds strong typing, which is familiar to C# developers and reduces bugs. |
| **Backend (Web API)**      | **ASP.NET Core 8+** (using C#)                 | High-performance, cross-platform, and open-source. Its mature ecosystem, strong typing, and design patterns will be very familiar to a C# lead. |
| **Database**               | **PostgreSQL 16+**                             | A powerful, reliable, and open-source relational database that excels at complex queries and has excellent support in the .NET ecosystem.    |
| **Database Access (ORM)**  | **Entity Framework Core 8+**                   | The standard Object-Relational Mapper for .NET. It simplifies database interactions, migrations, and is highly performant.                       |
| **Asynchronous Tasks**     | **RabbitMQ** (Message Broker) & **Hangfire** (Job Scheduler) | RabbitMQ is a robust message queue for decoupling long-running tasks. Hangfire provides a simple, powerful way to process these jobs in the background in .NET. |
| **Authentication**         | **ASP.NET Core Identity** & **JWT Bearer Tokens** | The standard for secure, token-based authentication in .NET. Provides a robust framework for managing users and roles. |
| **Containerization**       | **Docker** & **Docker Compose**                  | For creating consistent development, testing, and production environments. Essential for modern DevOps practices.                        |

---

## 3. Detailed Architecture Breakdown

### 3.1. Frontend (React SPA)

The client-side is a self-contained Single Page Application. It is responsible for rendering the UI and communicating with the backend API.

*   **Structure:** The application will be structured by feature (`/components/Dashboard`, `/components/Admin`, etc.), as is currently the case.
*   **State Management:** For an application of this complexity, React's built-in hooks (`useState`, `useContext`, `useReducer`) are sufficient. There is no initial need for a more complex library like Redux. A global context can be used to store application-wide state like the logged-in user's information and permissions.
*   **API Communication:** A dedicated service layer (e.g., `/services/apiClient.ts`) will be created to handle all HTTP requests to the backend. This service will be responsible for attaching the JWT authentication token to every request header.
*   **Security:** The client must never store sensitive data in `localStorage`. The authentication token (JWT) should be stored in a secure, `HttpOnly` cookie managed by the backend to prevent XSS attacks.

### 3.2. Backend (ASP.NET Core Web API)

The backend is the core of the system, responsible for all business logic, data processing, and security. We will adopt a **Clean Architecture** (or Onion Architecture) approach, which is a standard in the C# world.

*   **Project Structure:**
    *   `AppName.WebAPI`: The entry point. Contains Controllers, middleware, and configuration.
    *   `AppName.Application`: Contains business logic, services, interfaces, and DTOs (Data Transfer Objects).
    *   `AppName.Infrastructure`: Contains implementations for external concerns like database access (Repositories), email services, and external API clients.
    *   `AppName.Domain`: Contains core domain entities and value objects.

*   **API Controllers (`WebAPI` project):**
    *   These are the public-facing entry points of our API (e.g., `UsersController`, `DashboardController`).
    *   Their only job is to handle the HTTP request/response, validate input (DTOs), and call the appropriate application service.
    *   They will be heavily decorated with `[Authorize]` attributes to enforce security.

*   **Application Services (`Application` project):**
    *   This is where the business logic lives (e.g., `IUserService`, `IConnectionService`).
    *   Services orchestrate calls to repositories and other services to fulfill a use case. For example, `IUserService.DeactivateUsersAsync()` would fetch users via the repository and then enqueue a job for deactivation.
    *   This layer is completely independent of ASP.NET Core and the database technology.

*   **Repositories (`Infrastructure` project):**
    *   These classes are responsible for all database operations, using **Entity Framework Core**.
    *   They implement interfaces defined in the `Application` layer (e.g., `IUserRepository`).
    *   This pattern isolates the data access logic, making it easy to mock for testing or even swap out the database technology in the future.

### 3.3. Security: Authentication & Authorization (A Deep Dive)

This is the most critical part for SOC 2 compliance.

1.  **Authentication Flow (Login):**
    a. The user submits their email and password to a `POST /api/auth/login` endpoint.
    b. The `AuthenticationController` calls a service that uses **ASP.NET Core Identity** to validate the credentials against the hashed password in the database.
    c. If valid, the service generates a **JSON Web Token (JWT)**. This token will contain claims like `userId`, `email`, and a list of the user's permissions (e.g., `["users.view", "settings.edit"]`).
    d. The server sends this JWT back to the client inside a secure, `HttpOnly` cookie.

2.  **Authorization Flow (Subsequent Requests):**
    a. For every subsequent API call, the browser automatically sends the cookie containing the JWT.
    b. A **JWT Bearer authentication middleware** in ASP.NET Core intercepts every request.
    c. It validates the JWT's signature, expiration, and issuer. If valid, it populates the user's identity (`HttpContext.User`) with the claims from the token.
    d. **Authorization Middleware** then checks the `[Authorize]` attribute on the controller or endpoint. For example, the `[Authorize(Policy = "CanDeactivateUsers")]` attribute will check if the user's identity contains the `users.deactivate` permission claim. If not, the request is rejected with a `403 Forbidden` response.

3.  **Credential Encryption:**
    *   As per the requirements, all sensitive connection secrets (`clientSecret`, `token`, etc.) stored in the database **must be encrypted at rest**.
    *   We will use ASP.NET Core's built-in **Data Protection APIs**. This provides a simple but highly secure way to encrypt and decrypt data using a managed key ring.

### 3.4. Asynchronous Processing (Background Jobs)

For long-running, resource-intensive tasks like report generation and bulk user deactivation, we cannot block the API.

1.  **Flow:**
    a. The API controller receives the request (e.g., `POST /api/reports/generate`).
    b. The controller calls an application service which, instead of doing the work, simply publishes a message to a **RabbitMQ** queue. The message contains the job details (e.g., `{ "reportType": "INACTIVE_USERS", "tenantId": "..." }`).
    c. The controller immediately returns a `202 Accepted` response to the client.

2.  **The Worker:**
    a. A separate, long-running process (**ASP.NET Core Worker Service**) will be created.
    b. This worker will use the **Hangfire** library to listen to the RabbitMQ queue.
    c. When a new message appears, Hangfire picks it up and executes the corresponding job (e.g., `IReportGenerationService.GenerateInactiveUsersReportAsync(jobDetails)`).
    d. This job can safely take minutes to complete without affecting the performance or availability of the main Web API.

### 3.5. Data Models (PostgreSQL Schema)

Based on the requirements, here are the core table structures.

```sql
-- For Admin Panel Users and RBAC
CREATE TABLE "SecurityRoles" (
    "Id" TEXT PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "IsDefault" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "RolePermissions" (
    "RoleId" TEXT REFERENCES "SecurityRoles"("Id") ON DELETE CASCADE,
    "Permission" TEXT NOT NULL,
    PRIMARY KEY ("RoleId", "Permission")
);

CREATE TABLE "AdminUsers" (
    "Id" TEXT PRIMARY KEY,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Email" TEXT UNIQUE NOT NULL,
    "PasswordHash" TEXT NOT NULL, -- Hashed by ASP.NET Core Identity
    "Timezone" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "RoleId" TEXT REFERENCES "SecurityRoles"("Id")
);

-- For Service Connections
CREATE TABLE "Connections" (
    "Id" TEXT PRIMARY KEY,
    "Name" TEXT NOT NULL,
    "Service" TEXT NOT NULL,
    "TenantId" TEXT NOT NULL -- For data segregation
);

CREATE TABLE "ConnectionSettings" (
    "ConnectionId" TEXT PRIMARY KEY REFERENCES "Connections"("Id") ON DELETE CASCADE,
    "SettingsJson" TEXT NOT NULL, -- Stores non-sensitive settings like inactivity period
    "EncryptedCredentialsJson" TEXT -- Stores ENCRYPTED secrets
);

-- For aggregated user data from SaaS apps
CREATE TABLE "SaaSUsers" (
    "Id" TEXT PRIMARY KEY,
    "ConnectionId" TEXT REFERENCES "Connections"("Id"),
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "LastActive" TIMESTAMP WITH TIME ZONE,
    "Status" TEXT NOT NULL,
    -- Add indexes for performance on filterable columns
    INDEX ON "SaaSUsers" ("ConnectionId", "Status", "LastActive")
);

-- For Auditing
CREATE TABLE "AuditLogs" (
    "Id" BIGSERIAL PRIMARY KEY,
    "Timestamp" TIMESTAMP WITH TIME ZONE NOT NULL,
    "AdminUserId" TEXT REFERENCES "AdminUsers"("Id"),
    "Action" TEXT NOT NULL,
    "Details" TEXT
);

```

## 4. Deployment & Operations

*   **Containerization:** Both the `AppName.WebAPI` and the `AppName.Worker` will have their own `Dockerfile`. The React SPA will be built and its static assets can be served by the ASP.NET Core app or a separate Nginx container.
*   **Local Development:** A `docker-compose.yml` file will define all services (API, Worker, PostgreSQL, RabbitMQ) for a one-command local setup (`docker-compose up`).
*   **CI/CD (Continuous Integration/Continuous Deployment):**
    *   A simple CI/CD pipeline using **GitHub Actions** can be set up.
    *   On every push to the `main` branch, the pipeline will:
        1.  Build the .NET projects and the React app.
        2.  Run unit and integration tests.
        3.  Build Docker images.
        4.  Push images to a container registry (e.g., Docker Hub, Azure Container Registry).
        5.  Deploy the new images to the production environment.
*   **Production Environment:** For a simple, scalable setup, consider deploying the containers to a managed service like **Azure App Service for Containers** or **AWS Elastic Beanstalk**. For more complex needs, a **Kubernetes** cluster would be the next step.
*   **Logging & Monitoring:** Integrate a logging framework like **Serilog** into the ASP.NET Core applications to write structured logs. These can be sent to a centralized logging platform like **Seq**, **Datadog**, or an **ELK stack** for monitoring and alerting.

## 5. Implementation Roadmap for the Lead Developer

1.  **Setup the Solution:** Create the .NET solution with the Clean Architecture projects (`WebAPI`, `Application`, etc.).
2.  **Database & Migrations:** Define the entities in C# and use EF Core Migrations to generate the initial database schema.
3.  **Implement Authentication:** Configure ASP.NET Core Identity and JWT Bearer authentication. Create the `login`, `register` (for first admin), and `me` endpoints.
4.  **Build Admin RBAC:** Implement the CRUD endpoints for `SecurityRoles` and `RolePermissions`.
5.  **Build Admin User Management:** Implement the full CRUD functionality for `AdminUsers`.
6.  **Build Core Application Logic:** Implement the CRUD for `Connections` and `ConnectionSettings`, ensuring the encryption logic for credentials is solid.
7.  **Start Frontend Development:** With the auth and core APIs in place, the frontend team can begin building the login page and the main application layout.
8.  **Implement Asynchronous Workers:** Set up Hangfire and RabbitMQ and build the first background job (e.g., bulk deactivation).
9.  **Flesh out Remaining Features:** Build out the Dashboard, Reports, and external SaaS API integration logic.

This architecture provides a robust, secure, and scalable foundation that directly addresses the specified requirements while leveraging familiar patterns and technologies for a C#/C++ developer lead.