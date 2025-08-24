# Chapter 07: Full Authentication System

This project is a simple but complete web application demonstrating a full user authentication system using Node.js, Express, and MongoDB. It covers user registration with password hashing, user login with password verification, and session management using JSON Web Tokens (JWT) stored in cookies.

## Core Technologies Used

*   **Node.js**: JavaScript runtime environment for the server.
*   **Express.js**: Web application framework for Node.js, used to build the server and handle routing.
*   **MongoDB**: NoSQL database used to store user data.
*   **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model application data.
*   **EJS (Embedded JavaScript)**: A simple templating language that lets you generate HTML markup with plain JavaScript.
*   **Bcrypt**: A library to help you hash passwords securely.
*   **JSON Web Token (JWT)**: Used for creating access tokens for stateless authentication.
*   **Cookie-Parser**: Middleware to parse `Cookie` header and populate `req.cookies` with an object keyed by the cookie names.

---

## Features

*   User Registration (Create)
*   Secure User Login
*   User Logout
*   Password hashing for security.
*   Stateless authentication using JWT.

---

## Project Structure

```
07/
|-- models/
|   `-- user.js           # Mongoose user schema and model
|-- public/
|   `-- stylesheets/      # (Optional) For compiled CSS
|-- views/
|   |-- index.ejs         # User registration page/form
|   `-- login.ejs         # User login page/form
|-- app.js                # Main Express server file
|-- package.json          # Project dependencies and scripts
`-- README.md             # This file
```

---

## Setup and Installation

1.  **Clone the repository (or ensure you are in the `07` directory).**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Ensure MongoDB is running:**
    Make sure you have a local MongoDB server instance running on the default port `27017`.

4.  **Start the server:**
    ```bash
    node app.js
    ```
    Or for development with automatic restarts:
    ```bash
    npx nodemon app.js
    ```

5.  **Access the application:**
    *   **Registration Page**: Open your browser and go to `http://localhost:3000/`
    *   **Login Page**: Open your browser and go to `http://localhost:3000/login`

---

## Code Flow and Internal Working

This section explains how a request travels through the application for each key feature.

### 1. User Registration (`POST /create`)

This flow describes what happens when a new user signs up.

1.  **Client-Side (Browser)**: The user fills out the registration form in `views/index.ejs` and clicks "Create User". The form is configured to send a `POST` request to the `/create` endpoint.

2.  **Server-Side (`app.js`)**:
    *   The request arrives at the Express server.
    *   The `express.urlencoded({ extended: true })` middleware parses the incoming form data (username, email, password, age) and makes it available in the `req.body` object.
    *   The `app.post('/create', ...)` route handler is executed.

3.  **Password Hashing**:
    *   Inside the route handler, `bcrypt.genSalt(10, ...)` is called to generate a random salt. A salt is random data that is used as an additional input to a one-way function that "hashes" a password. Salting prevents attackers from using pre-computed rainbow tables to crack password hashes.
    *   Once the salt is generated, `bcrypt.hash(password, salt, ...)` is called. It takes the user's plain-text password and the salt, and produces a secure hash. This process is computationally slow by design to make brute-force attacks more difficult.

4.  **Database Interaction (`models/user.js`)**:
    *   `userModel.create({...})` is called with the user's details, storing the **hashed password**, not the original one.
    *   Mongoose, via the `userModel`, takes this data and creates a new document in the `users` collection of your `mongopractice` database.

5.  **Authentication Token (JWT)**:
    *   After the user is successfully saved, a JWT is created using `jwt.sign({email}, "secret")`.
        *   **Payload**: `{email}` contains the user's identifying information.
        *   **Secret**: `"jsabdjbs"` is the secret key used to sign the token. **This must be kept private and should be stored in an environment variable in a real application.** The signature ensures that the token cannot be tampered with by the client.
    *   `res.cookie("token", token)` sends the generated JWT back to the browser in a cookie named `token`. The browser will automatically store this cookie and send it with every subsequent request to this server.

6.  **Response**: The server sends back the newly created user object as a JSON response, and the browser receives the `Set-Cookie` header.

### 2. User Login (`POST /login`)

This flow describes what happens when an existing user logs in.

1.  **Client-Side (Browser)**: The user fills out the login form in `views/login.ejs` (email and password) and clicks "Login". The form sends a `POST` request to the `/login` endpoint.

2.  **Server-Side (`app.js`)**:
    *   The `express.urlencoded` middleware parses the email and password from the form into `req.body`.
    *   The `app.post('/login', ...)` route handler is executed.

3.  **User Lookup**:
    *   `userModel.findOne({email: req.body.email})` queries the database to find a user whose email matches the one submitted in the form.

4.  **Password Verification**:
    *   If a user is found, the flow proceeds. If not, an error message is sent.
    *   `bcrypt.compare(req.body.password, user.password, ...)` is the crucial step. It takes the plain-text password submitted in the login form and compares it to the **hashed password** stored in the database (`user.password`).
    *   `bcrypt` re-hashes the submitted password using the same salt stored within `user.password` and checks if the result matches. It does this without ever needing to decrypt the stored password.

5.  **Session Creation (via JWT)**:
    *   If `bcrypt.compare` returns `true` (the passwords match), a new JWT is generated with `jwt.sign()` just like during registration.
    *   `res.cookie("token", token)` sets the new token in the user's browser, authenticating their session.
    *   A "login successful" message is sent as the response.
    *   If the passwords do not match, a "login failed" message is sent.

### 3. User Logout (`GET /logout`)

This flow describes how a user is logged out.

1.  **Client-Side (Browser)**: The user clicks a "Logout" link, which directs them to the `/logout` URL.

2.  **Server-Side (`app.js`)**:
    *   The `app.get('/logout', ...)` route handler is executed.
    *   `res.cookie("token", "")` instructs the browser to update the `token` cookie with an empty value. This effectively invalidates the token and removes the user's authenticated state.
    *   `res.redirect('/')` sends a redirect response to the browser, telling it to navigate to the homepage. The user is now logged out.
