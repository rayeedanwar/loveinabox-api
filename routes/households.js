const { v4: uuidv4 } = require("uuid");
const db = require(`../utils/helpers`);
var express = require("express");
var router = express.Router();

const householdsTableName = "households";
const ordersTableName = "orders";

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
  const Item = {
    ...req.body,
    orderId: uuidv4(),
    householdId: req.params.householdId,
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

/* POST an order completion for an order in a household. */
router.post(
  "/:householdId/orders/:orderId/complete",
  async function (req, res, next) {
    const params = {
      TableName: ordersTableName,
      Key: { orderId: req.params.orderId },
      UpdateExpression: "SET completedAt = :completedAt",
      ExpressionAttributeValues: {
        ":completedAt": req.body.completedAt,
      },
    };
    await db
      .update(params)
      .promise()
      .then(() => {
        console.log(req.params);
        res.send({ ...req.params, ...req.body });
      })
      .catch((e) => {
        console.log(e);
        res.sendStatus(500);
      });
  }
);

module.exports = router;
