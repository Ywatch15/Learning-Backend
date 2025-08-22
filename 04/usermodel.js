// Import the mongoose library which provides an ODM (Object Data Modeling)
// layer for MongoDB. This gives us Schema, Model and connection helpers.
const mongoose = require('mongoose');

// Open a connection to the MongoDB server. The connection string specifies
// the protocol (mongodb), the host (127.0.0.1), the port (27017) and the
// database name (mongo-express). This call starts the connection process.
// Note: mongoose.connect returns a promise; in production you should handle
// success and error cases with .then/.catch or async/await and provide
// options (e.g. useNewUrlParser, useUnifiedTopology) when needed.
mongoose.connect(`mongodb://127.0.0.1:27017/mongo-express`);

// Define a schema for users. A Schema tells mongoose the shape of the
// documents in a collection: the field names and their types. Here we create
// a simple schema with three string fields: name, email and username.
const userSchema = new mongoose.Schema({
    // 'name' field, stored as a String in MongoDB documents
    name: String,
    // 'email' field, stored as a String. In real apps you'd typically
    // add validation (required, match/email format, unique) here.
    email: String,
    // 'username' field, stored as a String. Often used for login or display.
    username: String,
});

// Create and export a Mongoose model based on the schema. The first
// argument 'User' is the model name (Mongoose will look for the 'users'
// collection in the database, lowercased and pluralized), and the second is
// the schema that defines the document structure. Exporting this model
// allows other files to require it and perform CRUD operations.
module.exports = mongoose.model('User', userSchema);