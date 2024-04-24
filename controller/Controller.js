//const {where }=require("sequelize" )///////////////// where?

const userData=require("../modal/Modal");  //userData comes from model
require('dotenv').config()
const jwt = require("jsonwebtoken");
const sendMail = require("./nodemailer");
 const bcrypt=require("bcrypt")

// creation of token

const createToken =(user) =>{
    return jwt.sign({ user }, process.env.secreatkey, { expiresIn: "1h" });
};

// const UserRegistration =async (req,res) =>{
//     try{
//         const {name,email,password,address }=req.body;
//         const userreg =await userData.create({name,email,password,address});
//         const token = createToken(userreg);
//         res.cookie('token', token, {httpOnly: true});// for apply cookies
//         res.status(201).json({ token, userreg,message:res.__('create-message') });
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     };

const UserRegistration = async (req, res) => {
  try {
      const { name,email,password,address } = req.body;
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userData.create({ name,email,password: hashedPassword,address });
      
      // Generate JWT token
      const token = createToken(email);
      res.cookie('token', token,{httpOnly: true});
      res.status(201).json({ user: newUser, token });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
    
  


    const UserLogin = async (req, res) => {
      try {
          const { email, password } = req.body;
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
            const user = await  userData.findByPk(req.params.id);
            res.status(201).json({user,message:res.__('find-message') });
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    };
   
    const updateUser = async (req, res) => { 
        try {
          const { name,email,password,address } = req.body;
          const updatedUser= await userData.update({ name, email, password ,address}, { where:{id:req.params.id} });
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
          const deletedUser = await userData.destroy({where:{id:req.params.id}});
          if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
          }
          res.status(200).json({ message: res.__('delete-message') });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };
      const HomeController = async (req, res) => {{
        res.send({id:1,name:res.__('MESSAGE'),response:res.__('home')})
      }}
      





    ////////////////////////////////////////////////////////////  // for reset and update password



 const forgetPassword =async (req,res) =>{

  const {email}=req.body;
  try{
    const exitUser = await userData.findOne({where: {email}});
    if(!exitUser){
      return res.status(400).json({message:"username doesnt exist"})
    }
    const token =createToken(email,'60m');
    await sendMail(email,token);
    res.json({message: "Email sent successfully"});
  }catch(error){
    console.error("error sending email:",error);
    res.status(500).json({error:"Internal Server Error"});
  }
}


const ResetOutput =async (req,res) =>{
  const {token} = req.query;

  if (!token){
    return res.status(401).json({message:"please sign in first "});
  }
  jwt.verify(token,process.env.secreatkey,(err) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized user' });
  }
  res.cookie('token', token, { httpOnly: true }).json({
      message: "Now you can reset your password"
  })
});
}

  const ResetPass =async(req,res) => {
    try{
      const { token } = req.cookies;
      const { password } = req.body
      const decoded = jwt.verify(token, process.env.secreatkey);
      console.log(decoded);
      const hashedPass = await bcrypt.hash(password, 10);
      await userData.update({ password: hashedPass }, { where: { email: decoded.user } });
      res.status(200).json({ message: res.__('prod_update_message') });
  } catch (error) {
      res.status(401).json({ error: error.message });
  }
    }
  

 
    module.exports = { UserRegistration, UserLogin,HomeController,getUserById,updateUser,deleteUser,ResetPass,ResetOutput,forgetPassword};









