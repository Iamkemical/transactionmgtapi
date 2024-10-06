const { processWalletTransaction,
     processWalletToWalletTransaction,
    getWalletAndTransactionHistory 
}
    = require('../controllers/walletController');
const { authentication } = require('../controllers/authController');

const router = require('express').Router();

/**
 * @swagger
 * /api/v1/wallet/process-wallet-transaction:
 *   post:
 *     summary: Process deposit and withdrawal on wallet
 *     tags: [Wallets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionType:
 *                 type: string
 *                 example: 0-Deposit, 1-Withdrawal
 *               narration:
 *                 type: string
 *                 example: Deposit for John Doe
 *               amount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Transaction processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Transaction processed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactionReference:
 *                       type: number
 *                       example: 1
 *                     amount:
 *                       type: number
 *                       example: 5000
 *                     transactionType:
 *                       type: string
 *                       example: 1
 */
router.route('/process-wallet-transaction').post(authentication, processWalletTransaction);

/**
 * @swagger
 * /api/v1/wallet/wallet-to-wallet-transfer:
 *   post:
 *     summary: Process wallet to wallet transfer
 *     tags: [Wallets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destinationReference:
 *                 type: string
 *                 example: 9274844473
 *               narration:
 *                 type: string
 *                 example: Transfer to John Doe
 *               amount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Transaction processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Transaction processed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactionReference:
 *                       type: number
 *                       example: 1
 *                     amount:
 *                       type: number
 *                       example: 5000
 *                     transactionType:
 *                       type: string
 *                       example: 1
 */
router.route('/wallet-to-wallet-transfer').post(authentication, processWalletToWalletTransaction);

/**
 * @swagger
 * /api/v1/wallet/wallet-transaction-history:
 *   get:
 *     summary: Retrieve wallet and transaction history
 *     tags: [Wallets]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The number of the page to retrieve
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: The size of the page to retrieve
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: datetime
 *         description: The start date of the page to retrieve
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: datetime
 *         description: The end date of the page to retrieve
 *       - in: query
 *         name: isMonthlyStatement
 *         schema:
 *           type: integer
 *         description: Retrieve montly statement
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: The month of the page to retrieve
 *     responses:
 *       200:
 *         description: Wallet and transaction history fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Wallet and transaction history fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                        id:
 *                          type: number
 *                          example: 1
 *                        sourceReference:
 *                          type: string
 *                          example: 9274844473
 *                        destinationReference:
 *                          type: string
 *                          example: 1453715652
 *                        amount:
 *                          type: number
 *                          example: 5000
 *                        transactionType:
 *                          type: string
 *                          example: 1
 *                        narration:
 *                          type: string
 *                          example: Transfer to John Doe
 *                        month:
 *                          type: number
 *                          example: 10
 */
router.route('/wallet-transaction-history').get(authentication, getWalletAndTransactionHistory);

module.exports = router;