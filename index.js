// const { v4: uuidv4 } = require("uuid");
const { randomUUID } = require("crypto");

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

// think about reuse setup later
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const HOUSEHOLDS_TABLE = process.env.HOUSEHOLDS_TABLE;
const ITEMS_TABLE = process.env.ITEMS_TABLE;
const ORDERS_TABLE = process.env.ORDERS_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

/* POST a new household. */
app.post("/households", async function (req, res, next) {
  const Item = {
    ...req.body,
    householdId: randomUUID(),
  };
  const params = {
    TableName: HOUSEHOLDS_TABLE,
    Item,
  };
  await dynamoDbClient
    .send(new PutCommand(params))
    .then(() => {
      console.log(Item);
      res.send({ ...Item });
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

app.get("/households", async function (req, res, next) {
  await dynamoDbClient
    .send(
      new ScanCommand({
        TableName: HOUSEHOLDS_TABLE,
      })
    )
    .then((dbResult) => {
      res.send(dbResult.Items);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

app.post("/households/:householdId/orders", async function (req, res, next) {
  const Item = {
    ...req.body,
    orderId: randomUUID(),
    householdId: req.params.householdId,
  };
  const params = {
    TableName: ORDERS_TABLE,
    Item,
  };
  await dynamoDbClient
    .send(new PutCommand(params))
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
      .send(new UpdateItemCommand(params))
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

/* POST a new item. */
app.post("/items", async function (req, res, next) {
  const Item = {
    ...req.body,
    itemId: randomUUID(),
  };
  const params = {
    TableName: ITEMS_TABLE,
    Item,
  };
  await dynamoDbClient
    .send(new PutCommand(params))
    .then(() => {
      console.log(Item);
      res.send({ ...Item });
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

/* GET all items. */
app.get("/items", async function (req, res, next) {
  await dynamoDbClient
    .send(
      new ScanCommand({
        TableName: ITEMS_TABLE,
      })
    )
    .then((dbResult) => {
      res.send(dbResult.Items);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

app.get("/orders", async function (req, res, next) {
  await dynamoDbClient
    .send(
      new ScanCommand({
        TableName: ORDERS_TABLE,
      })
    )
    .then((dbResult) => {
      res.send(dbResult.Items);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
