import { IdentifierClient } from "@/src/services/identifierClient/client";
import { TestResult } from "@/src/services/identifierClient/testResult";

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
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        console.log("error", res.status, ":", res.statusText);
        return { result: "ERROR", confidence: 0 };
      })
      .then((res) => {
        if (res.error) {
          console.log("error", res.error);
          return { result: "ERROR", confidence: 0 };
        }

        console.log("result:", res);
        return res as TestResult;
      });
  }
}
