var express = require("express");
var router = express.Router();

/* GET all recipients. */
router.get("/", function (req, res, next) {
  res.send("GET all recipients.");
});

/* POST a new recipient. */
router.post("/", function (req, res, next) {
  res.send({ ...req.body });
});

/* POST a new order. */
router.post("/orders", function (req, res, next) {
  res.send({ ...req.body });
});

/* GET all orders. */
router.get("/orders", function (req, res, next) {
  res.send("GET all orders.");
});

/* GET summary for all orders. */
router.get("/orders-summary", function (req, res, next) {
  res.send("GET all orders.");
});

module.exports = router;
