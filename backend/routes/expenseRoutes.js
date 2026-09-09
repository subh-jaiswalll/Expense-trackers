const express = require("express");

const router = express.Router();

const expenseController = require("../controller/expenseController.js");

const authenticate = require("../middleware/auth.js");


router.get("/", authenticate, expenseController.getExpense);

router.post("/", authenticate, expenseController.createExpense);

router.get("/:id", authenticate, expenseController.getExpenseById);

router.put("/:id", authenticate, expenseController.updateExpense);

router.delete("/:id", authenticate, expenseController.deleteExpense);


module.exports = router;