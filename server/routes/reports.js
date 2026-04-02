const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Repair = require('../models/Repair');
const Product = require('../models/Product');
const Savings = require('../models/Savings');
const auth = require('../middleware/auth');

router.get('/summary', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySales = await Sale.find({
      user: userId,
      date: { $gte: today, $lt: tomorrow }
    });

    const totalSalesToday = todaySales.reduce((sum, s) => sum + s.total, 0);
    const profitToday = todaySales.reduce((sum, s) => sum + s.profit, 0);

    const totalPurchases = await Purchase.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$totalCost' } } }
    ]);

    const totalRepairs = await Repair.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$repairCost' } } }
    ]);

    const pendingRepairs = await Repair.countDocuments({ user: userId, status: 'Pending' });

    const products = await Product.find({ user: userId });
    const totalProducts = products.length;
    const lowStock = products.filter(p => p.stockQuantity < 5).length;

    const totalSavings = await Savings.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalSalesToday,
      profitToday,
      totalPurchases: totalPurchases[0]?.total || 0,
      totalRepairIncome: totalRepairs[0]?.total || 0,
      pendingRepairs,
      totalProducts,
      lowStock,
      totalSavings: totalSavings[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/sales/daily', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.query;
    const startDate = new Date(date || new Date());
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const sales = await Sale.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate }
    }).sort({ date: -1 });

    const total = sales.reduce((sum, s) => sum + s.total, 0);
    const profit = sales.reduce((sum, s) => sum + s.profit, 0);

    res.json({ sales, total, profit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/sales/monthly', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { month, year } = req.query;
    const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()), 1);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const sales = await Sale.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate }
    });

    const total = sales.reduce((sum, s) => sum + s.total, 0);
    const profit = sales.reduce((sum, s) => sum + s.profit, 0);

    res.json({ sales, total, profit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/products/stock', auth, async (req, res) => {
  try {
    const products = await Product.find({ user: req.userId }).sort({ stockQuantity: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/repairs/income', auth, async (req, res) => {
  try {
    const repairs = await Repair.find({ user: req.userId, status: 'Completed' });
    const totalIncome = repairs.reduce((sum, r) => sum + r.repairCost, 0);
    res.json({ repairs, totalIncome });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;