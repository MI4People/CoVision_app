import OpenAI from "openai";
import {
  IdentifierClient,
  TestResult,
} from "@/src/services/identifierClient/client";
import { apiKey } from "@/src/services/identifierClient/gptClient/apiKey";

const prompt = `
Analyze the provided image of a COVID antigen test and respond only with a JSON object in this exact format:
{
  "result": "positive" | "negative" | "unknown",
  "confidence": 0.0 - 1.0
}
- "result" must be one of "positive", "negative", or "unknown".
- "confidence" is a decimal between 0 (no confidence) and 1 (full confidence).
- If you have any doubt, respond with "unknown" and confidence below 0.6.
- Do not include any text or markdown formatting, only the JSON.
`;

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
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a medical AI assistant." },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt.trim(),
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
      const parsedResponse = JSON.parse(response) as {
        result: string;
        confidence: number;
      };
      return parsedResponse ?? {};
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
