// const express = require('express')
// const app = express();
// const path = require('path');

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// //these two lines are to handle the data from the form

// app.use(express.static(path.join(__dirname, 'public')));
// //this line is to serve static files like css, js, images etc.


// app.set('view engine', 'ejs');
// //this line is to render the ejs pages

// app.get("/", function(req,res){
//     res.render("index"); //we can also write index.ejs 
// })
// //this is the basic route to render the index.ejs file in the views folder

// app.listen(3000, function(){
//     console.log("Server is running on port 3000");
    
// })


const express = require('express');
const app = express();
const path = require('path')

app.use(express.json());
app.use(express.urlencoded({ extended:true }))
app.use(express.static(path.join(__dirname,'public')))

app.set('view engine', 'ejs');
app.get("/", function(req,res){
    res.render('index')
})

app.get("/profile/:name", function(req,res){
    // req.params.name; // agar uper path me :sundram likha h to req.params.sundram likhege
    res.send (`welcome, ${req.params.name} to the page`)
})

app.get("/about/:username/:age", (req,res) => {
    res.send(`welcome ,${req.params.username} of age ${req.params.age} to the about page`)
})

app.listen(3000, function(){
    console.log("Server is running on port 3000");
})
// console.log(__dirname+'/public');

