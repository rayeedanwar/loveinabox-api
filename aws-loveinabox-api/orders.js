const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// think about reuse setup later
const express = require("express");
const serverless = require("serverless-http");

const { getDynamoDbTable } = require("./utils");

const app = express();

const ORDERS_TABLE = process.env.ORDERS_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get("/orders", async function (req, res, next) {
  await getDynamoDbTable(dynamoDbClient, ORDERS_TABLE, res);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
