const express = require("express");
const mysql = require('mysql2');
const app = express();
const session = require('express-session');
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;

mongoose.connect("mongodb+srv://tlalwani2023:PImZNx6Lrr3kJrdM@passwordmanager-tanay.qa62c.mongodb.net/?retryWrites=true&w=majority&appName=PasswordManager-Tanay", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("Error connecting to MongoDB Atlas", err));


const auth=require("./models/auth.js")
const Password=require("./models/password.js")

app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: false, 
    cookie: { maxAge: 30 * 60 * 1000 } 
}));



function checkAuth(req, res, next) {
    if (req.session && req.session.isAuthenticated) {
        return next(); 
    }
    res.redirect("/"); // Redirect to login page
}
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Routes
app.get("/", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session: ", err);
        }
        res.render("index"); 
    });
});


app.post("/register", async(req, res) => {
    const { uuserName, upassword } = req.body;

    if (!uuserName || !upassword) {
        return res.render("index", { errorMessage: "Username and password are required." });
    }

    const id = uuidv4();  
    console.log(`Generated UUID: ${id}`);
    try {
        const existingUser = await auth.findOne({ username: uuserName });
        if (existingUser) {
            return res.render("index", { errorMessage: "Username already taken." });
        }

        const newUser = new auth({ username: uuserName, password: upassword, id });
        await newUser.save();

        req.session.isAuthenticated = true;
        req.session.userName = uuserName;
        req.session.userId = id;

        res.redirect("/password");
    } catch (err) {
        console.error("Error registering user: ", err);
        res.render("index", { errorMessage: "Server error while registering user, please try again later." });
    }
});
    



app.post("/login", async(req, res) => {
    const { uuserName, upassword } = req.body;
    console.log(uuserName);
    console.log(upassword);
    if (!uuserName || !upassword) {
        return res.render("index", { errorMessage: "Username and password are required." });
    }


    try {
        const user = await auth.findOne({ username: uuserName });
        if (!user) {
            return res.render("index", { errorMessage: "Wrong username." });
        }

        if (upassword !== user.password) {
            return res.render("index", { errorMessage: "Wrong password." });
        }

        req.session.isAuthenticated = true;
        req.session.userName = user.username;
        req.session.userId = user.id;

        res.redirect("/password");
    } catch (err) {
        console.error("Error logging in: ", err);
        res.render("index", { errorMessage: "Server error, please try again later." });
    }
});


app.get("/password", checkAuth, async(req, res) => {
    const userid=req.session.userId;
    const username = req.session.userName;
    try {
        const passwords = await Password.find({ uid: userid }).sort({ website: 1 });
        res.render("password", { users: passwords, username });
    } catch (err) {
        console.error("Error fetching passwords: ", err);
        res.status(500).send("Server error");
    }
});

app.post("/password", checkAuth, async(req, res) => {
    const { website, username, password } = req.body;
    const rid = uuidv4();
    const userid=req.session.userId;
    try {
        const newPassword = new Password({ id:rid, website:website, userName: username, password:password, uid: userid });
        await newPassword.save();
        res.redirect("/password");
    } catch (err) {
        console.error("Error saving password: ", err);
        res.status(500).send("Server error");
    }
});

app.delete("/:id", checkAuth, async(req, res) => {
    const { id } = req.params;

    try {
        await Password.deleteOne({ id });
        res.redirect("/password");
    } catch (err) {
        console.error("Error deleting password: ", err);
        res.status(500).send("Server error");
    }
});

app.patch("/:id", checkAuth,async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    try {
        await Password.updateOne({ id:id }, { password: newPassword });
        res.redirect("/password");
    } catch (err) {
        console.error("Error updating password: ", err);
        res.status(500).send("Server error");
    }
});

app.post("/redirect", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect("/"); 
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});




