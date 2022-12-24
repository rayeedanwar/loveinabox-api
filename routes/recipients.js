const { v4: uuidv4 } = require("uuid");
const db = require(`../utils/helpers`);
var express = require("express");
var router = express.Router();

const recipientsTableName = "recipients";
const ordersTableName = "orders";

/* GET all recipients. */
router.get("/", async function (req, res, next) {
  await db
    .scan({
      TableName: recipientsTableName,
    })
    .promise()
    .then((dbResult) => {
      res.send(dbResult.Items);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

/* POST a new recipient. */
router.post("/", async function (req, res, next) {
  const Item = {
    ...req.body,
    recipientId: uuidv4(),
  };
  const params = {
    TableName: recipientsTableName,
    Item,
  };
  await db
    .put(params)
    .promise()
    .then(() => {
      console.log(Item);
      res.send({ ...Item });
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

/* POST a new order. */
router.post("/orders", async function (req, res, next) {
  // needs recipientId before /orders
  const Item = {
    ...req.body,
    orderId: uuidv4(),
  };
  const params = {
    TableName: ordersTableName,
    Item,
  };
  await db
    .put(params)
    .promise()
    .then(() => {
      console.log(Item);
      res.send({ ...Item });
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

/* GET all orders. */
router.get("/orders", async function (req, res, next) {
  // needs recipientId before /orders
  await db
    .scan({
      TableName: ordersTableName,
    })
    .promise()
    .then((dbResult) => {
      res.send(dbResult.Items);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

/* GET summary for all orders. */
router.get("/orders-summary", function (req, res, next) {
  res.send("GET all orders.");
});

module.exports = router;
