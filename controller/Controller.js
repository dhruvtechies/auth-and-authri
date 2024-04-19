const {where }=require("sequelize" )///////////////// where?

const userData=require("../modal/Modal");  //userData comes from model

const jwt = require("jsonwebtoken");


// creation of token

const createToken =(user) =>{
    return jwt.sign({ userId: user._id }, process.env.secreatkey, { expiresIn: "1h" });
};

const UserRegistration =async (req,res) =>{
    try{
        const {name,email,password,address }=req.body;
        const userreg =await userData.create({name,email,password,address});
        const token = createToken(userreg);
        res.cookie('token', token, {httpOnly: true});// for apply cookies
        res.status(201).json({ token, userreg,message:res.__('create-message') });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    
    // Useerlogin

    const UserLogin = async (req, res) => {
        const { email, password } = req.body;
        try {
          const user = await userData.findOne({where:{ email} });
          if (user && user.password === password) {
            const token = createToken(user);
            res.cookie('token', token, {httpOnly: true});
            res.status(200).json({ token, user,message:res.__('login-message') });
          } else {
            res.status(401).json({ error: "Invalid User" });
          }
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };

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
      
      module.exports = { UserRegistration, UserLogin,HomeController,getUserById,updateUser,deleteUser};
