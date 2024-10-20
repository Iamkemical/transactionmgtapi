require("dotenv").config({ path: `${process.cwd()}/.env` });

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true, // Enable SSL
        rejectUnauthorized: false, // Disable SSL certificate validation (use with caution)
      },
    },
   pool: {
     max: 10,
     min: 0,
     acquire: 60000, // Increased acquire time
     idle: 10000
  },
    logging: console.log, 
    seederStorage: "sequelize",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
