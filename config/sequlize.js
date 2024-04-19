const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('auth and authr', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;