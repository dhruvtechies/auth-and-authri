 const { where } = require("sequelize");
 //const userData = require("../model/UserModel.js");
const jwt = require("jsonwebtoken");


const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; 
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
  
    jwt.verify(token,process.env.secreatkey, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Unauthorized: Invalid token" });
      }
      req.user = user;
      next();
    });
  };
  
  module.exports = authenticateToken;