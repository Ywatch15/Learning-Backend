// import the Express module so we can create a web server and define routes
const express = require('express') // require returns the exported express function/object

// create an Express application instance; this is the main app object we register routes on
const app = express()

// import Node's path module for working with filesystem paths (not used below but commonly available)
const path = require('path') // path provides utilities like join, resolve, dirname

// load the local user model module (likely a Mongoose model or simple data access object)
const userModel = require('./usermodel') // ./usermodel should export create/find/update/delete methods

// register a route handler for GET requests to the root path '/'
app.get('/', (req, res) => { // req = incoming request, res = response helper
    res.send('hey there') // send a simple plain-text response to the client and finish the request
})

// register a route handler for GET /create to create a new user document (async because it awaits DB calls)
app.get('/create' ,async (req, res) => {
    // the below DB operation returns a promise, so we await it to get the created document
    let createdUser = await userModel.create({ // call create on the model to insert a new record
        name:'Sundram', // the name field for the new user document
        email: 'pathaksundram82@gmail.com', // the email field for the new user
        username: 'sundram82' // the username field for the new user
    })
    res.send(createdUser) // respond with the created user object (JSON will be sent by Express)
})

// register a route handler for GET /read to read user(s) from the database
app.get('/read', async (req,res)=>{
    // Example: let users = await userModel.find() would return all users
    // Here we query for users matching the username 'sundram82'
    let users = await userModel.find({username:"sundram82"}) // find returns an array of matching documents
    res.send(users) // send the array of matched users back to the client
})

// register a route handler for GET /update to update a user's data
app.get('/update' ,async (req, res) => {
    // findOneAndUpdate(filter, update, options) finds a single document and applies the update
    // {new:true} tells the method to return the updated document rather than the original
    let updatedUser = await userModel.findOneAndUpdate(
        {username:"sundram82"}, // filter: find a user with this username
        {name:"Sundu"}, // update: set the name field to "Sundu"
        {new:true} // options: return the updated document
    )
    res.send(updatedUser) // send the updated document back to the client
})


// register a route handler for DELETE /delete to remove a user from the database
app.delete('/delete', async (req,res)=>{
    // findOneAndDelete(filter) finds a single document that matches the filter and deletes it
    let users = await userModel.findOneAndDelete({username:"sundram82"}) // deletes the user with username "sundram82"
    res.send(users) // send the deleted document (or null) back to the client
})

// a leftover debug console log (kept commented out) -- can be enabled during development
// console.log('hey');

// start the HTTP server and listen for incoming connections on port 3000
app.listen(3000, ()=>{
    // this callback runs once the server is listening; useful to confirm startup
    console.log('Server is running on port 3000')
})