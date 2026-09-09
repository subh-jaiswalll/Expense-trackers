const expenseModel = require("../models/expenseModels.js");


// ================= GET ALL EXPENSES =================

const getExpense = async (req, res) => {

    try {

        const expenses = await expenseModel.findAll({
            where: {
                userId: req.user.id
            }
        });

        return res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            expenses
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Error fetching expenses",
            error: err.message
        });
    }
};


// ================= GET EXPENSE BY ID =================

const getExpenseById = async (req, res) => {

    try {

        const { id } = req.params;

        const expense = await expenseModel.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Expense fetched successfully",
            expense
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Error fetching expense",
            error: err.message
        });
    }
};


// ================= CREATE EXPENSE =================

const createExpense = async (req, res) => {

    try {

        const {
            date,
            description,
            category,
            expense,
            income
        } = req.body;


        if (!description || !category) {

            return res.status(400).json({
                success: false,
                message: "Description and category are required"
            });
        }


        const newExpense = await expenseModel.create({

            date,
            description,
            category,
            expense,
            income,

            // Logged-in user's ID
            userId: req.user.id
        });


        return res.status(201).json({

            success: true,
            message: "Expense created successfully",
            expense: newExpense

        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Failed to create expense",
            error: err.message
        });
    }
};


// ================= UPDATE EXPENSE =================

const updateExpense = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            date,
            description,
            category,
            expense,
            income
        } = req.body;


        const existingExpense = await expenseModel.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });


        if (!existingExpense) {

            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }


        await existingExpense.update({

            date,
            description,
            category,
            expense,
            income

        });


        return res.status(200).json({

            success: true,
            message: "Expense updated successfully",
            expense: existingExpense

        });

    } catch (err) {

        return res.status(500).json({

            success: false,
            message: "Error updating expense",
            error: err.message

        });
    }
};


// ================= DELETE EXPENSE =================

const deleteExpense = async (req, res) => {

    try {

        const { id } = req.params;


        const expense = await expenseModel.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });


        if (!expense) {

            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }


        await expense.destroy();


        return res.status(200).json({

            success: true,
            message: "Expense deleted successfully"

        });

    } catch (err) {

        return res.status(500).json({

            success: false,
            message: "Error deleting expense",
            error: err.message

        });
    }
};


module.exports = {
    getExpense,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
};