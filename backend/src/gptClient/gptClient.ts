import { buildRequest } from "./request";

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
    const request = buildRequest(base64Url, this.apiKey);

    return await fetch("https://openrouter.ai/api/v1/chat/completions", request)
      .then((res) => this.processError(res))
      .then((res) => res.json())
      .then((res) => res?.choices?.[0]?.message?.content ?? "");
  }

  processError(res: Response): Response {
    if (!res.ok) {
      throw new Error(
        `HTTP error! status: ${res.status}, message: ${res.statusText}`,
      );
    }

    return res;
  }
}
