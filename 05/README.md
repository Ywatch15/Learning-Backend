For `05/`:

- `app.js` — Express app and routes. Sets up view engine, parses request bodies, serves `public/`, and defines routes:
  - `GET /` -> renders `views/index.ejs` (create user form)
  - `POST /create` -> creates a user in MongoDB using the model and redirects to `/read`
  - `GET /read` -> reads users from DB and renders `views/read.ejs` (user cards)
  - `GET /edit/:userid` -> renders `views/edit.ejs` for a single user
  - `POST /update/:userid` -> updates a user and redirects
  - `GET /delete/:id` -> deletes a user and redirects

- `models/user.js` — Mongoose model and DB connection. Connects to `mongodb://127.0.0.1:27017/testapp1` and defines the `user` schema (name, email, password).

- `views/` — EJS templates used by the app. Important files:
  - `index.ejs` — Create-user form (POST `/create`).
  - `read.ejs` — Shows user cards generated from the `users` array passed by `app.js`.
  - `edit.ejs` — Form for editing a single user.

- `public/` — Static assets (CSS under `stylesheets`, client JS under `javascripts`, images). Express serves this folder as static.

---

## Code flow (text diagram)

1) User submits the create form (from `views/index.ejs`) -> browser POST /create
   app.js (route handler) receives form data -> `userModel.create({name,email,password})` -> MongoDB stores the document -> server redirects to `/read`.

2) Browser requests GET /read
   app.js route handler: `let users = await userModel.find()` -> `res.render('read', { users })` -> `views/read.ejs` loops over `users` and renders a div per user.

3) Edit: GET /edit/:id -> server finds the user and renders `edit.ejs` pre-filled. POST /update/:id -> server updates user and redirects.

4) Delete: GET /delete/:id -> server deletes and redirects back to `/read`.

Visual (simplified):

Browser <--> Express routes (`app.js`) <--> Mongoose model (`models/user.js`) <--> MongoDB

Views (EJS) are rendered server-side using the data returned from Mongoose.

---

## How to run (Windows PowerShell)

Prerequisites:
- Node.js (14+ recommended)
- MongoDB running locally (or change URI in `models/user.js`)

Steps (example for the `05` app):

```powershell
cd 'D:\Complete Programming\Backend - Sheryians\05'
# install deps if needed
npm install

# ensure MongoDB is running (on default port 27017)
# then start the app
node .\app.js

# open http://localhost:3000/ in the browser
```

If the server uses port 3000 and starts without error, visit `/` to create users and `/read` to view them.

---

## Example requests (PowerShell / curl)

Create a user (PowerShell example):

```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/create' -Method POST -Body @{ name='Test'; email='t@test.com'; password='pass' }
```

List users (open page in browser or fetch HTML):

```powershell
Invoke-WebRequest -UseBasicParsing 'http://localhost:3000/read' | Select-Object -Expand Content
```

Delete a user (replace <id>):

```powershell
Invoke-WebRequest -UseBasicParsing "http://localhost:3000/delete/<id>"
```

---

## Notes, gotchas and troubleshooting

- MongoDB must be running and reachable at the URI used in `models/user.js` (defaults to `mongodb://127.0.0.1:27017/testapp1`). If you use a different host/port or authentication, update that file.
- If you don't see user DIVs on `/read`:
  - Confirm `app.js`'s `/read` route fetches users and passes `users` into the template (`res.render('read', { users })`).
  - Open the page and inspect the DOM (DevTools) to see whether the elements are present but styled invisibly (dark on dark). Tailwind classes may hide or style things unexpectedly.
  - If using the Tailwind browser CDN, ensure the script runs after the markup (use `defer` or place just before `</body>`), otherwise class-based CSS may not be generated before paint.

- If you modified templates but changes don’t show:
  - Restart the server if you changed JS in `app.js`.
  - For EJS template changes you usually only need to refresh the browser.

---

## Where to extend / next steps

- Add validation and error handling around DB operations in `app.js`.
- Move DB URI and port into environment variables (use `process.env.MONGO_URI`, `process.env.PORT`).
- Add authentication before exposing edit/delete routes.
- Add unit/integration tests for route handlers.

---

## File index (main files to inspect)

- `05/app.js` — main Express app for example 05 (routes and middleware)
- `05/models/user.js` — Mongoose model + DB connection
- `05/views/index.ejs` — create-user form
- `05/views/read.ejs` — user listing template
- `05/views/edit.ejs` — edit form
- `05/public/stylesheets/style.css` — styles served to views

---


