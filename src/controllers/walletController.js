const walletRepo = require('../db/models/wallet');
const user = require('../db/models/user');
const walletTransactionRepo = require('../db/models/wallettransaction');

const AppError = require('../middlewares/appErrorHandler');
const { Op, QueryTypes, sequelize } = require('../config/database');

const catchAsync = require('../middlewares/errorHandler');
const { Sequelize } = require('sequelize');

async function updateWallet(amount, transactionType, wallet) {
    const balance = Number(wallet.balance);
    var totalBalance = 0;
    if(transactionType === '1') {
        totalBalance = balance - amount;
        wallet.balance = totalBalance.toString();
    }
    if(transactionType === '0') {
        totalBalance = balance + amount;
        wallet.balance = totalBalance.toString();
    }
    const updatedWallet = await wallet.save();

    return updatedWallet;
};

const processWalletTransaction = catchAsync(async (req, res, next) => {
    const { transactionType, narration, amount} = req.body;
    const userId = req.user.id;

    if(amount <= 0) {
        return next(new AppError('Amount cannot be less than or equal to zero', 400));
    }

    if(!narration) {
        return next(new AppError('Narration cannot be empty', 400));
    }

    if(!['0', '1'].includes(transactionType)) {
        return next(new AppError('Invalid transaction type', 400));
    }

    const existingWallet = await walletRepo.findOne({where: {userId: userId} });

    if(!existingWallet) {
        return next(new AppError('Sorry! Wallet with provided details does not exist', 404));
    }

    const existingPoolWallet = await walletRepo.findOne({ where: { [Op.and]: [{ isPoolWallet: true }] }});

    if(!existingPoolWallet) {
        return next(new AppError('Sorry! Wallet with provided details does not exist', 404));
    }

    if (existingPoolWallet.balance > amount) {
        if(existingWallet.balance < amount && transactionType === '1') {
            return next(new AppError('Insufficient balance in your wallet', 400));
        }
        
        const updatedWallet = await updateWallet(amount,
                                                 transactionType,
                                                 existingWallet);
        const updatedPoolWallet = await updateWallet(amount,
                                                     transactionType === '0' ? '1' : '0',
                                                     existingPoolWallet);
        
        if(!updatedPoolWallet || !updatedWallet) {
            return next(new AppError('An error occurred while trying to process your transaction', 500));
        }

        var walletTranx = await walletTransactionRepo.create({
            userId: userId,
            transactionType: transactionType,
            amount: amount,
            narration: narration,
            destinationReference: existingPoolWallet.reference,
            sourceReference: existingWallet.reference,
        });

        if (!walletTranx) {
            return next(new AppError('An error occurred while processing your transaction', 500));
        }

        return res.status(200).json({
            status: 'Success',
            message: 'Transaction processed successfully',
            data: {
                transactionReference: walletTranx.id,
                amount: walletTranx.amount,
                transactionType: transactionType,
            }
        });
    }
});

const processWalletToWalletTransaction = catchAsync(async (req, res, next) => {
    const { destinationReference, amount, narration } = req.body;
    const userId = req.user.id;

    if(!destinationReference) {
        return next(new AppError('Destination reference cannot be empty', 400));
    }
    if(!narration) {
        return next(new AppError('Narration cannot be empty', 400));
    }

    if(amount <= 0) {
        return next(new AppError('Amount cannot be less than or equal to zero', 400));
    }

    const existingWallet = await walletRepo.findOne({where: {userId: userId}});

    if(!existingWallet) {
        return next(new AppError('Sorry! Wallet with provided details does not exist', 404));
    }

    const existingDestinationWallet = await walletRepo.findOne({ where: { reference: destinationReference}});

    if(!existingDestinationWallet) {
        return next(new AppError('Sorry! Wallet with provided details does not exist', 404));
    }

    if(existingWallet.balance >= amount) {
        const updatedSourceWallet = await updateWallet(amount, '1', existingWallet);
        const updatedDestinationWallet = await updateWallet(amount, '0', existingDestinationWallet); 
    } else {
        return next(new AppError('Insufficient balance in your wallet', 400));
    }

    var walletTranx = await walletTransactionRepo.create({
        userId: userId,
        transactionType: '2',
        amount: amount,
        narration: narration,
        destinationReference: existingWallet.reference,
        sourceReference: existingDestinationWallet.reference,
    });

    if (!walletTranx) {
        return next(new AppError('An error occurred while processing your transaction', 500));
    }

    return res.status(200).json({
        status: 'Success',
        message: 'Transaction processed successfully',
        data: {
            transactionReference: walletTranx.id,
            amount: walletTranx.amount,
            transactionType: '2',
        }
    });
});

const getWalletAndTransactionHistory = catchAsync(async (req, res, next) => {
    const { endDate, startDate, isMonthlyStatement } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const month = parseInt(req.query.month, 10) || 0;
    const userId = req.user.id;

    const existingWallet = await walletRepo.findOne({ where: { userId: userId } });

    if (!existingWallet) {
        return next(new AppError('Sorry! Wallet with provided details does not exist', 404));
    }

    let baseQuery = `SELECT id, "sourceReference", "destinationReference", amount, "transactionType", 
                    narration, EXTRACT(MONTH FROM "createdAt") AS month FROM public."walletTransactions" WHERE 
                    ("sourceReference" = $sourceReference OR "destinationReference" = $destinationReference)`;

    const totalCount = await walletTransactionRepo.count({
        where: {
            [Op.or]: [
                { sourceReference: existingWallet.reference },
                { destinationReference: existingWallet.reference }
            ]
        }
    });

    if (isMonthlyStatement == 1 && month) {
        baseQuery += ` AND EXTRACT(MONTH FROM "createdAt") = $month`;
    } else if (startDate && endDate) {
        baseQuery += ` AND "createdAt" BETWEEN $startDate AND $endDate`;
    }

    const offset = (page - 1) * pageSize;
    baseQuery += ` ORDER BY "createdAt" DESC LIMIT $pageSize OFFSET $offset`;

    const [results, metadata] = await sequelize.query(baseQuery, {
        bind: {
            sourceReference: existingWallet.reference,
            destinationReference: existingWallet.reference,
            month: month,
            offset: offset,
            pageSize: pageSize,
            startDate: startDate,
            endDate: endDate
        }
    });

    return res.status(200).json({
        status: 'Success',
        message: 'Wallet and transaction history fetched successfully',
        data: {
            balance: existingWallet.balance,
            reference: existingWallet.reference,
            transactionHistory: results,
            totalCount: totalCount
        }
    });
});


module.exports = {
    processWalletTransaction,
    processWalletToWalletTransaction,
    getWalletAndTransactionHistory
};