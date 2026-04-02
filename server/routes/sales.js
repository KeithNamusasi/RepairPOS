const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.find({ user: req.userId }).sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { productId, quantity, paymentMethod } = req.body;

    const product = await Product.findOne({ _id: productId, user: req.userId });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const total = product.sellPrice * quantity;
    const profit = (product.sellPrice - product.buyPrice) * quantity;

    const sale = new Sale({
      user: req.userId,
      productId,
      productName: product.name,
      quantity,
      sellingPrice: product.sellPrice,
      total,
      profit,
      paymentMethod: paymentMethod || 'cash'
    });

    await sale.save();

    product.stockQuantity -= quantity;
    await product.save();

    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;