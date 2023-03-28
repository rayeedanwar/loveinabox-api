const { getDynamoDbTable, putDynamoDbTable } = require("./utils");

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { mockClient } = require("aws-sdk-client-mock");
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const dynamodbMock = mockClient(DynamoDBClient);

beforeEach(() => {
  dynamodbMock.reset();
});

test("getDynamoDbTable success", async () => {
  // Arrange
  const expectedItems = [
    {
      childCount: 0,
      adultCount: 1,
      address: "9 Moorfields",
      householdId: "e00bf6ba-2dc2-4d5a-b7cf-927ae12de7ad",
      members: [
        {
          name: "Rayeed not Anwar",
          contactNumber: "07816985954",
          email: "",
        },
      ],
    },
    {
      childCount: 0,
      adultCount: 1,
      address: "9 Moorfields",
      householdId: "05bd0305-4869-4593-a610-ca9700961d53",
      members: [
        {
          name: "Rayeed not Anwar",
          contactNumber: "07816985954",
          email: "",
        },
      ],
    },
  ];
  dynamodbMock.on(ScanCommand).resolves({
    Items: expectedItems,
  });
  const resMocked = { send: jest.fn() };

  // Act
  await getDynamoDbTable(dynamodbMock, "random table", resMocked);

  // Assert
  expect(...resMocked.send.mock.lastCall).toBe(expectedItems);
  // assert db called with right values
});

test("getDynamoDbTable failure", async () => {
  // Arrange
  dynamodbMock.on(ScanCommand).rejects();
  const resMocked = { send: jest.fn(), sendStatus: jest.fn() };

  // Act
  await getDynamoDbTable(
    dynamodbMock,
    // incorrect table name causes promise to throw error
    // that's what I thought initially but it actuall fails because send isn't a function
    { name: "table name should not be a property in an object" },
    resMocked
  );

  console.log(resMocked.send.mock, resMocked.sendStatus.mock);

  // Assert
  expect(resMocked.sendStatus).toHaveBeenLastCalledWith(500);
  // assert db called with right values
});

test("putDynamoDbTable success", async () => {
  // Arrange
  dynamodbMock.on(PutCommand).resolves();
  const resMocked = { send: jest.fn() };
  const objectToAdd = {
    random: "object",
  };

  // Act
  await putDynamoDbTable(
    dynamodbMock,
    "random table",
    "randomKey",
    objectToAdd,
    resMocked
  );

  // Assert
  expect(...resMocked.send.mock.lastCall).toMatchObject({
    ...objectToAdd,
    randomKey: expect.any(String),
  });
  // assert db called with right values
});

test("putDynamoDbTable failure", async () => {
  // Arrange
  dynamodbMock.on(PutCommand).rejects();
  const resMocked = { send: jest.fn(), sendStatus: jest.fn() };

  // Act
  await putDynamoDbTable(
    dynamodbMock,
    // incorrect table name causes promise to throw error
    { name: "table name should not be a property in an object" },
    {},
    "",
    resMocked
  );

  // Assert
  expect(resMocked.sendStatus).toHaveBeenLastCalledWith(500);
  // assert db called with right values
});
