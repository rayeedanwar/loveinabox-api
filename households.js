const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

// think about reuse setup later
const express = require("express");
const serverless = require("serverless-http");

const { getDynamoDbTable, putDynamoDbTable } = require("./utils");

const app = express();

const HOUSEHOLDS_TABLE = process.env.HOUSEHOLDS_TABLE;
const ORDERS_TABLE = process.env.ORDERS_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

// dynamoDb is basically middleware, surely there's a way of cleaning this up to avoid passing everytime?

/* POST a new household. */
app.post("/households", async function (req, res) {
  await putDynamoDbTable(
    dynamoDbClient,
    HOUSEHOLDS_TABLE,
    "householdId",
    req.body,
    res
  );
});

// can I do anything about non used params in express args?
app.get("/households", async function (req, res, next) {
  await getDynamoDbTable(dynamoDbClient, HOUSEHOLDS_TABLE, res);
});

app.post("/households/:householdId/orders", async function (req, res, next) {
  // how do we test this contract? hmmmm
  await putDynamoDbTable(
    dynamoDbClient,
    ORDERS_TABLE, // need integration tests specifically for issues like this:
    // refactored this but didn't rename table to ORDERS_TABLE, so order ended up on HOUSEHOLDS_TABLE :S
    // no tests caught this out
    "orderId",
    { ...req.body, householdId: req.params.householdId },
    res
  );
});

/* POST an order completion for an order in a household. */
app.post(
  "/households/:householdId/orders/:orderId/complete",
  async function (req, res, next) {
    const params = {
      TableName: ORDERS_TABLE,
      Key: { orderId: req.params.orderId },
      UpdateExpression: "SET completedAt = :completedAt",
      ExpressionAttributeValues: {
        ":completedAt": req.body.completedAt,
      },
    };
    await dynamoDbClient
      .send(new UpdateCommand(params))
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

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
