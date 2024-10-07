require('dotenv').config({path: `${process.cwd()}/.env`});
const express = require('express');

const authRouter = require('./routes/authRoutes');
const walletRouter = require('./routes/walletRoutes');

const catchAsync = require('./middlewares/errorHandler');
const AppError = require('./middlewares/appErrorHandler');
const globalErrorHandler = require('./controllers/errorController');

const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*', // Allow all origins, or specify your allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

const swaggerSetup = require('./config/swagger')

swaggerSetup(app); // setup Swagger documentation

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
      status: 'Success',
      message: `TransactionMgtApi ${process.env.NODE_ENV} environment`,
      data: null
  });
});

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/wallet', walletRouter);

app.use('*', catchAsync(async (req, res, next) => {
  throw new AppError(`Can't find the path ${req.originalUrl} on this server`, 404);
}));

app.use(globalErrorHandler);


const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
    console.log('Server up and running on port', PORT);
});