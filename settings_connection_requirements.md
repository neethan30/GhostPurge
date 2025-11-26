# **Settings Page: Service Connection Requirements**

**Version:** 1.0
**Date:** 2023-10-27

This document provides the detailed functional and security requirements for configuring each external service connection within the SaaS Management Platform.

---

## **Epic: Service Connectivity & Configuration**

*This epic covers the secure configuration and management of connections to external SaaS applications.*

### **Overarching Security Requirements**

1.  **Encryption at Rest:** All sensitive credentials (Client Secrets, Tokens, Passwords, JSON keys) MUST be encrypted using a strong, industry-standard algorithm (e.g., AES-256-GCM) before being stored in the database.
2.  **Credential Masking:** The API endpoint that fetches connection details (`GET /api/connections/:id`) MUST NOT return decrypted secrets to the frontend. It should return masked placeholders (e.g., `********`).
3.  **Input Sanitization:** All user-provided configuration data must be sanitized on the backend to prevent injection attacks.

---

### **User Story: Configure Microsoft 365 Connection**

**Story:** As a System Admin, I want to configure a connection to Microsoft 365 by providing Entra ID App credentials and defining per-license inactivity rules so that the platform can accurately track usage and potential savings.

**Configuration Fields:**
*   Tenant ID: `string`
*   Client ID: `string`
*   Client Secret: `string` (sensitive)
*   License Inactivity Rules: `array of objects`
    *   License Name: `string` (e.g., "E3", "E5")
    *   Inactive Period: `number` (days)
    *   Monthly Cost: `number` (USD)

**Acceptance Criteria (AC):**
- [ ] The configuration page must display input fields for Tenant ID, Client ID, and Client Secret.
- [ ] The Client Secret field must be a password-type input (masked) with a visibility toggle.
- [ ] The UI must allow adding, editing, and removing license-specific rule rows.
- [ ] Each license rule must have validated inputs for its name, period (positive integer), and cost (positive number).
- [ ] A "Test Connection" button must validate the provided credentials against the Microsoft Graph API.

**Backend API (`PUT /api/connections/:id`):**
*   **Security:** Requires `settings.configureConnections` permission. The `clientSecret` must be encrypted at rest.
*   **Request Body (`settings` object):**
    ```json
    {
      "credentials": {
        "tenantId": "...",
        "clientId": "...",
        "clientSecret": "..."
      },
      "licenses": [
        { "name": "E3", "period": 90, "cost": 36 }
      ]
    }
    ```

---

### **User Story: Configure Google Workspace Connection**

**Story:** As a System Admin, I want to configure a connection to Google Workspace using a Service Account and an impersonated user so that the platform can securely access user activity data.

**Configuration Fields:**
*   Service Account JSON: `string` (sensitive, multi-line)
*   Admin User Email: `string` (for impersonation)
*   Inactive Period: `number` (days)

**Acceptance Criteria (AC):**
- [ ] The configuration page must have a text area for the Service Account JSON key.
- [ ] An input field for the Admin User Email must be present and validated for email format.
- [ ] A "Test Connection" button must validate the credentials and impersonation ability.

**Backend API (`PUT /api/connections/:id`):**
*   **Security:** Requires `settings.configureConnections` permission. The `serviceAccountJSON` must be encrypted at rest.
*   **Request Body (`settings` object):**
    ```json
    {
      "credentials": {
        "serviceAccountJSON": "{...}",
        "adminEmail": "admin@yourdomain.com"
      },
      "period": 90
    }
    ```

---

### **User Story: Configure Slack Connection**

**Story:** As a System Admin, I want to connect to a Slack Workspace using a Bot User OAuth Token so that the platform can monitor user activity.

**Configuration Fields:**
*   Bot User OAuth Token: `string` (sensitive)
*   Inactive Period: `number` (days)

**Acceptance Criteria (AC):**
- [ ] The configuration page must have a single input field for the OAuth token.
- [ ] The token field must be masked by default with a visibility toggle.
- [ ] The token input should expect a value starting with `xoxb-`.

**Backend API (`PUT /api/connections/:id`):**
*   **Security:** Requires `settings.configureConnections` permission. The `token` must be encrypted at rest.
*   **Request Body (`settings` object):**
    ```json
    {
      "credentials": { "token": "xoxb-..." },
      "period": 60
    }
    ```

---

### **User Story: Configure Jira Connection**

**Story:** As a System Admin, I want to connect to a Jira Cloud instance using an email and API token so that the platform can monitor user activity.

**Configuration Fields:**
*   Atlassian Site URL: `string`
*   User Email: `string`
*   API Token: `string` (sensitive)
*   Inactive Period: `number` (days)

**Acceptance Criteria (AC):**
- [ ] The configuration page must have fields for the Site URL, User Email, and API Token.
- [ ] The URL field must be validated to ensure it's a proper URL format.
- [ ] The API Token field must be masked by default with a visibility toggle.

**Backend API (`PUT /api/connections/:id`):**
*   **Security:** Requires `settings.configureConnections` permission. The `token` must be encrypted at rest.
*   **Request Body (`settings` object):**
    ```json
    {
      "credentials": {
        "instanceUrl": "your-company.atlassian.net",
        "adminEmail": "user@your-company.com",
        "token": "..."
      },
      "period": 90
    }
    ```

---

### **User Story: Configure Salesforce Connection**

**Story:** As a System Admin, I want to connect to a Salesforce instance using a Connected App's credentials so that the platform can monitor user activity.

**Configuration Fields:**
*   Instance URL: `string`
*   Client ID (Consumer Key): `string`
*   Client Secret (Consumer Secret): `string` (sensitive)
*   Inactive Period: `number` (days)

**Acceptance Criteria (AC):**
- [ ] The configuration page must have fields for the Instance URL, Client ID, and Client Secret.
- [ ] The Client Secret field must be masked by default with a visibility toggle.

**Backend API (`PUT /api/connections/:id`):**
*   **Security:** Requires `settings.configureConnections` permission. The `clientSecret` must be encrypted at rest.
*   **Request Body (`settings` object):**
    ```json
    {
      "credentials": {
        "instanceUrl": "your-instance.my.salesforce.com",
        "clientId": "...",
        "clientSecret": "..."
      },
      "period": 90
    }
    ```

---

### **User Story: Configure ServiceNow Connection**

**Story:** As a System Admin, I want to connect to a ServiceNow instance using the credentials of an integration user so that the platform can monitor user activity.

**Configuration Fields:**
*   Instance URL: `string`
*   Username: `string`
*   Password: `string` (sensitive)
*   Inactive Period: `number` (days)

**Acceptance Criteria (AC):**
- [ ] The configuration page must have fields for the Instance URL, Username, and Password.
- [ ] The Password field must be masked by default with a visibility toggle.

**Backend API (`PUT /api/connections/:id`):**
*   **Security:** Requires `settings.configureConnections` permission. The `password` must be encrypted at rest.
*   **Request Body (`settings` object):**
    ```json
    {
      "credentials": {
        "instanceUrl": "your-instance.service-now.com",
        "username": "...",
        "password": "..."
      },
      "period": 120
    }
    ```

---

### **User Story: Configure Hubspot Connection**

**Story:** As a System Admin, I want to connect to a Hubspot account using a Private App Access Token so that the platform can monitor user activity.

**Configuration Fields:**
*   Private App Access Token: `string` (sensitive)
*   Inactive Period: `number` (days)

**Acceptance Criteria (AC):**
- [ ] The configuration page must have a single input field for the Access Token.
- [ ] The token field must be masked by default with a visibility toggle.

**Backend API (`PUT /api/connections/:id`):**
*   **Security:** Requires `settings.configureConnections` permission. The `token` must be encrypted at rest.
*   **Request Body (`settings` object):**
    ```json
    {
      "credentials": { "token": "..." },
      "period": 120
    }
    ```
