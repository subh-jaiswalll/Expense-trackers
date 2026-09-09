require("dotenv").config();

const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs')

const PORT = 3000;

const app = express();

const sequelize = require('./db/db.js');
const expenseRoutes = require('./routes/expenseRoutes.js')
const userRouters = require('./routes/userRoutes.js')
const otpRoutes = require('./routes/otpRoutes.js')


app.use(express.json())
app.use(cors())

app.use('/expense', expenseRoutes);
app.use('/user', userRouters);
app.use('/user', otpRoutes);


app.get('/', (req, res) => {
    res.send("Hello JS")
})

const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');


sequelize.authenticate()
    .then(() => {
        console.log("MySQL Connection is created...");

        https.createServer({key : privateKey, cert : certificate}, app ).listen(PORT, () => {
            console.log(`Server is running at PORT ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MySQL Connection is failed...");
        console.log(err);
    });