const bcrypt = require('bcrypt');

module.exports = {
    up: (queryInterface, Sequelize) => {
        let password = process.env.ADMIN_PASSWORD;
        const hashPassword = bcrypt.hashSync(password, 10);
        return queryInterface.bulkInsert('users', [
            {
              userType: '0',
              firstName: 'Admin',
              lastName: 'User',
              email: process.env.ADMIN_EMAIL,
              permanentAddress: 'Lagos',
              phoneNumber: '+234800000000',
              bvn: '1234567891',
              country: 'NG',
              state: 'Lagos',
              gender: '0',
              password: hashPassword,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('user', { userType: '0' }, {});
    },
};