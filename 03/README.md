# Task Manager Web Application

A simple file-based task management system built with Node.js, Express.js, and EJS templating. This application allows users to create, view, and edit tasks that are stored as text files on the server.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Code Flow](#code-flow)
- [Detailed Code Explanation](#detailed-code-explanation)
- [API Endpoints](#api-endpoints)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)

## ✨ Features

- **Create Tasks**: Add new tasks with title and description
- **View Tasks**: See all tasks in a grid layout
- **Read Task Details**: View full task content
- **Edit Task Names**: Rename existing tasks
- **File-Based Storage**: Tasks are stored as `.txt` files in the `/files` directory

## 🛠 Tech Stack

- **Backend**: Node.js with Express.js framework
- **Templating**: EJS (Embedded JavaScript)
- **Styling**: Tailwind CSS (via CDN)
- **File System**: Node.js `fs` module for file operations
- **Frontend**: HTML5, CSS3, JavaScript

## 📁 Project Structure

```
📦 Task Manager App
├── 📄 index.js          # Main server file
├── 📄 package.json      # Dependencies and project info
├── 📄 README.md         # This documentation
├── 📁 files/            # Directory where task files are stored
├── 📁 public/           # Static assets
│   ├── 📁 images/
│   ├── 📁 javascript/
│   └── 📁 stylesheets/
└── 📁 views/            # EJS templates
    ├── 📄 index.ejs     # Home page template
    ├── 📄 show.ejs      # Task detail view template
    └── 📄 edit.ejs      # Edit task name template
```

## 🔄 Code Flow

### 1. Application Startup
```
Server Start → Load Dependencies → Configure Middleware → Define Routes → Listen on Port 3000
```

### 2. Task Creation Flow
```
User fills form → POST /create → Parse form data → Create filename from title → 
Write file with description → Redirect to home → Show updated task list
```

### 3. Task Viewing Flow
```
Home page load → GET / → Read files directory → Pass file list to template → 
Render grid of tasks → User can click "Read More" → GET /file/:filename → 
Read file content → Display in show template
```

### 4. Task Editing Flow
```
User clicks "edit filename" → GET /edit/:filename → Render edit form → 
User submits new name → POST /edit → Rename file → Redirect to home
```

## 📝 Detailed Code Explanation

### Main Server File (`index.js`)

#### Dependencies and Setup
```javascript
const express= require('express');
const app = express();  
const path = require('path');
const fs = require('fs')
```
- **express**: Web framework for Node.js
- **app**: Express application instance
- **path**: Node.js module for working with file paths
- **fs**: File system module for file operations

#### Middleware Configuration
```javascript
app.set("view engine", "ejs");
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
```
- **EJS Setup**: Sets EJS as the template engine
- **JSON Parser**: Parses JSON request bodies
- **URL Encoder**: Parses form data from POST requests
- **Static Files**: Serves static assets from `/public` directory

#### Route Handlers

##### 🏠 Home Route (`GET /`)
```javascript
app.get('/', function(req,res){
    fs.readdir(`./files`,function(err, files){
        res.render("index", { files: files });
    })
})
```
**Purpose**: Display all tasks on the home page
- Reads all files from `./files` directory
- Passes file list to `index.ejs` template
- Renders the home page with task grid

##### 📄 File View Route (`GET /file/:filename`)
```javascript
app.get('/file/:filename', function(req,res){
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', function(err,filedata){
        res.render('show', {filename:req.params.filename, filedata:filedata})
    })
})
```
**Purpose**: Display individual task details
- Extracts filename from URL parameter
- Reads file content as UTF-8 text
- Passes filename and content to `show.ejs` template

##### ✏️ Edit Form Route (`GET /edit/:filename`)
```javascript
app.get('/edit/:filename', function(req,res){
    res.render('edit', {filename: req.params.filename});
})
```
**Purpose**: Show edit form for renaming tasks
- Gets filename from URL parameter
- Renders `edit.ejs` with current filename

##### 💾 Edit Process Route (`POST /edit`)
```javascript
app.post('/edit', function(req,res){
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
```
**Purpose**: Process file renaming
- Gets old and new names from form data
- Ensures new name has `.txt` extension
- Uses `fs.rename()` to rename the file
- Includes error handling
- Redirects to home page after success

##### ➕ Create Task Route (`POST /create`)
```javascript
app.post('/create', function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt` ,req.body.description, function(err){
        res.redirect('/')
    })
})
```
**Purpose**: Create new task files
- Gets title and description from form
- Creates filename by removing spaces from title
- Writes description as file content
- Redirects to home page

##### 🚀 Server Startup
```javascript
app.listen(3000, function(req,res){
    console.log('Server is running on port 3000');
});
```
**Purpose**: Start the server
- Listens on port 3000
- Logs server start message

### Template Files

#### Home Page (`views/index.ejs`)
- **Purpose**: Main interface for task management
- **Features**:
  - Task creation form (title + description)
  - Grid display of all tasks
  - Links to view and edit each task
- **Styling**: Dark theme with Tailwind CSS
- **Dynamic Content**: Loops through file list to display tasks

#### Task Detail View (`views/show.ejs`)
- **Purpose**: Display full task content
- **Content**: Shows task title and full description
- **Navigation**: Back link to home page

#### Edit Form (`views/edit.ejs`)
- **Purpose**: Interface for renaming tasks
- **Features**:
  - Read-only field showing current name
  - Input field for new name
  - Form submission to `/edit` endpoint
- **Styling**: Consistent dark theme

## 🌐 API Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/` | Home page with task list | None |
| `GET` | `/file/:filename` | View specific task | `filename` (URL param) |
| `GET` | `/edit/:filename` | Edit form for task | `filename` (URL param) |
| `POST` | `/edit` | Process task rename | `prevName`, `newName` (form data) |
| `POST` | `/create` | Create new task | `title`, `description` (form data) |

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation
1. **Clone or download the project**
   ```bash
   cd "d:\Complete Programming\Backend - Sheryians\03"
   ```

2. **Install dependencies**
   ```bash
   npm install express ejs
   ```

3. **Create files directory** (if it doesn't exist)
   ```bash
   mkdir files
   ```

4. **Start the server**
   ```bash
   node index.js
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎯 Usage

### Creating a Task
1. Fill in the "Enter something" field with your task title
2. Add task details in the "What is your task" textarea
3. Click "Create Task"
4. Task will be saved as `TaskTitle.txt` in the `/files` directory

### Viewing a Task
1. Click "Read More!" on any task card
2. View the full task content
3. Use "Go Back to Home" to return

### Editing a Task Name
1. Click "edit filename" on any task card
2. Enter the new name (without .txt extension)
3. Click "Update Name"
4. File will be renamed and you'll return to home

## ⚠️ Important Notes

### File Naming Convention
- Titles with spaces are converted to single words (e.g., "My Task" → "MyTask.txt")
- All files are saved with `.txt` extension
- Duplicate titles will overwrite existing files

### Error Handling
- Basic error handling for file operations
- Server errors return HTTP 500 status
- Console logging for debugging

### Security Considerations
- No input validation or sanitization
- No authentication system
- Direct file system access
- Suitable for local development only

## 🔧 Potential Improvements

1. **Input Validation**: Sanitize user inputs
2. **Error Pages**: Custom error templates
3. **File Upload**: Support for different file types
4. **Search Feature**: Find tasks by content
5. **User Authentication**: Multi-user support
6. **Database Integration**: Replace file system with database
7. **API Endpoints**: RESTful API for mobile apps
8. **File Organization**: Categorize tasks in folders

## 📄 License

This project is for educational purposes. Feel free to modify and distribute.

---
**Author**: Created as part of Backend Development Learning  
**Last Updated**: August 2025
#   t a s k - m a n a g e r 
 
 