import { GptClient } from "@/src/services/identifierClient/gptClient/gptClient";

export interface IdentifierClient {
  getResult(base64Url: string): Promise<TestResult>;
}

export interface TestResult {
  result: "positive" | "negative" | "unknown" | "ERROR";
  confidence: number;
}

export const identifierClient = new GptClient();
