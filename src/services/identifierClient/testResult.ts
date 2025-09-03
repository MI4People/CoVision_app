export interface TestResult {
  result: "positive" | "negative" | "unknown" | "ERROR";
  confidence: number;
}
