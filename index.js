const express=require("express");
const userRoutes =require("./routes/Routes");
const sequelize =require("./config/sequlize");
const cookieParser =require("cookie-parser");
const crons =require("./cron/Crons");
require('dotenv').config(); //////////////env file ko lene ke liye

// express validator

const { body, validationResult } = require('express-validator');


const sendMail=require("./controller/nodemailer") //require nodemailer file

const port =7070;

const app =express();
app.use(cookieParser());

// for localization 

const path =require("path"); 
const {I18n}=require("i18n");
const { Sequelize } = require("sequelize");

const i18n =new I18n({
    locales: ['en','hi'],
    directory: path.join(__dirname,"translation"),
    defaultLocale : 'en',
    objectNotation: true
});

app.use (i18n.init);

// use jsonformate data

app.use (express.json());

app.use("/",userRoutes);

app.post('/send-mail',sendMail);  //for routes of nodemailer

//for validator

app.post('/submit', [

 

  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // If no errors, process the data
  const { email, password } = req.body;
  // Process the data further...
});





// syn the Sequelize

sequelize
.sync()
.then(() => {
  console.log("Connected to the database.");
})
.catch((error) => {
  console.error("Unable to connect to the database:", error);
});
 
// listening the port 
crons;
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});