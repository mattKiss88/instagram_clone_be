require("dotenv").config();

module.exports = {
  development: {
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    port: process.env.DB_PORT,
    // host: process.env.DB_HOST,
    dialect: "mysql",
    set_charset: "utf8mb4",
  },
  test: {
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    port: process.env.DB_PORT,
    dialect: "mysql",
    set_charset: "utf8mb4",
  },
  staging: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    set_charset: "utf8mb4",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    set_charset: "utf8mb4",
  },
};
