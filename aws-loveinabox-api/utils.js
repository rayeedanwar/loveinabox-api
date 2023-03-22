const express = require("express");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const setupExpress = () => {
  const app = express();
  app.use(express.json());
  return app;
  // local host config would go here
};

const setupDynamoDbClient = () => {
  const client = new DynamoDBClient();
  return DynamoDBDocumentClient.from(client);
};

const postDynamoDb = async (dynamoDbClient, params) => {
  await dynamoDbClient
    .send(new PutCommand(params))
    .then(() => {
      console.log(Item);
      return Item;
    })
    .catch((e) => {
      console.log(e);
      return {
        e,
      };
    });
};

module.exports = { setupDynamoDbClient, postDynamoDb };
