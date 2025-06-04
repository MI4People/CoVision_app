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
    { dir: "testData/covid/negative", expected: "negative" },
    { dir: "testData/covid/positive", expected: "positive" },
    { dir: "testData/pregnancy/negative", expected: "negative" },
    { dir: "testData/pregnancy/positive", expected: "positive" },
  ];

  const results: Result[] = [];

  for (const { dir, expected } of testFolders) {
    const folderPath = path.resolve(dir);
    if (!fs.existsSync(folderPath)) {
      console.warn(`Folder not found: ${folderPath}`);
      continue;
    }

    const files = fs.readdirSync(folderPath);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      console.log(`Processing file ${i + 1} of ${files.length}: ${file}`);

      const result = await checkFile(path.join(folderPath, file), expected);
      if (!result) continue;
      console.log(result);
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

  // check if directory
  if (fs.lstatSync(filePath).isDirectory()) {
    return;
  }

  const base64Data = await readFileWithEnhancements(filePath); // updated
  const result = await getResult(base64Data);
  const status = JSON.parse(result)?.result === expected ? "PASS" : "FAIL";

  const parts = filePath.split(path.sep);
  const fileDisplay = parts.slice(-3).join(path.sep); // last two folders + file name

  return { file: fileDisplay, result, expected, status };
}

async function getResult(base64Data: string) {
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
