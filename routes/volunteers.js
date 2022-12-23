const { v4: uuidv4 } = require("uuid");
const db = require(`../utils/helpers`);
var express = require("express");
var router = express.Router();

/* GET all volunteers. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* POST a new volunteer. */
router.post("/", async function (req, res, next) {
  const Item = {
    ...req.body,
    volunteerId: uuidv4(),
  };
  const params = {
    TableName: "volunteers",
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
