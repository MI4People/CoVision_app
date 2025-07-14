import { TestResult } from "@/src/services/identifierClient/gptClient/testResult";
import { IdentifierClient } from "@/src/services/identifierClient/client";

export class DefaultIdentifierClient implements IdentifierClient {
  private readonly apiUrl: string;
  private readonly secret: string;
  constructor() {
    if (!process.env.EXPO_PUBLIC_API_URL || !process.env.EXPO_PUBLIC_API_KEY) {
      throw new Error("set API_URL and SECRET in your environment.");
    }
    this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
    this.secret = process.env.EXPO_PUBLIC_API_KEY;
  }

  async getResult(base64Url: string): Promise<TestResult> {
    return await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": this.secret,
      },
      body: JSON.stringify({
        base64Image: base64Url,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return { result: "ERROR", confidence: 0 };
        }
        return res as TestResult;
      });
  }
}
