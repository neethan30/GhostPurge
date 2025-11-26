# **Dashboard & Reports: Feature Requirements Document**

**Version:** 1.0
**Date:** 2023-10-27

This document outlines the user stories, acceptance criteria, and API specifications for the data visualization and reporting features of the SaaS Management Platform.

---

## **Epic 1: Dashboard & Insights**

*This epic covers the main dashboard, which serves as a high-level overview of user activity and potential cost savings. Performance is critical for this page to provide a good user experience.*

### **User Story 1.1: View Key Performance Indicators (KPIs)**

**Story:** As an Admin, I want to see a high-level summary of key user metrics upon logging in so that I can quickly assess the current state of our SaaS usage.

**Acceptance Criteria (AC):**
- [ ] The dashboard must display three primary stat cards: Total Users, Inactive Users, and Estimated Monthly Savings.
- [ ] Each card must be clearly labeled, display a large numerical value, and have an associated icon.
- [ ] The "Inactive Users" card should specify the inactivity period it's based on (e.g., "> 90 days").
- [ ] A loading state (e.g., skeleton loaders) should be displayed for the cards while the data is being fetched.
- [ ] **Performance:** The API call for these stats must be highly optimized and return in under 500ms for a typical dataset.

**Backend API Requirements:**
*   **Endpoint:** `GET /api/dashboard/stats`
*   **Description:** Retrieves the three main KPI values for the dashboard header.
*   **Security & Compliance (SOC 2 - CC6.1, CC6.6):**
    *   **Authentication:** Required.
    *   **Authorization:** Requires `dashboard.view` permission.
    *   **Data Segregation:** The query MUST be strictly scoped to the authenticated user's organization/tenant ID.
*   **Success Response (200 OK):**
    ```json
    {
      "totalUserCount": 250,
      "inactiveUserCount": 75,
      "estimatedMonthlySavings": 3750,
      "inactivityPeriod": 90
    }
    ```

---

### **User Story 1.2: Visualize User Activity**

**Story:** As an Admin, I want to see charts that break down user activity by service and overall status so that I can visually identify trends and problem areas.

**Acceptance Criteria (AC):**
- [ ] The dashboard must contain two charts:
    1.  A stacked bar chart showing "User Activity by Service" (Active vs. Inactive counts for each connected platform).
    2.  A pie/donut chart showing the "User Status Distribution" (proportion of Active, Inactive, and Pending Deactivation users).
- [ ] Charts must be responsive and render correctly on different screen sizes.
- [ ] Charts must have clear legends and interactive tooltips that display the exact numbers on hover.
- [ ] A loading state should be displayed for the charts while data is being fetched.
- [ ] **Performance:** The two charts should be powered by a single, efficient API call to minimize network requests. The backend must perform all aggregations.

**Backend API Requirements:**
*   **Endpoint:** `GET /api/dashboard/charts`
*   **Description:** Retrieves aggregated and formatted data for all dashboard charts.
*   **Security & Compliance (SOC 2 - CC6.1, CC6.6):**
    *   **Authentication:** Required.
    *   **Authorization:** Requires `dashboard.view` permission.
    *   **Data Segregation:** All queries MUST be scoped to the authenticated user's tenant.
*   **Success Response (200 OK):**
    ```json
    {
      "activityByService": [
        { "name": "Microsoft 365", "active": 40, "inactive": 15 },
        { "name": "Google Workspace", "active": 35, "inactive": 10 },
        { "name": "Slack", "active": 50, "inactive": 20 }
      ],
      "statusDistribution": [
        { "name": "Active", "value": 175 },
        { "name": "Inactive", "value": 68 },
        { "name": "Pending Deactivation", "value": 7 }
      ]
    }
    ```

---

### **User Story 1.3: Generate AI-Powered Insights**

**Story:** As an Admin, I want to generate an AI-powered summary of my dashboard data so that I can get actionable recommendations for cost savings and security improvements.

**Acceptance Criteria (AC):**
- [ ] A dedicated "AI-Powered Insights" section must be present on the dashboard.
- [ ] A "Generate Insights" button must be available to trigger the analysis.
- [ ] While the AI is processing, the button must enter a disabled/loading state to prevent multiple clicks, and a clear loading indicator should be visible.
- [ ] The generated insights must be displayed in a clean, readable format (e.g., formatted HTML).
- [ ] If the AI call fails, a user-friendly error message must be displayed.
- [ ] **Security:** The data sent to the AI model must be minimal and aggregated (only counts and savings, no PII). The prompt must be constructed on the backend to prevent prompt injection from the client-side.

**Backend API Requirements:**
*   **Endpoint:** `POST /api/dashboard/generate-insights`
*   **Description:** Takes the dashboard stats, constructs a secure prompt, calls the AI model, and returns the formatted response.
*   **Security & Compliance (SOC 2 - CC6.1, CC6.7):**
    *   **Authentication:** Required.
    *   **Authorization:** Requires `dashboard.generateInsights` permission.
    *   **Data Privacy:** The backend must ensure no Personally Identifiable Information (PII) is included in the prompt sent to the external AI service.
    *   **Throttling:** This endpoint should be rate-limited to prevent abuse.
*   **Request Body:** None (The backend should re-fetch the stats to ensure data integrity).
*   **Success Response (200 OK):**
    ```json
    {
      "insightsHtml": "<h4>Summary...</h4><p>...</p>"
    }
    ```
*   **Error Response (503 Service Unavailable):** If the AI service is unavailable or fails.

---

## **Epic 2: Reporting & Exports ("Reports" Page)**

*This epic covers the ability to export data for offline analysis, auditing, and sharing with stakeholders.*

### **User Story 2.1: Export User Reports**

**Story:** As a Compliance Officer or Admin, I want to export reports of user data in CSV format so that I can perform offline analysis, meet audit requirements, and share data with stakeholders.

**Acceptance Criteria (AC):**
- [ ] The "Reports" page must offer distinct options to export:
    1.  Inactive Users Report
    2.  All Users Audit Log
- [ ] Clicking an "Export CSV" button should initiate the file download.
- [ ] The downloaded file must be correctly formatted as a CSV with a proper header row.
- [ ] **Performance:** For large organizations, report generation can be time-consuming. The API must handle this asynchronously. The initial API call should return a `202 Accepted` response, and the frontend should either poll a status endpoint or use a websocket to notify the user when the file is ready for download. This prevents HTTP timeouts.

**Backend API Requirements:**
*   **Endpoint 1 (Initiate):** `POST /api/reports/generate`
    *   **Description:** Initiates the generation of a report.
    *   **Security & Compliance (SOC 2 - CC7.1, CC6.1):**
        *   **Authentication:** Required.
        *   **Authorization:** Requires `reports.export` permission.
    *   **Request Body:** `{ "reportType": "INACTIVE_USERS" | "ALL_USERS" }`
    *   **Success Response (202 Accepted):**
        ```json
        {
          "jobId": "report-job-67890",
          "status": "pending",
          "message": "Your report is being generated and will be available shortly."
        }
        ```
*   **Endpoint 2 (Get Status/Download Link):** `GET /api/reports/status/:jobId`
    *   **Description:** Polls for the status of a report generation job.
    *   **Security:** Requires `reports.export` permission.
    *   **Success Response (200 OK):**
        ```json
        // While pending
        { "status": "processing" }

        // When complete
        { "status": "complete", "downloadUrl": "/api/reports/download/report-file-abcde.csv" }
        ```
*   **Endpoint 3 (Download):** `GET /api/reports/download/:fileName`
    *   **Description:** Securely serves the generated report file.
    *   **Security:** Requires a valid session/token. The endpoint must verify the user has permission to download this specific file.
    *   **Success Response (200 OK):** The raw CSV data with `Content-Type: text/csv` and `Content-Disposition: attachment; filename="..."` headers.

---

### **User Story 2.2: Export Savings Report**

**Story:** As a Finance or IT Manager, I want to export a summary of potential savings in PDF format so that I can easily share a professional-looking document in business meetings.

**Acceptance Criteria (AC):**
- [ ] The "Reports" page must have an option for "Potential Savings Report".
- [ ] Clicking "Export PDF" should generate and download a clean, well-formatted PDF document.
- [ ] The PDF should include the key stats, charts from the dashboard, and a summary of potential savings by service/license.
- [ ] The generation process should follow the same asynchronous pattern as the CSV reports to ensure a good user experience.

**Backend API Requirements:**
*   This will follow the same three-endpoint asynchronous pattern as User Story 2.1.
*   **Endpoint (Initiate):** `POST /api/reports/generate` with `reportType: "SAVINGS_PDF"`.
*   **Backend Logic:** The backend will be responsible for generating the PDF document, potentially using a library like Puppeteer or PDFKit to render the dashboard data into a structured report.
*   **Endpoint (Download):** The download endpoint will serve the file with `Content-Type: application/pdf` and the appropriate `Content-Disposition` header.
