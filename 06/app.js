const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cookieParser())

// app.get('/', (req,res)=>{
//     res.cookie("name", "sundu")
//     res.send('Cookie has been set');
// })

// app.get('/', (req,res)=>{
//     bcrypt.compare("merapassword", "$2b$10$xQ.0JJ3.UdMfxBe/xFVNYuEkDc/GOAvvLnHnLjWMEqJm8lNDuIHfe", function(err, result) {
//         //result==true
//         console.log(result);
        
//     })
// })
// app.get('/', (req,res)=>{
//     bcrypt.genSalt(10, function(err, salt) {
//         bcrypt.hash("merapassword", salt, function(err, hash) {
//             // Store hash in your password DB.
//             console.log(hash);
//         });
//     });
// })

app.get('/', (req,res)=>{
    let token = jwt.sign({email: "mai@tu.com"}, "secret");
    res.cookie("token", token)
    console.log(token);
    // res.send('hey');
})
//this is to read the cookie
// app.get('/read', (req,res)=>{
//     console.log(req.cookies.token);
    
// })

app.get('/read', (req,res)=>{
    let data  = jwt.verify(req.cookies.token, "secret");
    console.log(data);
    // res.send("Cookie data logged to console");
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
