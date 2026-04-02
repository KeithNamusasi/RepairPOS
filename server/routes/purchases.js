const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ date: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId, productName, supplier, quantity, buyingPrice } = req.body;

    const totalCost = quantity * buyingPrice;

    const purchase = new Purchase({
      productId,
      productName,
      supplier,
      quantity,
      buyingPrice,
      totalCost
    });

    await purchase.save();

    if (productId) {
      const product = await Product.findById(productId);
      if (product) {
        product.stockQuantity += quantity;
        product.buyPrice = buyingPrice;
        await product.save();
      }
    }

    res.status(201).json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;