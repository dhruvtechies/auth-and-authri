//const {where }=require("sequelize" )///////////////// where?

const userData = require("../modal/Modal");  //userData comes from model
require('dotenv').config()
const jwt = require("jsonwebtoken");
const sendMail = require("./nodemailer");
const bcrypt = require("bcrypt")
const crypto = require('crypto');

//  for validator 

//const { body, validationResult } = require('express-validator');

// creation of token

const createToken = (user) => {
  return jwt.sign({ user }, process.env.secreatkey, { expiresIn: "1h" });
};


const UserRegistration = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

      //  // Validate user input

      //  const errors = validationResult(req);
      //  if (!errors.isEmpty()) {
      //    return res.status(400).json({ error: errors.array()[0].msg });
      //  }

//for making password strong

// const passwordStr = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])$/;
// if (!passwordStr.test(password)) {
//   return res.status(400).json({ error: 'Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.' });
// }

  // Check if the email is already registered for validator
           
    const existingUser = await userData.findOne({  where:{email} });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }


    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userData.create({ name, email, password: hashedPassword, address });

    // Generate JWT token
    const token = createToken(email);
    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const UserLogin = async (req, res) => {
  try {

    
    const { email, password } = req.body;


    // Validate user input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
      
    const user = await userData.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(user.id);

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





//  userget
const getUserById = async (req, res) => {
  try {
    const user = await userData.findByPk(req.params.id);
    res.status(201).json({ user, message: res.__('find-message') });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const updatedUser = await userData.update({ name, email, password, address }, { where: { id: req.params.id } });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ updatedUser, message: res.__('update-message') });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userData.destroy({ where: { id: req.params.id } });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: res.__('delete-message') });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const HomeController = async (req, res) => {
  {
    res.send({ id: 1, name: res.__('MESSAGE'), response: res.__('home') })
  }
}






////////////////////////////////////////////////////////////  // for reset and update password



const forgetPassword = async (req, res) => {

  const { email } = req.body;
  try {
    const exitUser = await userData.findOne({ where: { email } });
    if (!exitUser) {
      return res.status(400).json({ message: "username doesnt exist" })
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    // const timeExpire=new Date();
    // timeExpire.setMinutes(timeExpire.getMinutes()+10);
    // const otpHash=await bcrypt.hash(otp,10);// OTP expires in 1 min

    //     // Save OTP in the database or in memory cache for verification later
    //     await exitUser.update({ otp:otpHash, Expiry: timeExpire });  

    const Expiry = new Date();  //Expiry bo bala dal diya jo database me dal rakha ha
    Expiry.setMinutes(Expiry.getMinutes() + 10);
    const otpHash = await bcrypt.hash(otp, 10);// OTP expires in 1 min

    // Save OTP in the database or in memory cache for verification later
    await exitUser.update({ otp: otpHash, Expiry });

    await sendMail(email, otp);
    res.json({ message: "otp sent successfully" });
  } catch (error) {
    console.error("error sending email:", error);
    res.status(500).json({ error: "failed to send otp " });
  }
}




const ResetPass = async (req, res) => {
  const { password, email, otp } = req.body;
  try {
    const user = await userData.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Invalid user" });
    }
    console.log(user.otp)
    if (user.otp !== null) {
      const otpMatch = await bcrypt.compare(otp, user.otp);
      if (otpMatch && new Date() < user.Expiry) {
        const hashedPass = await bcrypt.hash(password, 10);
        await user.update({ password: hashedPass, otp: null, Expiry: null });
        return res.status(200).json({ message: "Password successfully updated" });
      }
    }
    return res.status(400).json({ message: "Invalid or expired OTP" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { UserRegistration, UserLogin, HomeController, getUserById, updateUser, deleteUser, ResetPass, forgetPassword };









