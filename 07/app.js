const express = require('express')
const app = express();
const cookieParser = require('cookie-parser')
const path = require('path')
const userModel = require('./models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())

app.get('/', (req,res)=>{
    res.render('index')
})

app.post('/create',  (req,res)=>{
    let {username, email, password, age} = req.body;
    
    bcrypt.genSalt(10,function(err,salt){
        // if(err) return 
        bcrypt.hash("merapassword", salt, async function(err,hash){
            // Store hash in your password DB.
            // console.log(hash);
            let createdUser = await userModel.create({
                username,
                email,
                password: hash,
                age
            })

            let token = jwt.sign({email}, "jsabdjbs");
            res.cookie("token", token);
            res.send(createdUser)
        })
    })

    

})

app.get('/login', (req,res)=>{
    res.render('login');
})

app.post('/login', async (req,res)=>{
    let user = await userModel.findOne({email: req.body.email})
    if(!user) return res.send("Something went wrong!") //agar user nhi h to yahi ke yahi ruk jaoge

    //aur agar mail exist kregi to hum compare krege wo hashed salt key generated password ko user ke password se agar match kra to badhiya nhi to chaa mudao sale
    bcrypt.compare(req.body.password, user.password, function(err,result){
        if(result) {
            let token = jwt.sign({email: user.email}, "jsabdjbs");
            res.cookie("token", token);
            res.send("yes u can login")
        }
        else res.send("no u cannot login")
    })
})

//this is the way to logout of the page
app.get('/logout', (req,res)=>{
    res.cookie("token", "")
    res.redirect('/')
})

app.listen(3000)