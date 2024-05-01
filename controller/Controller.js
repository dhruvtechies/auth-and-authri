

const userData = require("../modal/Modal");  //userData comes from model
require('dotenv').config()
const jwt = require("jsonwebtoken");
const sendMail = require("./nodemailer");
const bcrypt = require("bcrypt")
const crypto = require('crypto');

const createToken = (user) => {
  return jwt.sign({ user }, process.env.secreatkey, { expiresIn: "1h" });
};


const UserRegistration = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

      
           
    const existingUser = await userData.findOne({  where:{email} });
    if (existingUser) {
   
      return res.status(400).json({ error: res.__("signup.error1") });

    }


    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const id = Date.now().toString(10); //for making id unique

    const newUser = await userData.create({id, name, email, password: hashedPassword, address });

    // Generate JWT token
    const token = createToken(email);
    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ user: newUser, token ,message:res.__("signup.message1")});
  } catch (error) {
    res.status(500).json({ error: res.__("signup.error2") });
  }
};




const UserLogin = async (req, res) => {
  try {

    
    const { email, password } = req.body;


    
      
    const user = await userData.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({message:res.__( "login.error1")});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message:res.__( "login.error1") });
    }

    const token = createToken(user.id);

    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ user, token ,message:res.__("login.message1")});
  } catch (error) {
    res.status(500).json({ error: res.__("login.error2") });
  }
};





//  userget

const getUserById = async (req, res) => {
  try {
    const user = await userData.findByPk(req.params.id);
    res.status(201).json({ user, message: res.__('getuser.message1') });
  } catch (error) {
    res.status(500).json({
      error: res.__("getuser.error1")
    });
  }
};

//updateuser

const updateUser = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const updatedUser = await userData.update({ name, email, password, address }, { where: { id: req.params.id } });
    if (!updatedUser) {
      return res.status(404).json({ error: res.__("update.error1") });
    }
    res.status(200).json({ updatedUser, message: res.__('update.message1') });
  } catch (error) {
    res.status(500).json({ error: res.__(update.error2) });
  }
};


const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userData.destroy({ where: { id: req.params.id } });
    if (!deletedUser) {
      return res.status(404).json({ error: "delete.error1" });
    }
    res.status(200).json({ message: res.__('delete.message1') });
  } catch (error) {
    res.status(500).json({ error: res.__('delete.error2') });
  }
};
const Home = async (req, res) => {
  {
    res.send({ id: 1, name: res.__('MESSAGE'), response: res.__( "not_Found") })
  }
}






////////////////////////////////////////////////////////////  // for reset and update password



const forgetPassword = async (req, res) => {

  const { email } = req.body;
  try {
    const exitUser = await userData.findOne({ where: { email } });
    if (!exitUser) {
      return res.status(400).json({ message:res.__("forget.error1")  })
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    

    const Expiry = new Date();  //Expiry bo bala dal diya jo database me dal rakha ha
    Expiry.setMinutes(Expiry.getMinutes() + 10);
    const otpHash = await bcrypt.hash(otp, 10);// OTP expires in 1 min

    // Save OTP in the database or in memory cache for verification later
    await exitUser.update({ otp: otpHash, Expiry });

    await sendMail(email, otp);
    res.json({ message: res.__("forget.message1") });
  } catch (error) {
    console.error("error sending email:", error);
    res.status(500).json({ error: res.__("forget.error2 ") });
  }
}




const ResetPass = async (req, res) => {
  const { password, email, otp } = req.body;
  try {
    const user = await userData.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: res.__("reset.error1") });
    }
    console.log(user.otp)
    if (user.otp !== null) {
      const otpMatch = await bcrypt.compare(otp, user.otp);
      if (otpMatch && new Date() < user.Expiry) {
        const hashedPass = await bcrypt.hash(password, 10);
        await user.update({ password: hashedPass, otp: null, Expiry: null });
        return res.status(200).json({ message: res.__("reset.message1") });
      }
    }
    return res.status(400).json({ message:res.__("reset.error2") });

  } catch (error) {
    res.status(500).json({ error: res.__("reset.error3") });
  }
};



module.exports = { UserRegistration, UserLogin,Home, getUserById, updateUser, deleteUser, ResetPass, forgetPassword };









