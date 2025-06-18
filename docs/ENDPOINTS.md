## API Endpoints Documentation

<details>
<summary>AUTH</summary>
POST /auth/signup – Register a new user.
POST /auth/signin – Log in and start a session.
POST /auth/signout – Terminate the session.
GET /auth/verify – Validate the user session token.
POST /auth/password/forgot – Initiate password recovery.(also use it for resending email)
POST /auth/password/reset – Reset user password.
GET /auth/validate-session - Validate user session cookie

| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/auth/signup` | POST | False | Register a new user |

> <details>
> <summary>Request body</summary>
>
> ```json
> {
>   "name": "Arjun Sharma",
>   "email": "arjunsharma@gmail.com",
>   "password": "securePassword@123",
>   "confirmPassword": "securePassword@123"
> }
> ```
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode": 200
> }
> ```
> 
> **Response:** `200 OK` - User registered successfully</br>
> **Response:** `400 Bad Request` - Invalid input data</br>
> **Response:** `409 Conflict` - Email already exists
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/auth/signin` | POST | False | Log in and start a session |

> <details>
> <summary>Request body</summary>
>
> ```json
> {
>   "email": "arjunsharma@gmail.com",
>   "password": "securePassword@123"
> }
> ```
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode": 200
> }
> ```
> 
> **Response:** `200 OK` - Login successful</br>
> **Response:** `401 Unauthorized` - Invalid credentials</br>
> **Response:** `400 Bad Request` - Invalid input data
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/auth/signout` | POST | True | Terminate the session |

> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "message": "Logged out successfully",
>   "success": true
> }
> ```
> 
> **Response:** `200 OK` - Logout successful</br>
> **Response:** `401 Unauthorized` - Not authenticated
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/auth/verify/:token?` | GET | False | Validate the user session token or verify email |

> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode" : 200
> }
> ```
> 
> **Response:** `200 OK` - Token valid or email verified</br>
> **Response:** `400 Bad Request` - Invalid token</br>
> **Response:** `401 Unauthorized` - Invalid session
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/auth/password/forgot` | POST | False | Initiate password recovery |

> <details>
> <summary>Request body</summary>
>
> ```json
> {
>   "email": "user@example.com"
> }
> ```
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode": 200
> }
> ```
> 
> **Response:** `200 OK` - Password reset email sent</br>
> **Response:** `400 Bad Request` - Invalid email</br>
> **Response:** `404 Not Found` - Email not found
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/auth/password/forgot/:token?` | GET | False | Get password reset session |

> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode": 200
> }
> ```
> 
> **Response:** `200 OK` - Token valid</br>
> **Response:** `400 Bad Request` - Invalid token</br>
> **Response:** `401 Unauthorized` - Token expired
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/auth/password/reset` | PATCH | False | Reset user password |

> <details>
> <summary>Request body</summary>
>
> ```json
> {
>   "token": "resetToken123",
>   "newPassword": "newSecurePassword@123",
>   "confirmPassword" : "newSecurePassword@123"
> }
> ```
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode": 200
> }
> ```
> 
> **Response:** `200 OK` - Password reset successful</br>
> **Response:** `400 Bad Request` - Invalid input data</br>
> **Response:** `401 Unauthorized` - Invalid or expired token
> </details>

</details>


<details>
<summary>USER</summary>

| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/users/me` | GET | True | Retrieve authenticated user profile |

> <details>
> <summary>Response body</summary>
>
> ```json
> {
>    "statusCode": 200,
>    "data": {
>        "name": "ahrak nivah",
>        "email": "enyyvish@gmail.com",
>        "role": "CUSTOMER",
>        "is_verified": true,
>        "subscription_id": "6826d68a0fbea0d79998ef43",
>        "userId": "6826d68a0fbea0d79998ef45",
>        "created_at": "2025-05-16T06:09:14.000Z",
>        "is_deleted": false,
>        "updated_at": "2025-05-16T06:09:14.513Z",
>        "subscription": {
>            "_id": "6826d68a0fbea0d79998ef43",
>            "type": "HOBBY",
>            "key_limit": 2,
>            "usage_limit": 500,
>            "usage_count": 0,
>            "is_active": true,
>            "updated_at": "2025-05-16T06:09:14.288Z"
>        },
>        "keys": []
>    }
>}
> ```
> 
> **Response:** `200 OK` - User profile retrieved successfully</br>
> **Response:** `401 Unauthorized` - Not authenticated</br>
> **Response:** `404 Not Found` - User not found
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/users/me` | PATCH | True | Update user profile details |

> <details>
> <summary>Request body</summary>
>
> ```json
>  {
>    "name": "local lamma"
>  }
>
> ```
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode" : 200
> }
> ```
> 
> **Response:** `200 OK` - Profile updated successfully</br>
> **Response:** `400 Bad Request` - Invalid input data</br>
> **Response:** `401 Unauthorized` - Not authenticated
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/users/me` | DELETE | True | Permanently delete the user account |

> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode": 200
> }
> ```
> 
> **Response:** `200 OK` - Account deleted successfully</br>
> **Response:** `401 Unauthorized` - Not authenticated</br>
> **Response:** `404 Not Found` - User not found
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/users/me/api-key` | POST | True | Generate a new API key |

> <details>
> <summary>Request body</summary>
>
> ```json
> {
>   "key_description": "sample key"
> }
> ```
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>    "statusCode": 200,
>    "data": {
>        "key_description": "sample key",
>        "subscription_id": "6826d68a0fbea0d79998ef43",
>        "_id": "684d52e03469f433197aa44a",
>        "api_key": "10E38C50555040A2A0220B6DB0AFDAE4",
>        "updated_at": "2025-06-14T10:45:52.395Z",
>        "__v": 0
>    }
> }
> ```
> 
> **Response:** `200 OK` - API key generated successfully</br>
> **Response:** `400 Bad Request` - Invalid input data</br>
> **Response:** `401 Unauthorized` - Not authenticated</br>
> **Response:** `403 Forbidden` - Key limit reached
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/users/me/api-key/:keyId` | DELETE | True | Revoke an API key |

> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode":200
> }
> ```
> 
> **Response:** `200 OK` - API key revoked successfully</br>
> **Response:** `401 Unauthorized` - Not authenticated</br>
> **Response:** `404 Not Found` - API key not found
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/users/me/password` | PUT | True | Update user password |

> <details>
> <summary>Request body</summary>
>
> ```json
> {
>   "currPassword": "oldPassword123",
>   "newPassword": "newPassword123"
> }
> ```
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode": 200
> }
> ```
> 
> **Response:** `200 OK` - Password updated successfully</br>
> **Response:** `400 Bad Request` - Invalid input data</br>
> **Response:** `401 Unauthorized` - Not authenticated or invalid current password
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/users/me/request` | POST | True | Raise logo Request |

> <details>
> <summary>Request body</summary>
>
> ```json
> {
>   "user_id": "6826d68a0fbea0d79998ef45",
>   "companyUrl": "https://company.com"
> }
> ```
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode": 200
> }
> ```
> 
> **Response:** `200 OK` - Logo request submitted successfully</br>
> **Response:** `400 Bad Request` - Invalid input data</br>
> **Response:** `401 Unauthorized` - Not authenticated
> </details>

</details>


<details>
<summary>ADMIN</summary>

| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/catalog/stats` | GET | True | Get the user statistics |

> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode": 200,
>   "data": {
>     "Users": 10,
>     "Keys": 2,
>     "Requests": 0,
>     "Hits": 0
>   }
> }
> ```
> 
> **Response:** `200 OK` - Statistics retrieved successfully</br>
> **Response:** `401 Unauthorized` - Not authenticated</br>
> **Response:** `403 Forbidden` - Not authorized
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/catalog/permission/:userId/roles/:role` | PUT | True | Assign or modify user roles |

> <details>
> <summary>Request body</summary>
>
> ```json
> {
>   "email": "email@user.com"
> }
> ```
>
> </details>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode": 200
> }
> ```
> 
> **Response:** `200 OK` - Role updated successfully</br>
> **Response:** `400 Bad Request` - Invalid role</br>
> **Response:** `401 Unauthorized` - Not authenticated</br>
> **Response:** `403 Forbidden` - Not authorized</br>
> **Response:** `404 Not Found` - User not found
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/catalog/logo` | POST | True | Upload a new company logo |

> <details>
> <summary>Request body</summary>
>
> ```
> Form Data:
>   logo: File - The logo file to upload
>   companyUri: string - The company URL
> ```
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode": 200,
>   "message": "Image updated successfully.",
>   "data": {
>     "_id": "image_id",
>     "updatedAt": "timestamp"
>   }
> }
> ```
> 
> **Response:** `200 OK` - Logo uploaded successfully </br>
> **Response:** `400 Bad Request` - Invalid input data</br>
> **Response:** `401 Unauthorized` - Not authenticated</br>
> **Response:** `403 Forbidden` - Not authorized
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/catalog/logo` | PUT | True | Update an existing logo |

> <details>
> <summary>Request body</summary>
>
> ```
> Form Data:
>   logo: File  - The logo file to upload
>   id: string  - The ID of the logo to update
> ```
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode": 200,
>   "message": "Image updated successfully.",
>   "data": {
>     "_id": "image_id",
>     "updatedAt": "timestamp"
>   }
> }
> ```
> 
> **Response:** `200 OK` - Logo updated successfully</br>
> **Response:** `400 Bad Request` - Invalid input data</br>
> **Response:** `401 Unauthorized` - Not authenticated</br>
> **Response:** `403 Forbidden` - Not authorized</br>
> **Response:** `404 Not Found` - Logo not found
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/catalog/logos` | GET | True | Retrieve a list of all uploaded logos |

> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode": 200,
>   "data": [
>     {
>       "_id": "image_id",
>       "user_id": "user_id",
>       "company_name": "COMPANY.png",
>       "company_uri": "https://company.com",
>       "image_size": 1024,
>       "is_deleted": false,
>       "updated_at": "timestamp"
>     }
>   ]
> }
> ```
> 
> **Response:** `200 OK` - Logos retrieved successfully</br>
> **Response:** `401 Unauthorized` - Not authenticated</br>
> **Response:** `403 Forbidden` - Not authorized
> </details>

</details>


<details>
<summary>OPERATOR</summary>

| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/messages/:messageId` | PUT | True | Respond to a contact form message |

> <details>
> <summary>Request body</summary>
>
> ```json
> {
>   "reply": "This is a detailed response to the customer's inquiry."
> }
> ```
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "message": "Message updated successfully",
>   "data": {
>     "reply": "This is a detailed response to the customer's inquiry",
>     "activityStatus": true,
>     "assignedTo": "operator_id",
>     "email": "customer@example.com",
>     "message": "Original customer message"
>   }
> }
> ```
> 
> **Response:** `200 OK` - Message updated successfully</br>
> **Response:** `400 Bad Request` - Invalid input data</br>
> **Response:** `401 Unauthorized` - Not authenticated</br>
> **Response:** `403 Forbidden` - Not authorized</br>
> **Response:** `404 Not Found` - Message not found
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/messages` | GET | True | Get messages received from contact form |

> <details>
> <summary>Query parameters</summary>
> 
> - `page`: Page number for pagination (optional)
> - `limit`: Number of items per page (optional)
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "message": "Fetched all contact us messages.",
>   "statusCode": 200,
>   "total": 10,
>   "currentPage": 1,
>   "totalPages": 1,
>   "results": [
>     {
>       "_id": "message_id",
>       "email": "customer@example.com",
>       "name": "customer name",
>       "message": "Customer inquiry message",
>       "status": "PENDING",
>       "operator": "operator_id",
>       "is_deleted": false,
>       "updated_at": "timestamp",
>       "comment": "Operator's response"
>     }
>   ]
> }
> ```
> 
> **Response:** `200 OK` - Messages retrieved successfully</br>
> **Response:** `400 Bad Request` - Invalid pagination parameters</br>
> **Response:** `401 Unauthorized` - Not authenticated</br>
> **Response:** `403 Forbidden` - Not authorized
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/messages/contact-us` | POST | False | Submit a new contact form message |

> <details>
> <summary>Request body</summary>
>
> ```json
> {
>   "name": "customer name",
>   "email": "customer@example.com",
>   "message": "This is a detailed message from the customer."
> }
> ```
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "message": "Form submitted, our team will get in touch shortly",
>   "statusCode": 200
> }
> ```
> 
> **Response:** `200 OK` - Message submitted successfully</br>
> **Response:** `400 Bad Request` - Invalid input data
> </details>

</details>


<details>
<summary>BUSINESS API</summary>

| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/logo` | GET | False | Get single image |

> <details>
> <summary>Query parameters</summary>
> 
> - `domain`: The domain name of the company (required)
> - `API_KEY`: API key for authentication (required)
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode" : 200,
>   "data": "https://api.example.com/logos/company-logo.png"
> }
> ```
> 
> **Response:** `200 OK` - Logo retrieved successfully</br>
> **Response:** `400 Bad Request` - Invalid input parameters</br>
> **Response:** `401 Unauthorized` - Invalid API key</br>
> **Response:** `404 Not Found` - Logo not found
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/logo/search` | GET | False | Get multiple images |

> <details>
> <summary>Query parameters</summary>
> 
> - `domainKey`: Prefix of the domain name to filter logos (required)
> - `API_KEY`: API key for authentication (required)
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode" : 200,
>   "data": [
>       {
>        "companyName" : "companyName",
>        "image" : "https://api.example.com/logos/company-logo.png"
>       }
>    ]
> }
> ```
> 
> **Response:** `200 OK` - Logos retrieved successfully</br>
> **Response:** `400 Bad Request` - Invalid input parameters</br>
> **Response:** `401 Unauthorized` - Invalid API key
> </details>

---
| URL | Method | Auth Required | Description |
|-----|--------|---------------|-------------|
| `/logo/demo-search` | GET | False | Demo search endpoint (no auth required) |

> <details>
> <summary>Query parameters</summary>
> 
> - `domainKey`: Prefix of the domain name to filter logos (required)
> </details>
>
> <details>
> <summary>Response body</summary>
>
> ```json
> {
>   "statusCode" : 200,
>   "data": [
>       {
>        "companyName" : "companyName",
>        "image" : "https://api.example.com/logos/company-logo.png"
>       }
>    ]
> }
> ```
> 
> **Response:** `200 OK` - Logos retrieved successfully</br>
> **Response:** `400 Bad Request` - Invalid input parameters
> </details>

</details>
