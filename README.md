# Week-3-Laboratory-API-Development-Microservices
Authentication Service (auth-service.js)
Handles user management and authentication.

Endpoints
Method	Endpoint	Description
POST	/api/register	Registers a new user
POST	/api/login	Logs in a user, returns a JWT token
DELETE	/api/users/:username	Deletes a user
GET	/api/users	Fetches all registered users (for debugging)
How it Works
Register a User (/api/register)

Accepts username and password.
Hashes the password before storing.
Returns success message or error if user exists.
Login a User (/api/login)

Accepts username and password.
Verifies credentials, generates a JWT token.
Returns a JWT token for authentication.
Delete a User (/api/users/:username)

Removes a user from the in-memory store.
Fetch Users (/api/users)

Returns a list of all registered users (for debugging).
Product Service (product-service.js)
Manages product catalog, with public and protected routes.

Endpoints
Method	Endpoint	Description
GET	/api/products	Returns the list of products (public)
POST	/api/products	Adds a product (protected)
How it Works
Fetch Products (/api/products)

Public route (no authentication required).
Returns a list of available products.
Add Product (/api/products) (Protected)

Requires a valid JWT token in the request header (Authorization: Bearer <token>).
Accepts a product name, adds it to the list.
How Authentication Works
After login, the server returns a JWT token.
This token is needed to access protected routes (e.g., adding a product).
If a request has a valid token, the server allows access. Otherwise, it rejects the request.
How to Test the API
Start Authentication Service

nginx
Copy
Edit
node auth-service.js
Register a User (POST /api/register)

Send { "username": "testuser", "password": "testpass" } via Postman.
Login and Get Token (POST /api/login)

Send { "username": "testuser", "password": "testpass" }.
Copy the returned JWT token.
Start Product Service

nginx
Copy
Edit
node product-service.js
Fetch Products (GET /api/products)

No authentication needed.
Add Product (POST /api/products)

Add "Authorization: Bearer <your-token>" in the headers.
Send { "name": "New Product" } in the request body.
