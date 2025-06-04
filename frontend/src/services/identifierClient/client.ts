import { DefaultIdentifierClient } from "@/src/services/identifierClient/gptClient/client";

export interface IdentifierClient {
  getResult(base64Url: string): Promise<TestResult>;
}

export interface TestResult {
  result: "positive" | "negative" | "unknown" | "ERROR";
  confidence: number;
}

export const identifierClient = new DefaultIdentifierClient();
