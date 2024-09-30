// Import some dependencies/packages

//HTTP framework for handling requests
const express = require('express');
const app = express();
//DBMS Mysql
const mysql = require('mysql2');
//cross Origin Resource Sharing
const cors = require('cors');
//Environment variable doc
const dotenv = require('dotenv');

//introducing them to each other so that they can interact
app .use(express.json());
app.use(cors());
dotenv.config();

//connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

//Check if there is a connection
db.connect((err)=>{
    //if no connection
    if(err) {return console.log('Error connecting to MSQL');
}

    //If connect works successfully
    console.log("Connected to MYSQL as id:", db.threadId);
})


// < YOUR code goes down here

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//patients.ejs file is in views folder

app.get('/patients', (req, res) => { 
    // 1. Retrieve patients data from the database
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error Retrieving Data');
        } else {
            // Display the records to the browser
            res.render('patients', { results: results });
        }
    });
});

app.get('/providers', (req, res) => { 
    //2. Retrieve providers data from the database
    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error Retrieving Data');
        } else {
            // Display the records to the browser
            res.render('providers', { results: results });
        }
    });
});

app.get('/patients/filter', (req, res) => {
    const firstName = req.query.first_name; // 3. Get first name from query parameters
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [firstName], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error Retrieving Data');
        } else {
            // Display the filtered records to the browser
            res.render('patients', { results: results });
        }
    });
});

app.get('/providers/filter', (req, res) => {
    const specialty = req.query.specialty; // 4.Get specialty from query parameters
    db.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error Retrieving Data');
        } else {
            // Display the filtered records to the browser
            res.render('providers', { results: results });
        }
    });
});

//Your code goes up there


//start the server
app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port ${process.env.PORT}`);

    //sending a message to the browser
    console.log('Sending message to the browser')
    app.get('/', (req,res) => {
        res.send('Server Started Successfully')
    });
});

