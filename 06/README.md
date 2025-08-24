# Chapter 06: Authentication & Data Persistence

This chapter covers the fundamental concepts of web authentication and data persistence on the client-side. We explore how to use cookies to store information, how to securely hash passwords with `bcrypt`, and how to implement stateless authentication using JSON Web Tokens (JWT).

## Core Concepts Learned

### 1. Cookie-Parser
- **What it is:** `cookie-parser` is a middleware for Express.js. When a browser sends a request to the server, it includes any cookies for that domain in the `Cookie` HTTP header. This middleware parses that header.
- **How it works:** It takes the raw `Cookie` header string, parses it, and attaches the cookies as a convenient object to the request object, available at `req.cookies`. This makes it easy to read cookie values by their names.
- **Usage:**
  ```javascript
  const cookieParser = require('cookie-parser');
  app.use(cookieParser()); 
  // Now, for any incoming request, req.cookies will be populated.
  ```

### 2. Bcrypt
- **What it is:** `bcrypt` is a library for hashing passwords. It is based on the Blowfish cipher and is designed to be slow, which makes it resistant to brute-force attacks.
- **Why use it:** You should **never** store passwords in plain text. Bcrypt provides a secure way to store passwords by converting them into a fixed-length, irreversible "hash". It automatically includes a "salt" (random data) with each hash to protect against rainbow table attacks.
- **Key Operations:**
  - **Hashing a Password (`bcrypt.hash`):** This process takes a plain-text password and a "salt" (or a cost factor to generate a salt) and produces a hash.
    ```javascript
    // The '10' is the cost factor - higher is more secure but slower.
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("myPlainPassword", salt, function(err, hash) {
            // Store this 'hash' in your database
        });
    });
    ```
  - **Verifying a Password (`bcrypt.compare`):** To check if a user's login password is correct, you compare the plain-text password they provide with the hash stored in your database. You never "un-hash" the stored password.
    ```javascript
    bcrypt.compare("passwordFromLoginAttempt", storedHash, function(err, result) {
        // 'result' will be true if they match, false otherwise.
    });
    ```

### 3. JSON Web Tokens (JWT)
- **What it is:** A JWT is a compact and self-contained way for securely transmitting information between parties as a JSON object. It is "signed," which means it can be verified and trusted.
- **Why use it (Stateless Authentication):** JWTs enable stateless authentication. Instead of the server needing to store session data for a logged-in user, the user's information (like their ID or email) is stored directly in the JWT on the client-side (e.g., in a cookie). With each request, the client sends the JWT, and the server can verify its signature to authenticate the user without needing to look up session data. This is highly scalable.
- **Key Operations:**
  - **Signing a Token (`jwt.sign`):** This creates a token. You provide a payload (the data you want to store) and a secret key. The secret key is used to create the token's signature.
    ```javascript
    // The secret key should be complex and stored securely.
    let token = jwt.sign({ email: "user@example.com", userId: 123 }, "YOUR_SECRET_KEY");
    ```
  - **Verifying a Token (`jwt.verify`):** This checks if a token is valid and, if so, decodes its payload. It uses the same secret key that was used for signing. If the token was tampered with or signed with a different key, verification will fail.
    ```javascript
    try {
      let decodedPayload = jwt.verify(tokenFromClient, "YOUR_SECRET_KEY");
      // If successful, 'decodedPayload' contains { email: "user@example.com", userId: 123 }
    } catch (err) {
      // Token is invalid!
    }
    ```

### 4. Sessions (Stateful vs. Stateless)
- **Stateful Sessions (Traditional):** The server creates a session for a user upon login, stores the session data (e.g., in memory or a database), and gives the client a unique Session ID cookie. On every subsequent request, the client sends the Session ID, and the server uses it to look up the corresponding session data.
- **Stateless Sessions (JWT):** The server does not store any session data. All the necessary user information is encoded in the JWT and stored on the client. This is the approach demonstrated in this chapter's `app.js`.

---

## Code Flow in `app.js`

The `app.js` file demonstrates how to create a JWT, store it in a cookie, and then read and verify it on a subsequent request.

### 1. Setup
```javascript
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// This line registers the cookie-parser middleware. From this point on,
// every incoming request will have its 'Cookie' header parsed, and the
// result will be available in the `req.cookies` object.
app.use(cookieParser());
```

### 2. Route: `/` (Create and Set Token)
This route simulates a user logging in. Upon successful login, a token would be generated and sent to the user.

```javascript
app.get('/', (req,res)=>{
    // 1. Create a JWT.
    //    - The payload is `{email: "mai@tu.com"}`. This is the data we are storing in the token.
    //    - The secret key is `"secret"`. This is used to sign the token for security.
    //      In a real app, this should be a long, complex, and securely stored string.
    let token = jwt.sign({email: "mai@tu.com"}, "secret");

    // 2. Set the token in a cookie.
    //    - `res.cookie()` sends a `Set-Cookie` header to the browser.
    //    - The cookie is named "token".
    //    - Its value is the JWT string we just created.
    res.cookie("token", token);

    // 3. Send a response to the browser.
    res.send('Token created and cookie has been set. Visit /read to verify it.');
});
```
**Flow:**
1. A user navigates to `http://localhost:3000/`.
2. The server creates a JWT containing the email `"mai@tu.com"`.
3. The server sends this token back to the user's browser inside a cookie named `token`.
4. The browser automatically stores this cookie.

### 3. Route: `/read` (Read and Verify Token)
This route simulates a protected resource that only an authenticated user can access.

```javascript
app.get('/read', (req,res)=>{
    try {
        // 1. Read the token from the incoming request's cookies.
        //    `req.cookies.token` accesses the value of the 'token' cookie.
        // 2. Verify the token.
        //    - `jwt.verify()` checks the token's signature using the same "secret" key.
        //    - If the signature is valid, it returns the decoded payload.
        let data = jwt.verify(req.cookies.token, "secret");

        // 3. Log the decoded data to the console.
        //    This will print `{ email: 'mai@tu.com', iat: ... }`
        //    'iat' (issued at) is a timestamp automatically added by jwt.
        console.log(data);
        res.send("Token verified successfully! Check the console for the decoded data.");
    } catch (err) {
        // If jwt.verify fails (e.g., no token, invalid token), it throws an error.
        console.error("Token verification failed:", err.message);
        res.status(401).send("Authentication failed. Invalid or missing token.");
    }
});
```
**Flow:**
1. The user navigates to `http://localhost:3000/read`.
2. The browser automatically sends the `token` cookie along with the request.
3. The server receives the request, and `cookie-parser` makes the token available in `req.cookies.token`.
4. `jwt.verify()` checks the token's signature. Since it was signed with `"secret"`, it will be successfully verified.
5. The original payload (`{email: "mai@tu.com"}`) is extracted and logged to the server's console.

### 4. Server Start
```javascript
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```
This line starts the Express application, making it listen for incoming requests on port 3000.
