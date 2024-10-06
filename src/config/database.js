const { Sequelize, Op, QueryTypes } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./config');

const sequelize = new Sequelize(config[env]);

module.exports = {sequelize, Op, QueryTypes};