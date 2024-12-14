# 📘 API Documentation

Welcome to the API documentation for **LogoExecutive**. This guide provides a clear overview of all available endpoints to help developers efficiently integrate with our services.

---

## 🔗 Table of Contents
1. [Admin Operations](#-admin-operations)
2. [Authentication](#-authentication)
3. [Business Services](#-business-services)
4. [Operator Management](#-operator-management)
5. [Data Pagination](#-data-pagination)
6. [Public Interfaces](#-public-interfaces)
7. [User Account Management](#-user-account-management)

---

## 🔑 Admin Operations

Endpoints restricted to administrators for managing the application.

| **Action**                | **Method** | **Endpoint**         | **Description**                                              |
|---------------------------|------------|----------------------|--------------------------------------------------------------|
| Add New Administrator     | `PUT`      | `/api/admin/add`     | Grants admin privileges to an existing user account.         |
| Upload Company Logo       | `POST`     | `/api/admin/upload`  | Adds a new company logo to the system.                      |
| Retrieve Uploaded Images  | `GET`      | `/api/admin/images`  | Fetches all uploaded logo images.                           |
| Update Existing Logo      | `PUT`      | `/api/admin/reupload`| Replaces an existing company logo with a new image.          |

> **Authentication Required:** Admin access

---

## 🔐 Authentication

Endpoints for user authentication and session management.

| **Action**                | **Method** | **Endpoint**                  | **Description**                                            |
|---------------------------|------------|-------------------------------|------------------------------------------------------------|
| User Login                | `POST`     | `/api/auth/signin`            | Authenticates a user and starts a session.                 |
| New User Registration     | `POST`     | `/api/auth/signup`            | Creates a new user account.                                |
| User Logout               | `GET`      | `/api/auth/signout`           | Terminates the current user session.                       |
| Token Verification        | `GET`      | `/api/auth/verify`            | Validates the user session token.                          |
| Initiate Password Recovery| `POST`     | `/api/auth/forgot-password`   | Starts the password recovery process.                      |
| Password Reset Page       | `GET`      | `/api/auth/reset-password`    | Serves the interface for entering a new password.          |
| Update Password           | `PATCH`    | `/api/auth/reset-password`    | Updates the user's password securely.                      |

---

## 🏢 Business Services

Endpoints for accessing public business-related data.

## Business Services

Public endpoints for accessing company logo information.

| **Action**                    | **Endpoint**            | **Method** | **Description**                                                                                         | **Parameters**                                                                                                                                              |
|-------------------------------|-------------------------|------------|---------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Fetch company logo            | `/api/business/logo`    | `GET`      | Fetches the logo for a specific company.                                                                | - **domain** (`string`, required): Company or domain name. <br> - **API_KEY** (`string`, required): The API Key generated from the dashboard.             |
| Search matching company logos | `/api/business/search`  | `GET`      | Fetches a list of logos of companies that match the initial characters of the provided `domainKey`.      | - **domainKey** (`string`, required): The initial character(s) that the logo URLs should begin with. <br> - **API_KEY** (`string`, required): The API Key generated from the dashboard. |

---

## 👥 Operator Management

Endpoints specific to managing operator accounts.

| **Action**                | **Method** | **Endpoint**               | **Description**                                             |
|---------------------------|------------|----------------------------|-------------------------------------------------------------|
| Revert Operator to Customer| `PUT`     | `/api/operator/revert`     | Downgrades an operator account to standard customer status. |

> **Authentication Required:** Operator access

---

## 📄 Data Pagination

Endpoints for efficient data retrieval in paginated chunks.

| **Action**                | **Method** | **Endpoint**               | **Description**                                             |
|---------------------------|------------|----------------------------|-------------------------------------------------------------|
| Paginated Operator Data   | `GET`      | `/api/common/pagination`   | Retrieves operator data in paginated format.                |

> **Authentication Required:** Operator access

---

## 🌐 Public Interfaces

Publicly accessible endpoints for general use.

| **Action**                | **Method** | **Endpoint**               | **Description**                                             |
|---------------------------|------------|----------------------------|-------------------------------------------------------------|
| Submit Contact Form       | `POST`     | `/api/public/contact-us`   | Processes and submits a user's contact form data.           |
| Retrieve Demo Logo        | `GET`      | `/api/public/logo`         | Provides a sample logo for demonstration purposes.           |
| Demo Logo Search          | `GET`      | `/api/public/search`       | Demonstrates logo search functionality with sample data.     |

---

## 🧑‍💻 User Account Management

Endpoints for users to manage their account and API access.

| **Action**                | **Method** | **Endpoint**                | **Description**                                            |
|---------------------------|------------|-----------------------------|------------------------------------------------------------|
| Fetch User Information    | `GET`      | `/api/user/data`            | Retrieves complete user profile data.                      |
| Update User Password      | `POST`     | `/api/user/update-password` | Allows a user to change their account password.            |
| Modify User Profile       | `PATCH`    | `/api/user/update-profile`  | Updates specific user profile details.                     |
| Account Deletion          | `DELETE`   | `/api/user/delete`          | Permanently deletes the user account.                      |
| Create New API Key        | `POST`     | `/api/user/generate`        | Generates a new API key for the user.                      |
| Revoke API Key            | `DELETE`   | `/api/user/destroy`         | Invalidates and removes an API key.                        |

> **Authentication Required:** User login

---