import { TestResult } from "./testResult";

const prompt = `
Analyze the provided image of a medical rapid test and respond only with a JSON object in this exact format:
{
  "result": "positive" | "negative" | "unknown",
  "confidence": 0.0 - 1.0,
  "type": "covid" | "pregnancy" | "other"
}
- specically look for the test result line and control line
  - two lines are present, the test is positive
  - one line is present, the test is negative  
- "result" must be one of "positive", "negative", or "unknown".
- "confidence" is a decimal between 0 (no confidence) and 1 (full confidence).
- If you have any doubt, respond with "unknown" and confidence below 0.6.
- Do not include any text or markdown formatting, only the JSON.
`;

export class GptClient {
  apiKey: string;

  constructor() {
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("Set OPENROUTER_API_KEY in your environment.");
      throw new Error("API key is not set");
    }
    this.apiKey = process.env.OPENROUTER_API_KEY;
  }

  async getResult(base64Url: string): Promise<string> {
    const request = this.buildRequest(base64Url);

    return await fetch("https://openrouter.ai/api/v1/chat/completions", request)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `HTTP error! status: ${res.status}, message: ${res.statusText}`,
          );
        }
        return res.json();
      })
      .then((res) => res?.choices?.[0]?.message?.content ?? "");
  }

  private buildRequest(base64Url: string) {
    return {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
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
      }),
    };
  }

  private parse(response: string) {
    try {
      const parsedResponse = JSON.parse(response) as TestResult;
      return parsedResponse ?? resultUnknown();
    } catch (error) {
      console.error(
        "Error parsing response:",
        error,
        "response text:",
        response,
      );
      return resultUnknown();
    }
  }
}

function resultUnknown(): TestResult {
  return { result: "unknown", confidence: 0.0 };
}
