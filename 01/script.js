const fs=require('fs');

// fs.writeFile("hey.txt", "Hello, World!",function(err){
//     if(err) console.error(err);
//     else console.log("File written successfully!");
// })
// fs.appendFile("hey.txt", "Hello, World! again",function(err){
//     if(err) console.error(err);
//     else console.log("File appended successfully!");
// })
// fs.rename("hey.txt", "hello.txt",function(err){
//     if(err) console.error(err);
//     else console.log("File renamed successfully!");
// })
// fs.copyFile("hello.txt", "./copy/copy.txt", function(err){
//     if(err) console.error(err);
//     else console.log("File copied successfully!");
// })

// fs.unlink("./copy/copy.txt", function(err){
//     if(err) console.error(err);
//     else console.log("File deleted successfully!");
// })

// fs.rmdir("./copy", { recursive: true }, function(err){ //we can also use rm instead of rmdir  -> remove directory
//     if(err) console.error(err);
//     else console.log("Directory deleted successfully!");
// })

// fs.readFile("hello.txt", function(err, data){
//     if(err) console.error(err);
//     else console.log(data.toString());
// });

// fs.rm("index.html", function(err){
//     if(err) console.error(err);
//     else console.log("File deleted successfully!");


const express=require ('express');
const { log } = require('console');
const app = express()

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.use(function(req, res, next) {
    console.log("Middleware executed for every request");
    next(); // Call the next middleware or route handler
})

app.get("/", function(req,res){
    res.send("dj")
})
app.get("/profile", function(req,res,next){
    return next(new Error("Profile not found"));
})
app.get("/profile/details", function(req,res){
    res.send("criiiicket")
})


app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.status(500).send('Something broke!');
})


app.listen(3000)
