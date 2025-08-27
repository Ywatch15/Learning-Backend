const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');

app.get('/', (req,res)=>{
    res.send("Hello World");
})
app.get('/create', async (req,res)=>{
    let user = await userModel.create({
        userName:"sundu",
        age: 21,
        email:"sundu@gmail.com"
    });
    res.send(user);
})
app.get('/post/create', async (req,res)=>{
    let post = await postModel.create({
        postdata: "This is a post",
        user: "68ac7d8ba44fd16411908358" //loggedin user ki id

    })


    let user = await userModel.findOne({_id:"68ac7d8ba44fd16411908358"})
    user.posts.push(post._id)
    await user.save()
    res.send({post,user});
})

app.listen(3000)