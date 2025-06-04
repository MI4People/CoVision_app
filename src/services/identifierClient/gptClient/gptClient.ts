import OpenAI from "openai";
import {
  IdentifierClient,
  TestResult,
} from "@/src/services/identifierClient/client";
import { apiKey } from "@/src/services/identifierClient/gptClient/apiKey";

export class GptClient implements IdentifierClient {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async getResult(base64Url: string): Promise<TestResult> {
    const response = await this.callApi(base64Url);
    if (!response) {
      console.error("No response from GPT API");
      return "unknown";
    }

    return this.parse(response);
  }

  private async callApi(base64Url: string): Promise<string | undefined> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'Please analyze the following image of a covid antigen test. respond with: `{"result": "positive"}` if the test is positive, `{"result": "negative"}` if the test is negative, or `{"result": "unknown"}` if the result is unclear. do not include markdown formatting',
            },
            {
              type: "image_url",
              image_url: { url: base64Url },
            },
          ],
        },
      ],
    });

    return response.choices[0]?.message.content ?? undefined;
  }

  private parse(response: string) {
    try {
      const parsedResponse = JSON.parse(response) as { result: TestResult };
      console.log("response from gpt:", parsedResponse);
      return parsedResponse.result ?? "unknown";
    } catch (error) {
      console.error(
        "Error parsing response:",
        error,
        "response text:",
        response,
      );
      return "unknown";
    }
  }
}
