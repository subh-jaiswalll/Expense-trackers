const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'ExpenseProject',
    'root',
    'Jaiswal@2005',
    {
        host : 'localhost',
        dialect : 'mysql',
        logging : false
    }
)


module.exports = sequelize;