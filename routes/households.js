const { v4: uuidv4 } = require("uuid");
const db = require(`../utils/helpers`);
var express = require("express");
var router = express.Router();

const householdsTableName = "households";

/* GET all households. */
router.get("/", async function (req, res, next) {
  await db
    .scan({
      TableName: householdsTableName,
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

/* POST a new household. */
router.post("/", async function (req, res, next) {
  const Item = {
    ...req.body,
    householdId: uuidv4(),
  };
  const params = {
    TableName: householdsTableName,
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

/* POST a new order for a household. */
router.post("/:householdId/orders", async function (req, res, next) {
  const newOrder = [
    {
      ...req.body,
      orderId: uuidv4(),
    },
  ];
  const params = {
    TableName: householdsTableName,
    Key: { householdId: req.params.householdId },
    UpdateExpression: "SET orders = list_append(orders, :newOrder)",
    ExpressionAttributeValues: {
      ":newOrder": newOrder,
    },
  };
  await db
    .update(params)
    .promise()
    .then(() => {
      console.log(newOrder);
      res.send({ ...newOrder });
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

/* POST a new order for a household. */
router.post("/:householdId/orders/:orderId/complete", async function (req, res, next) {
  res.sendStatus(200)
});

module.exports = router;
