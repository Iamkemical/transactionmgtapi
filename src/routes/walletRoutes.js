const { processWalletTransaction,
     processWalletToWalletTransaction,
    getWalletAndTransactionHistory 
}
    = require('../controllers/walletController');
const { authentication } = require('../controllers/authController');

const router = require('express').Router();

router.route('/process-wallet-transaction').post(authentication, processWalletTransaction);
router.route('/wallet-to-wallet-transfer').post(authentication, processWalletToWalletTransaction);
router.route('/wallet-transaction-history').get(authentication, getWalletAndTransactionHistory);

module.exports = router;