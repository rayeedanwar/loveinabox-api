const { v4: uuidv4 } = require("uuid");
const db = require(`../utils/helpers`);
var express = require("express");
var router = express.Router();

const TableName = "products";

/* GET all items. */
router.get("/", async function (req, res, next) {
  await db
    .scan({
      TableName,
    })
    .promise()
    .then((dbResult) => {
      res.send(
        dbResult.Items.map(({ productId, ...rest }) => ({
          ...rest,
          itemId: productId,
        }))
      );
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

/* POST a new item. */
router.post("/", async function (req, res, next) {
  // to remove once model is correct
  const productId = uuidv4();
  const Item = {
    ...req.body,
    productId,
  };
  const params = {
    TableName,
    Item,
  };
  await db
    .put(params)
    .promise()
    .then(() => {
      console.log(Item);
      res.send({ ...Item, itemId: productId });
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

module.exports = router;
