require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" },
);

const PORT = process.env.PORT || 3000;

const app = express();

const sequelize = require("./db/db.js");
const expenseRoutes = require("./routes/expenseRoutes.js");
const userRouters = require("./routes/userRoutes.js");
const otpRoutes = require("./routes/otpRoutes.js");

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/expense", expenseRoutes);
app.use("/user", userRouters);
app.use("/user", otpRoutes);

app.get("/", (req, res) => {
  res.send("Hello JS");
});

sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL Connection is created...");

    app.listen(PORT, () => {
      console.log(`Server is running at PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MySQL Connection is failed...");
    console.log(err);
  });
