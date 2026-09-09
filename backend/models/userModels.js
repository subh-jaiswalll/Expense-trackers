
const {DataTypes} = require('sequelize');

const sequelize = require('../db/db.js')

const User = sequelize.define('User', {

    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        
    },

    name :{
        type : DataTypes.STRING,
        allowNull : false
    },

    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true

    },

    password : {
        type : DataTypes.STRING,
        allowNull : false
    },

    isPremium : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
        allowNull : false
    },

    resetPasswordToken : {
        type : DataTypes.STRING,
        allowNull : true
    },

    resetPasswordExpires : {
        type : DataTypes.DATE,
        allowNull : true
    }

})

module.exports = User;