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

| **Method** | **Endpoint**         | **Action**                                              |
|------------|----------------------|---------------------------------------------------------|
| `PUT`      | `/api/admin/add`     | Grants admin privileges to an existing user account.    |
| `POST`     | `/api/admin/upload`  | Adds a new company logo to the system.                  |
| `GET`      | `/api/admin/images`  | Fetches all uploaded logo images.                       |
| `PUT`      | `/api/admin/reupload`| Replaces an existing company logo with a new image.     |

> **Authentication Required:** Admin access

---

## 🔐 Authentication

Endpoints for user authentication and session management.

| **Method** | **Endpoint**                  | **Action**                                            |
|------------|-------------------------------|-------------------------------------------------------|
| `POST`     | `/api/auth/signin`            | Authenticates a user and starts a session.            |
| `POST`     | `/api/auth/signup`            | Creates a new user account.                           |
| `GET`      | `/api/auth/signout`           | Terminates the current user session.                  |
| `GET`      | `/api/auth/verify`            | Validates the user session token.                     |
| `POST`     | `/api/auth/forgot-password`   | Starts the password recovery process.                 |
| `GET`      | `/api/auth/reset-password`    | Serves the interface for entering a new password.     |
| `PATCH`    | `/api/auth/reset-password`    | Updates the user's password securely.                 |

---

## 🏢 Business Services

Endpoints for accessing public business-related data.

| **Method** | **Endpoint**            | **Action**                                                                                         | **Parameters**                                                                                                                                              |
|------------|-------------------------|---------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GET`      | `/api/business/logo`    | Fetches the logo for a specific company.                                                           | - **domain** (`string`, required): Company or domain name. <br> - **API_KEY** (`string`, required): The API Key generated from the dashboard.             |
| `GET`      | `/api/business/search`  | Fetches a list of logos of companies that match the initial characters of the provided `domainKey`. | - **domainKey** (`string`, required): The initial character(s) that the logo URLs should begin with. <br> - **API_KEY** (`string`, required): The API Key generated from the dashboard. |

---

## 👥 Operator Management

Endpoints specific to managing operator accounts.

| **Method** | **Endpoint**               | **Action**                                             |
|------------|----------------------------|--------------------------------------------------------|
| `PUT`      | `/api/operator/revert`     | Downgrades an operator account to standard customer status. |

> **Authentication Required:** Operator access

---

## 📄 Data Pagination

Endpoints for efficient data retrieval in paginated chunks.

| **Method** | **Endpoint**               | **Action**                                             |
|------------|----------------------------|--------------------------------------------------------|
| `GET`      | `/api/common/pagination`   | Retrieves operator data in paginated format.           |

> **Authentication Required:** Operator access

---

## 🌐 Public Interfaces

Publicly accessible endpoints for general use.

| **Method** | **Endpoint**               | **Action**                                             |
|------------|----------------------------|--------------------------------------------------------|
| `POST`     | `/api/public/contact-us`   | Processes and submits a user's contact form data.      |
| `GET`      | `/api/public/logo`         | Provides a sample logo for demonstration purposes.     |
| `GET`      | `/api/public/search`       | Demonstrates logo search functionality with sample data. |

---

## 🧑‍💻 User Account Management

Endpoints for users to manage their account and API access.

| **Method** | **Endpoint**                | **Action**                                            |
|------------|-----------------------------|-------------------------------------------------------|
| `GET`      | `/api/user/`            | Retrieves complete user profile data.                 |
| `PUT`     | `/api/user/` | Allows a user to change their account password.       |
| `PATCH`    | `/api/user/`  | Updates specific user profile details.                |
| `DELETE`   | `/api/user/`          | Permanently deletes the user account.                 |
| `POST`     | `/api/user/key`        | Generates a new API key for the user.                 |
| `DELETE`   | `/api/user/key`         | Invalidates and removes an API key.                   |
| `POST`   | `/api/user/request`         | Raise a request.                   |

> **Authentication Required:** User login

---