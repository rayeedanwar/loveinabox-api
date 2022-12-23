var express = require("express");
var router = express.Router();

/* GET all recipients. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* POST a new recipient. */
router.post("/", function (req, res, next) {
  res.send({ ...req.body });
});

module.exports = router;