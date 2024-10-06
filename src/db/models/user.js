'use strict';

const {
  Model,
  Sequelize,
  DataTypes
} = require('sequelize');

const wallet = require('./wallet');

const bycrpt = require('bcrypt');
const AppError = require('../../middlewares/appErrorHandler');

const {sequelize} = require('../../config/database');

const user = sequelize.define('users', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userType: {
    type: DataTypes.ENUM('0', '1', '2'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'userType cannot be null'
      },
      notEmpty: {
        msg: 'userType cannot be empty'
      }
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'firstName cannot be null'
      },
      notEmpty: {
        msg: 'firstName cannot be empty'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'lastName cannot be null'
      },
      notEmpty: {
        msg: 'lastName cannot be empty'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'email cannot be null'
      },
      notEmpty: {
        msg: 'email cannot be empty'
      },
      isEmail: {
        msg: 'Invalid email address'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'password cannot be null'
      },
      notEmpty: {
        msg: 'password cannot be empty'
      }
    }
  },
  confirmPassword: {
    type: DataTypes.VIRTUAL,
    set(value) {
      if(this.password.length < 6) {
        throw new AppError('Password must be at least 6 characters long', 400);
      }
      if(value === this.password) {
        const hashPassword = bycrpt.hashSync(value, 10);
        this.setDataValue('password', hashPassword);
    } else {
      throw new AppError('Passwords do not match', 400);
    }
  }
},
  permanentAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'permanentAddress cannot be null'
      },
      notEmpty: {
        msg: 'permanentAddress cannot be empty'
      }
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'phoneNumber cannot be null'
      },
      notEmpty: {
        msg: 'phoneNumber cannot be empty'
      }
    }
  },
  bvn: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'bvn cannot be null'
      },
      notEmpty: {
        msg: 'bvn cannot be empty'
      }
    }
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'country cannot be null'
      },
      notEmpty: {
        msg: 'country cannot be empty'
      }
    }
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('0', '1', '2'),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'gender cannot be null'
      },
      notEmpty: {
        msg: 'gender cannot be empty'
      }
    }
  },
  dateOfBirth: {
    allowNull: true,
    type: DataTypes.DATE
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
},{
  paranoid: true  
});

user.hasOne(wallet, { foreignKey: 'userId' });
wallet.belongsTo(user, {
    foreignKey: 'userId',
});

module.exports = user;