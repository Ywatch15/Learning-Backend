const express= require('express');
const app = express();  
const path = require('path');
const fs = require('fs')


app.set("view engine", "ejs");
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req,res){
    fs.readdir(`./files`,function(err, files){
        res.render("index", { files: files });
    })
})
app.get('/file/:filename', function(req,res){
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', function(err,filedata){
        // console.log(filedata);
        res.render('show', {filename:req.params.filename, filedata:filedata})
    })
})
app.get('/edit/:filename', function(req,res){
    res.render('edit', {filename: req.params.filename});
})

app.post('/edit', function(req,res){
    // Add .txt extension to the new name if it doesn't already have it
    let newName = req.body.newName;
    if (!newName.endsWith('.txt')) {
        newName = newName + '.txt';
    }
    
    fs.rename(`./files/${req.body.prevName}`, `./files/${newName}`, function(err){
        if(err) {
            console.log('Error renaming file:', err);
            return res.status(500).send('Error renaming file');
        }
        res.redirect('/');
    })
})



app.post('/create', function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt` ,req.body.description, function(err){
        // console.log();
        res.redirect('/')
    })
})

app.listen(3000, function(req,res){
    console.log('Server is running on port 3000');
});