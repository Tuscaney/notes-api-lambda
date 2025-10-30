import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  DeleteCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE = "Notes";

export const handler = async (event) => {
  console.log("HANDLER EVENT!!:", JSON.stringify(event));

  const httpMethod = event?.requestContext?.http?.method;
  const rawPath = event?.rawPath || "/";
  const body = event?.body;

  // GET /notes  -> list all
  if (httpMethod === "GET" && rawPath === "/notes") {
    const result = await docClient.send(new ScanCommand({ TableName: TABLE }));
    return json(200, result.Items || []);
  }

  // POST /notes -> create { id, text }
  if (httpMethod === "POST" && rawPath === "/notes") {
    const note = JSON.parse(body || "{}");
    if (!note?.id || !note?.text) return json(400, { error: "id and text required" });
    await docClient.send(new PutCommand({ TableName: TABLE, Item: note }));
    return json(201, note);
  }

  // GET /notes/{id}
  if (httpMethod === "GET" && /^\/notes\/\w+/.test(rawPath)) {
    const id = rawPath.split("/")[2];
    const result = await docClient.send(new GetCommand({ TableName: TABLE, Key: { id } }));
    return result.Item ? json(200, result.Item) : json(404, { error: "Note not found" });
  }

  // DELETE /notes/{id}
  if (httpMethod === "DELETE" && /^\/notes\/\w+/.test(rawPath)) {
    const id = rawPath.split("/")[2];
    await docClient.send(new DeleteCommand({ TableName: TABLE, Key: { id } }));
    return json(200, { message: "Note deleted" });
  }

  // (Optional) PUT /notes/{id} -> update text
  if (httpMethod === "PUT" && /^\/notes\/\w+/.test(rawPath)) {
    const id = rawPath.split("/")[2];
    const payload = JSON.parse(body || "{}");
    if (!payload?.text) return json(400, { error: "text required" });
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { id },
        UpdateExpression: "SET #t = :t",
        ExpressionAttributeNames: { "#t": "text" },
        ExpressionAttributeValues: { ":t": payload.text },
        ReturnValues: "ALL_NEW"
      })
    );
    return json(200, { id, text: payload.text });
  }

  return json(400, { error: "Unsupported route" });
};

function json(statusCode, data) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  };
}
