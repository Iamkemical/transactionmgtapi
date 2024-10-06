'use strict';

const {
  Model,
  Sequelize,
  DataTypes
} = require('sequelize');


const {sequelize} = require('../../config/database');

const wallet = sequelize.define('wallets', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'userId cannot be null'
      },
      notEmpty: {
        msg: 'userId cannot be empty'
      }
    }
  },
  isPoolWallet: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    validate: {
        isIn: {
                args: [[true, false]],
                msg: 'isPoolWallet value must be true or false',
              },
    },
  },
  balance: {
    type: DataTypes.DECIMAL(18, 4),
    allowNull: false,
    defaultValue: 0,
    validate: {
      notNull: {
        msg: 'balance cannot be null'
      },
      notEmpty: {
        msg: 'balance cannot be empty'
      }
    }
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE
  }
},
{
  paranoid: true
});



module.exports = wallet;