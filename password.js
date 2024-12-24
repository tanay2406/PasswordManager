const express = require("express");
const mysql = require('mysql2');
const app = express();
const port = 8080;
const path = require("path");
var methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'passwordManager',
    password: 'ppp@12345'
});

// GET route for displaying passwords
app.get("/password", (req, res) => {
    let q = `SELECT * FROM password`;

    try {
        connection.query(q, (err, users) => {
            if (err) {
                console.error('Error executing query: ', err);
                return;
            }
            console.log(users);  // Log the retrieved users
            res.render("password.ejs", { users }); // Render the password.ejs with user data
        });
    } catch (err) {
        console.log('Error in try-catch: ', err);
    }
});

// DELETE route for removing a password
app.delete("/:id", (req, res) => {
    let { id } = req.params;

    let q = `DELETE FROM password WHERE id = ?`;

    try {
        connection.query(q, [id], (err, result) => {
            if (err) {
                console.error('Error executing query: ', err);
                return;
            }
            console.log(result);  // Log the result of the deletion
            res.redirect("/password"); // Redirect after deletion
        });
    } catch (err) {
        console.log('Error in try-catch: ', err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

