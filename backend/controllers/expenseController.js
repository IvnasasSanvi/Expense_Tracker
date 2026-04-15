import expenseModel from "../models/expenseModel.js";
import getDateRange from "../utils/dateFilter.js";
import ExcelJS from 'exceljs'

//add expense
export async function addExpense(req, res) {
    const userId = req.user.id
    console.log(userId)
    const {description, amount, category, date} = req.body;

    try {
        if(!description || !amount || !category || !date){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }    
        const newExpense = new expenseModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });

        await newExpense.save()
        res.json({
            success: true,
            message: "Expense added successfully!"
        })
    }
    catch(error){
        console.log(error.message);

        res.status(500).json({
            success: false,
            message: "Server Error",
            msg : error.message
        })
    }
}

// to all expense
export async function getAllExpense(req, res) {
    const userId = req.user.id
    try {
        const expense = await expenseModel.find({ userId }).sort({date: -1});
        res.json(expense)
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

// to update the expense
export async function updateExpense(req, res) {
    const {id} = req.params;
    const userId = req.user.id;
    const {description, amount} = req.body;

    try {
        const updateExpense = await expenseModel.findOneAndUpdate(
            {_id: id, userId},
            {description,amount},
            {new: true}
        );

        if(!updateExpense){
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            })
        }

        res.json({
            success: true, 
            message: "Expense updated successfully.",
            data: updateExpense
        })

    } 
    
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }    
}

// delete an expense
export async function deleteExpense(req, res) {
        try {
        const expense = await expenseModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
});
        if(!expense){
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }
        return res.json({
            success: true,
            message: "Expense deleted successfully!"
        })

    } 
    
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

//download excel for expense
export async function downloadExpenseExcel(req, res) {
        const userId = req.user.id;

    try {
        const expense = await expenseModel.find({ userId }).sort({ date: -1 });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Expense");

        worksheet.columns = [
            { header: "Description", key: "description", width: 20 },
            { header: "Amount", key: "amount", width: 15 },
            { header: "Category", key: "category", width: 15 },
            { header: "Date", key: "date", width: 20 },
        ];

        expense.forEach((expen) => {
            worksheet.addRow({
                description: expen.description,
                amount: expen.amount,
                category: expen.category,
                date: new Date(expen.date).toLocaleDateString(),
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=expense_details.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }    
}

//to get expense overview
export async function getExpenseOverview(req, res) {
    try {
    const userId = req.user.id;
    const {range = "monthly"} = req.query;
    const {start, end} = getDateRange(range);
    
    const expense = await expenseModel.find({
        userId,
        date: {$gte: start, $lte: end},

    }).sort({date: -1})

    const totalExpense = expense.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense = expense.length > 0 ? totalExpense / expense.length : 0;
    const numberOfTransactions = expense.length;
    const recentTransactions = expense.slice(0, 5);

    res.json({
        success: true,
        date: {
            totalExpense,
            averageExpense,
            numberOfTransactions,
            recentTransactions,
            range
        }
    })


    } 
    
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }    
}