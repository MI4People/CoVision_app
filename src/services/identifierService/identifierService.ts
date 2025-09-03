import {
  identifierClient,
  IdentifierClient,
  TestResult,
} from "@/src/services/identifierClient/client";
import * as FileSystem from "expo-file-system";

export class IdentifierService {
  constructor(private readonly client: IdentifierClient) {}

  public async identifyTest(urlToPhoto: string): Promise<TestResult> {
    const base64Image = await FileSystem.readAsStringAsync(urlToPhoto, {
      encoding: FileSystem.EncodingType.Base64,
    });
    try {
      return await this.client.getResult(
        `data:image/png;base64,${base64Image}`,
      );
    } catch (error) {
      console.error("Error identifying test:", error);
      return { result: "unknown", confidence: 1 };
    }
  }
}

export const identifierService = new IdentifierService(identifierClient);
