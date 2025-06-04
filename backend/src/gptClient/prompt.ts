export const prompt = `
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
