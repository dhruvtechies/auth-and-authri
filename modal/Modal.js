const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequlize');

const userData = sequelize.define('users', {

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
    type:DataTypes.NUMBER,
    allowNull: false,
  }
});

module.exports = userData;
