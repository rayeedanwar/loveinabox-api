const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { getDynamoDbTable, putDynamoDbTable } = require("./utils");

// think about reuse setup later
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const ITEMS_TABLE = process.env.ITEMS_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

/* POST a new item. */
app.post("/items", async function (req, res, next) {
  await putDynamoDbTable(dynamoDbClient, ITEMS_TABLE, "itemId", req.body, res);
});

/* GET all items. */
app.get("/items", async function (req, res, next) {
  await getDynamoDbTable(dynamoDbClient, ITEMS_TABLE, res);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
