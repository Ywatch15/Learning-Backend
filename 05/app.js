const express = require('express'); // require returns the exported express function/object
const app = express(); // create an Express application instance; this is the main app object we register routes on 
const path = require('path');

app.set('view engine','ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // middleware to parse JSON and URL-encoded bodies
app.use(express.static(path.join(__dirname,'public')));
const userModel = require('./models/user'); // load the local user model module (likely a Mongoose model or simple data access object)

app.get('/', (req,res)=>{
    res.render('index')
})
app.get('/read', async (req,res)=>{
    let users = await userModel.find(); // fetch all users from the database
    res.render('read', { users }); // pass the users to the EJS template
})

app.get('/edit/:userid', async (req,res)=>{
    let user = await userModel.findOne({_id: req.params.userid});
    res.render('edit', {user});
})

app.post('/update/:userid', async (req,res)=>{
    let {name, email, password} = req.body
    let user = await userModel.findOneAndUpdate({_id: req.params.userid},{name, email, password}, {new:true});
    res.redirect('/read');
})
app.get('/delete/:id', async (req,res)=>{
    let { id } = req.params;
    await userModel.findByIdAndDelete(id); // delete the user from the database
    res.redirect('/read'); // redirect to the read page
})

app.post('/create', async (req,res)=>{
    let {name, email, password} = req.body; // destructure the request body to get name, email, and password
    let createdUser = await userModel.create({
        name,
        email,
        password
    })

    res.redirect('/read')
})

app.listen(3000);