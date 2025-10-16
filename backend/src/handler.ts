import { APIGatewayProxyHandler } from "aws-lambda";
import { GptClient } from "./gptClient/gptClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  let client: GptClient;
  try {
    client = new GptClient();
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "OPENROUTER_API_KEY is not set in environment",
        error: String(err),
      }),
      headers: { "Content-Type": "application/json" },
    };
  }

  if (!isApiKeyValid(event.headers)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  const body = event.body ? JSON.parse(event.body) : {};
  const base64Image = body.base64Image;
  let responseBody;
  try {
    responseBody = await client.getResult(base64Image);
  } catch (err) {
    console.error("Error in getResult:", err);
    return {
      statusCode: 502,
      body: JSON.stringify({
        message: "Failed to fetch from OpenRouter",
        error: String(err),
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
  console.log("Response from LLM client:", responseBody);

  return {
    statusCode: 200,
    body: responseBody,
    headers: { "Content-Type": "application/json" },
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
