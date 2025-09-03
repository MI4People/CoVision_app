import { GptClient } from "./gptClient/gptClient";
import * as fs from "node:fs";
import * as path from "node:path";
// import sharp from "sharp"; // add sharp for image processing

const client = new GptClient();

interface Result {
  file: string;
  result: string;
  expected: string;
  status: string;
}

async function runTests() {
  const testFolders = [
    { dir: "testData/negative", expected: "negative" },
    { dir: "testData/positive", expected: "positive" },
  ];

  const results: Result[] = [];

  for (const { dir, expected } of testFolders) {
    const folderPath = path.resolve(dir);
    if (!fs.existsSync(folderPath)) {
      console.warn(`Folder not found: ${folderPath}`);
      continue;
    }

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const result = await checkFile(path.join(folderPath, file), expected);
      if (!result) continue;

      results.push(result);
    }
  }

  printResults(results);
  writeResults(results);
}

function printResults(results: Result[]) {
  console.log("\nTest Results:");
  console.table(results, ["file", "result", "expected", "status"]);
}

function writeResults(results: Result[]) {
  const resultsFilePath = path.resolve("testResults.json");
  fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2));
}

async function checkFile(filePath: string, expected: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  const base64Data = await readFileWithEnhancements(filePath); // updated
  const result = await getResult(base64Data);
  const status = result === expected ? "PASS" : "FAIL";
  return { file: filePath, result, expected, status };
}

async function getResult(base64Data: string): Promise<string> {
  try {
    return await client.getResult(`data:image/png;base64,${base64Data}`);
  } catch (error) {
    console.error("Error in getResult:", error);
    return Promise.resolve("ERROR");
  }
}

/**
 * Reads an image file, applies contrast and saturation increase, returns base64 string.
 */
async function readFileWithEnhancements(fileName: string): Promise<string> {
  const buffer = fs.readFileSync(fileName);
  // Increase contrast and saturation
  // const processed = await sharp(buffer)
  //   .modulate({ saturation: 1.5 }) // increase saturation by 50%
  //   .linear(1.2, -25) // increase contrast: multiply by 1.2, shift by -25
  //   .toBuffer();
  return buffer.toString("base64");
}

runTests();
