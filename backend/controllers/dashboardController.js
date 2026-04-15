import incomeModel from "../models/incomeModel.js";
import expenseModel from "../models/expenseModel.js";

export async function getDashboardOverview(req, res) {
    const userId = req.user.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    try {
        // const incomes = await incomeModel.find({
        //     userId,
        //     date: {$gte: startOfMonth, $lte: now},
        // }).lean();

        const income = await incomeModel.aggregate([
            {$match: {userId: userId}},
            {$group: {_id: "$category", total: {$sum: "$amount"}}}
        ])
    

        // const expenses = await expenseModel.find({
        //     userId,
        //     date: {$gte: startOfMonth, $lte: now},
        // }).lean();

        const expense = await expenseModel.aggregate([
            {$match: {userId: userId}},
            {$group: {_id: "$category", total: {$sum: "$amount"}}},
        ])


        //const monthlyIncome = incomes.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
    const monthlyIncome = income[0] ? income[0].total : 0;
   
    //const monthlyExpense = expenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
    const monthlyExpense = expense[0] ? expense[0].total : 0;

    const savings = monthlyIncome - monthlyExpense;
    const savingsRate = monthlyIncome === 0 ? 0 : Math.round((savings / monthlyIncome) * 100);
  

    const recentTransactions = [
      ...income.map((i) => ({ ...i, type: "income" })),
      ...expense.map((e) => ({ ...e, type: "expense" })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const spendByCategory = {};
    for (const exp of expense) {
      const cat = exp._id || "Other";
      spendByCategory[cat] = (spendByCategory[cat] || 0) + Number(exp.total || 0);
    }

    const expenseDistribution = Object.entries(spendByCategory).map(([category, amount]) => ({
      category,
      amount,
      percent: monthlyExpense === 0 ? 0 : Math.round((amount / monthlyExpense) * 100),
    }));

    return res.status(200).json({
        success: true,
        data:{
            monthlyIncome,
            monthlyExpense,
            savings,
            savingsRate,
            recentTransactions,
            spendByCategory,
            expenseDistribution
        }
    })

    } 
    catch (err) {
        console.error("GetDashboardOverview Error : ",err)
        return res.status(500).json({
            success: false,
            message: "Dashboard Fetch Failed",
            error: err.message
        })
    }
}