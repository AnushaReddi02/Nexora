// We bring in (import) the express package to create our server
const express = require('express');

// Import the `method-override` package
// This allows HTML forms (which only support GET & POST) 
// to simulate other HTTP methods like PATCH or DELETE
const methodOverride = require("method-override");

// Create our app (this is like creating the main server object)
const app = express();


// Import the `v4` method from the `uuid` library and rename it as `uuidv4`
// `uuidv4()` generates a unique random identifier (Universally Unique Identifier, version 4)
// We usually use this to assign unique IDs to posts, users, comments, etc.
const {v4 : uuidv4} = require("uuid");

// We bring in the path package because it helps us work with file and folder paths
// Example: it makes sure the app can find "views" or "public" folder no matter where we run the project
const path = require("path");


// Tell Express to use method-override middleware
// "_method" is the query parameter that tells Express which HTTP method to use
// Example: a form with `action="/posts/123?_method=PATCH"` will be treated as a PATCH request
app.use(methodOverride("_method"));


// This line allows our app to read form data (from <form> in HTML)
// extended:true means it can read more complex objects if needed
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Tell our app that we will use EJS as the template engine
// EJS lets us write HTML pages mixed with JS code
app.set("view engine", "ejs");

// Tell our app where to find static files (CSS, images, JS)
// Here we say: "Look in the 'public' folder for these files"
app.use(express.static(path.join(__dirname, "public")));

// Tell our app where to find our EJS templates (HTML-like files)
// Here we say: "Look in the 'views' folder for all EJS pages"
app.set("views", path.join(__dirname, "views"));

// Choose the port where our server will run (8080 in this case)
// Port is like a door where requests come in
const port = 8080;

// Data 
// Sample posts data
let posts = [
  {
    Id : uuidv4(),
    username: "curiousCat",
    content: "Why do programmers always prefer dark mode?"
  },
  {
    Id : uuidv4(),
    username: "techGuru",
    content: "Because light attracts bugs. 🐛😂"
  },
  {
    Id : uuidv4(),
    username: "bookLover",
    content: "Can someone suggest me the best books to learn JavaScript?"
  },
  {
    Id : uuidv4(),
    username: "codeWizard",
    content: "Start with 'Eloquent JavaScript' — it's a classic for beginners."
  },
  {
    Id : uuidv4(),
    username: "sarcasticSoul",
    content: "Is it okay if I copy-paste code from Stack Overflow?"
  },
  {
    Id : uuidv4(),
    username: "logicLord",
    content: "Sure… as long as you also copy the bugs that come with it 😏"
  }
];


// This creates a route for the homepage ("/")
// When someone goes to http://localhost:8080/ in the browser,
// this function will run
app.get("/",(req,res)=>{

  // req (request) → contains details about what the user asked for
  // res (response) → lets us send something back to the user

  // Here we are sending plain text back as a response
  res.send("Request is being heard successfully!!");
});

app.get("/posts",(req,res)=>{
  res.render("index.ejs",{posts});
});

app.get("/posts/new",(req,res)=>{
  res.render("createPost");

});

app.post("/posts",(req,res)=>{
  // let {username,content} = req.body;

  let {username,content} = req.body;  // let post = req.body;
  let  Id = uuidv4();
  posts.push({Id,username,content});
  console.log(req.body);
  res.redirect("/posts");
});

app.get("/posts/:id",(req,res)=>{
  let {id} = req.params;
  let post = posts.find((p) => p.Id.toString() === id.toString());
  console.log(id);
  res.render("postWithId",{post,posts});
});


// uPDATING SPECIFIC INFORMATION IN A POST => POST
app.patch("/posts/:id",(req,res)=>{
    let {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => p.Id.toString() === id.toString());
  if (!post) {
    return res.status(404).send("❌ Post not found");
  }
   post.content = newContent;
    console.log(post); 
    res.redirect("/posts");
});

app.get("/posts/:id/edit",(req,res)=>{
  let {id} = req.params;
 let post = posts.find((p) => p.Id.toString() === id.toString());
  res.render("edit.ejs",{post});
});

app.delete("/posts/:id",(req,res)=>{
  let {id} = req.params;
  posts = posts.find((p) => p.Id.toString() === id.toString());   //filters all the posts with ids not equal to p.Id and place them in posts array.
  res.redirect("/posts");
})
// Start our server and print a message when it is ready
app.listen(port, () => {
  console.log(`Request is being heard at port ${port}`);
});
