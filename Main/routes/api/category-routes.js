const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// finds all categories
router.get('/', async (req, res) => {
  
  try {
    const productData = await Category.findAll({
      include: Product
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// finds one category by its `id` value
router.get('/:id', async (req, res) => {
  
  try {
    const productData = await Category.findByPk(req.params.id, {
      include: Product
    });

    if (!productData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// creates a new category
router.post('/', async (req, res) => {
  
  try {
    const productData = await Category.create(req.body);
    res.status(200).json(productData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// updates a category by its `id` value
router.put('/:id', async (req, res) => {
  
  try {
    const productData = await Category.update({category_name: req.body.category_name}, {where: {id: req.params.id}});
    res.status(200).json(productData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// deletes a category by its `id` value
router.delete('/:id', async (req, res) => {
  
  try {
    const productData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!productData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
