const { randomUUID } = require("crypto");
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const getDynamoDbTable = async function (dynamoDbClient, tableName, res) {
  await dynamoDbClient
    .send(
      new ScanCommand({
        TableName: tableName,
      })
    )
    .then((dbResult) => {
      console.log(dbResult);
      res.send(dbResult.Items);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
};

const putDynamoDbTable = async (
  dynamoDbClient,
  tableName,
  keyName,
  putObject,
  res
) => {
  putObject[keyName] = randomUUID();
  const params = {
    TableName: tableName,
    Item: putObject,
  };
  await dynamoDbClient
    .send(new PutCommand(params))
    .then(() => {
      res.send({ ...putObject });
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
};

module.exports = {
  putDynamoDbTable,
  getDynamoDbTable,
};
