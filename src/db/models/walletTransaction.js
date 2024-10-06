'use strict';

const {
  Model,
  Sequelize,
  DataTypes
} = require('sequelize');


const {sequelize} = require('../../config/database');

const walletTransaction = sequelize.define('walletTransactions', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  sourceReference: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'sourceReference cannot be null'
      },
      notEmpty: {
        msg: 'sourceReference cannot be empty'
      }
    }
  },
  destinationReference: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'destinationReference cannot be null'
      },
      notEmpty: {
        msg: 'destinationReference cannot be empty'
      }
    }
  },
  narration: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'narration cannot be null'
      },
      notEmpty: {
        msg: 'narration cannot be empty'
      }
    }
  },
  amount: {
    type: DataTypes.DECIMAL(18, 4),
    allowNull: false,
    defaultValue: 0,
    validate: {
      notNull: {
        msg: 'amount cannot be null'
      },
      notEmpty: {
        msg: 'amount cannot be empty'
      }
    }
  },
  transactionType: {
    type: DataTypes.ENUM('0', '1', '2'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'transactionType cannot be null'
      },
      notEmpty: {
        msg: 'transactionType cannot be empty'
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

module.exports = walletTransaction;