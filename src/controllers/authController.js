const userRepo = require("../db/models/user");
const walletRepo = require("../db/models/wallet");
const jwtHandler = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppError = require('../middlewares/appErrorHandler');
const { Op } = require('../config/database');
const catchAsync = require('../middlewares/errorHandler');

const generateToken = (payload) => {
    return jwtHandler.sign(payload, process.env.JWT_SECRET_KEY,
                   { expiresIn: process.env.JWT_EXPIRES_IN });
};

function generateReference() {
    let result = '';
    const characters = '0123456789';
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const signup = catchAsync(async (req, res, next) => {
    const body = req.body;

    if(!['1', '2'].includes(body.userType)) {
        return next(new AppError('Invalid user type', 400));
    }

    if(!['1', '2'].includes(body.gender)) {
        return next(new AppError('Invalid gender', 400));
    }

    // const existingUser = await user.findOne({ where: { [Op.and]: [{ email: body.email }] }});

    // if(existingUser != null) {
    //     return next(new AppErrorHandler('User with the same email already exists', 400));
    // }

    const newUser = await userRepo.create({
        userType: body.userType,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
        permanentAddress: body.permanentAddress,
        bvn: body.bvn,
        dateOfBirth: body.dateOfBirth,
        gender: body.gender,
        country: body.country,
        state: body.state,
        phoneNumber: body.phoneNumber,
    });

    if(!newUser) {
        return next(new AppError('Unable to create user', 400));
    }

    const newWallet = async () => {
        return await walletRepo.create({
            userId: newUser.id,
            balance: 0,
            userId: newUser.id,
            reference: generateReference(),
            isPoolWallet: false,
        });
    }

    setImmediate(async() => {
        // Your background task
        await newWallet();
    });

    const token = generateToken({
        id: newUser.id
    });

    return res.status(201).json({
        status: 'Success',
        message: 'User created successfully',
        data: {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            token: token
        }
    });
    
});

const login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const existingUser = await userRepo.findOne({ where: { [Op.and]: [{ email }] }});

    if(existingUser == null || !await bcrypt.compare(password, existingUser.password)) {
        return next(new AppError('Invalid email or password', 400));
    }

    return res.status(200).json({
        status: 'Success',
        message: 'User logged in successfully',
        data: {
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            token: generateToken({
                id: existingUser.id
            })
        }
    });
});

const authentication = catchAsync(async (req, res, next) => {
    // 1. get the token from headers
    let idToken = '';
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Bearer asfdasdfhjasdflkkasdf
        idToken = req.headers.authorization.split(' ')[1];
    }
    if (!idToken) {
        return next(new AppError('Invalid credentials', 401));
    }
    // 2. token verification
    const tokenDetail = jwtHandler.verify(idToken, process.env.JWT_SECRET_KEY);
    // 3. get the user detail from db and add to req object
    const freshUser = await userRepo.findByPk(tokenDetail.id);

    if (!freshUser) {
        return next(new AppError('User does not exist', 400));
    }
    req.user = freshUser;
    return next();
});

module.exports = { 
    signup,
    login,
    authentication
};