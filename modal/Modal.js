const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequlize');

const crypto=require('crypto');
const userData = sequelize.define('users', {

  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    autoIncrement: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  address:{
    type:DataTypes.STRING,
    allowNull: false,
  },
  otp:{
    type:DataTypes.STRING,
    allowNull:true,
  },
  Expiry:{
    type:DataTypes.DATE,
    allowNull:true,
  }

});
  

module.exports = userData;