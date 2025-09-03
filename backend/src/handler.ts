import { APIGatewayProxyHandler } from "aws-lambda";
import { GptClient } from "./gptClient/gptClient";

const client = new GptClient();

export const handle: APIGatewayProxyHandler = async (event) => {
  if (!isApiKeyValid(event.headers)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  const body = event.body ? JSON.parse(event.body) : {};
  const base64Image = body.base64Image;
  const responseBody = await client.getResult(base64Image);
  console.log("Response from LLM client:", responseBody);

  return {
    statusCode: 200,
    body: responseBody,
    headers: {
      "Content-Type": "application/json",
    },
  };
};

function isApiKeyValid(headers?: {
  [key: string]: string | undefined;
}): boolean {
  const apiKeyHeader =
    headers?.["api_key"] ?? headers?.["API_KEY"] ?? headers?.["api-key"];
  const expectedApiKey = process.env.API_KEY;
  return !!apiKeyHeader && apiKeyHeader === expectedApiKey;
}
