### AUTH

POST /auth/signup – Register a new user.
POST /auth/signin – Log in and start a session.
POST /auth/signout – Terminate the session.
GET /auth/verify – Validate the user session token.
POST /auth/password/forgot – Initiate password recovery.(also use it for resending email)
POST /auth/password/reset – Reset user password.

### USER

GET /users/me – Retrieve authenticated user profile.
PATCH /users/me – Update user profile details.
DELETE /users/me – Permanently delete the user account.
POST /users/me/api-key – Generate a new API key.
DELETE /users/me/api-key/{key_id} – Revoke an API key.
PATCH /users/me/password - update user password

### ADMIN

PUT catalog/permission/{user_id}/roles/{role} – Assign or modify user roles (e.g., grant admin access).
PUT catalog/permission/{user_id}/roles/{role} – revoke permissions (e.g., grant admin access).
POST catalog/logo – Upload a new company logo.
PUT catalog/logo – Update an existing logo.
GET catalog/logos – Retrieve a list of all uploaded logos - (pagination)
GET catalog/stats - Retrieve total stats for admin (e.g., users, keys, requests, hits)

### OPERATOR

PUT /messages/{message_id} – Downgrade an operator to a standard customer.
GET /messages – get messages recived from conatactus form. - (pagination)

### BUSINESS API

GET /logo?key={} get single image
GET /logo/search?key={} get mutltiple images
