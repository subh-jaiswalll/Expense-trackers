require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "mysql"
  },

  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "mysql"
  },

  production: {
    username: process.env.AIVEN_USERNAME,
    password: process.env.AIVEN_PASSWORD,
    database: process.env.AIVEN_NAME,
    host: process.env.AIVEN_HOST,
    port: process.env.AIVEN_PORT,
    dialect: process.env.DB_DIALECT || "mysql"
  }
};