var express = require("express");
var router = express.Router();

/* GET all products. */
router.get("/", function (req, res, next) {
  res.send("GET all products.");
});

/* POST a new product. */
router.post("/", function (req, res, next) {
  res.send({ ...req.body });
});

module.exports = router;
