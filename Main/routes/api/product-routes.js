const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// gets all products
router.get('/', async (req, res) => {
  
  try {
    const productData = await Product.findAll({
      attributes: {exclude: ['productId', 'tagId']},
      include: [{ model: Tag, through: ProductTag, as: 'tags', foreignKey: 'product_id', required: false}]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// finds a single product by its `id`
router.get('/:id', async (req, res) => {
  
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Tag, through: ProductTag, as: 'tags', foreignKey: 'product_id' }]
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// creates new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4],
      category_id: 5
    }
  */
    try {
      const productData = await Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// updates product
router.put('/:id', async (req, res) => {
  // updates product data
  // try {
  console.log('body:', req.body)
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id)
      console.log('productTagIds:', productTagIds)
      // create filtered list of new tag_ids
      console.log('bodyTagIds:', req.body.tagIds)
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      console.log('newProductTags:', newProductTags)
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
      console.log('productTagsToRemove:', productTagsToRemove)
      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
  // } catch (err) {
  //   res.status(400).json(err);
  // }
});

// deletes one product by its `id` value
router.delete('/:id', async (req, res) => {
  
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
