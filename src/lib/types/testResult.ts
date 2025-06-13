export type TestResult = {
  result: "positive" | "negative" | "unknown" | "ERROR";
  confidence: number;
};
