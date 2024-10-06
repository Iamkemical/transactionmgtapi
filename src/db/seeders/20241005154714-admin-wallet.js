module.exports = {
    up: async (queryInterface, Sequelize) => {
        const email = process.env.ADMIN_EMAIL;
        const query = await queryInterface.sequelize.query(
          `SELECT id from users WHERE email='${email}';`
    );
        if(query) {
          function generateReference() {
            let result = '';
            const characters = '0123456789';
            for (let i = 0; i < 10; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        };
        var adminUserId = query[0][0].id;
        console.log(adminUserId);
          return queryInterface.bulkInsert('wallets', [
            {
              userId: adminUserId,
              balance: 100000000.00,
              reference: generateReference(),
              isPoolWallet: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
        ]);
        }
        
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('wallet', { userType: '0' }, {});
    },
};