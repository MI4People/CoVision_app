import { TestResult } from "@/src/lib/types/testResult";
import { GptClient } from "@/src/services/identifierClient/gptClient/gptClient";

export interface IdentifierClient {
  getResult(base64Url: string): Promise<TestResult>;
}

export const identifierClient = new GptClient();
