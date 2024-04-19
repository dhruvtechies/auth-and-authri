const express=require("express");
const userRoutes =require("./routes/Routes");
const sequelize =require("./config/sequlize");
const cookieParser =require("cookie-parser");
require('dotenv').config(); //////////////env file ko lene ke liye


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
});

app.use (i18n.init);

// use jsonformate data

app.use (express.json());
app.use("/",userRoutes);

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

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});