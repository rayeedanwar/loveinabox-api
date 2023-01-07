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

module.exports = router;
