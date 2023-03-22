const householdsHandler = require("./households");
const { setupDynamoDbClient, postDynamoDb } = require("./utils");

const {
  DynamoDBClient,
  paginateQuery,
  QueryCommand,
} = require("@aws-sdk/client-dynamodb");
const { mockClient } = require("aws-sdk-client-mock");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const dynamodbMock = mockClient(DynamoDBClient);

const dynamodb = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(dynamodb);

beforeEach(() => {
  process.env["AWS_REGION"] = "us-east-1";
  process.env["AWS_DEFAULT_REGION"] = "us-east-1";
  dynamodbMock.reset();
});

test.only("handler", async () => {
  dynamodbMock.on(PutCommand).resolves({
    some: "Thing",
  });
  const response = await postDynamoDb(ddb, { random: "object" });
  console.log({ response, dynamodbMock });
});

// test("utils", () => {
//   const updateTableSpy = sinon.spy();
//   AWSMock.mock("DynamoDB.DynamoDBClient", "send", updateTableSpy);
//   const client = setupDynamoDbClient();
//   console.log(client);
//   console.log(updateTableSpy.getCalls());
// });
