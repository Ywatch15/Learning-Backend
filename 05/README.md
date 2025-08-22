# Project 05: Basic CRUD Application

This project is a simple Create, Read, Update, and Delete (CRUD) application built with Node.js, Express, and MongoDB.

## Core Components

-   `app.js`: The main Express application file. It sets up the server, view engine (EJS), middleware (for parsing request bodies and serving static files), and defines all the application routes.
-   `models/user.js`: Handles the MongoDB connection and defines the Mongoose schema for a `user`.
-   `views/`: Contains all the EJS templates for rendering the user interface.
-   `public/`: Holds static assets like CSS, client-side JavaScript, and images.

## How It Works

### Application Routes (`app.js`)

-   `GET /`: Renders the user creation form (`views/index.ejs`).
-   `POST /create`: Creates a new user in the database and redirects to `/read`.
-   `GET /read`: Fetches all users from the database and displays them (`views/read.ejs`).
-   `GET /edit/:userid`: Shows a form to edit a specific user's details (`views/edit.ejs`).
-   `POST /update/:userid`: Updates a user's information in the database.
-   `GET /delete/:id`: Deletes a user from the database.

### Data Flow Example (Creating a User)

1.  A user fills out and submits the form on the homepage (`/`).
2.  The browser sends a `POST` request to the `/create` endpoint.
3.  The `app.js` route handler receives the form data.
4.  It calls `userModel.create()` to save a new user document to MongoDB.
5.  The server redirects the browser to the `/read` page, which now shows the new user.

---

## How to Run This Project

### Prerequisites

-   Node.js (v14 or newer recommended).
-   A running MongoDB instance on your local machine.

### Steps

1.  **Navigate to the project directory.**
    Open your terminal and change into this project's folder (`05`).

2.  **Install dependencies.**
    If you haven't already, install the required npm packages.
    ```powershell
    npm install
    ```

3.  **Start the application.**
    Make sure your MongoDB server is running, then start the app.
    ```powershell
    node app.js
    ```

4.  **View in browser.**
    Open your web browser and go to `http://localhost:3000`.

---

## Troubleshooting

-   **MongoDB Connection Error:** Ensure your MongoDB server is running and accessible at the URI specified in `models/user.js` (default: `mongodb://127.0.0.1:27017/testapp1`).
-   **Changes Not Appearing:** If you modify `app.js` or other server-side files, you must restart the Node.js server. Changes to EJS templates in `views/` should appear after a simple browser refresh.

---

## Potential Next Steps

-   Add input validation for the forms.
-   Move sensitive information like the database URI to environment variables (`.env` file).
-   Implement user authentication to protect the edit and delete routes.


