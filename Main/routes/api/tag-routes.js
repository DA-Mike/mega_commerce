const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// finds all tags
router.get('/', async (req, res) => {
  
  try {
    const productData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: 'products', foreignKey: 'product_id' }]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// finds a single tag by its `id`
router.get('/:id', async (req, res) => {
  
  try {
    const productData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'products', foreignKey: 'product_id' }]
    });

    if (!productData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// creates a new tag
router.post('/', async (req, res) => {
  
    try {
      const productData = await Tag.create(req.body);
      res.status(200).json(productData);
    } catch (err) {
      res.status(400).json(err);
    }
});

// updates a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  
  try {
    const productData = await Tag.update({tag_name: req.body.tag_name}, {where: {id: req.params.id}});
    res.status(200).json(productData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// deletes on tag by its `id` value
router.delete('/:id', async (req, res) => {
  
  try {
    const productData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!productData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
