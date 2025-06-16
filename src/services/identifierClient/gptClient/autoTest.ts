import { GptClient } from "./gptClient";
import * as fs from "node:fs";
import * as path from "node:path";
import sharp from "sharp";
import { TestResult } from "@/src/lib/types/testResult";

const client = new GptClient();

interface Result {
  file: string;
  result: string;
  expected: string;
  status: string;
}

const testFolders = [
  // { dir: "testData/covid/negative", expected: "negative" },
  // { dir: "testData/covid/positive", expected: "positive" },
  { dir: "testData/covid/unknown", expected: "unknown" },
  // { dir: "testData/pregnancy/negative", expected: "negative" },
  // { dir: "testData/pregnancy/positive", expected: "positive" },
];

async function runTests() {
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

  const sortedResults = sortResults(results);

  printResults(sortedResults);
  writeResults(sortedResults);
}

async function checkFile(filePath: string, expected: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  const base64Data = await readFileWithEnhancements(filePath);
  const result = await getResult(base64Data);
  const status = result.result === expected ? "PASS" : "FAIL";
  return { file: filePath, ...result, expected, status };
}

async function readFileWithEnhancements(fileName: string): Promise<string> {
  try {
    const buffer = fs.readFileSync(fileName);
    const processedImage = await sharp(buffer)
      .modulate({ saturation: 1.5 }) // increase saturation by 50%
      .linear(1.2, -25) // increase contrast: multiply by 1.2, shift by -25
      .toBuffer();

    // writeImage(fileName, processedImage);

    return processedImage.toString("base64");
  } catch (error) {
    console.error(`Error processing file ${fileName}:`, error);
    return Promise.resolve("");
  }
}

async function getResult(base64Data: string): Promise<TestResult> {
  try {
    return await client.getResult(`data:image/png;base64,${base64Data}`);
  } catch (error) {
    console.error("Error in getResult:", error);
    return Promise.resolve({ result: "ERROR", confidence: 0 });
  }
}

function sortResults(results: Result[]) {
  return results
    .toSorted((a, b) => a.status.localeCompare(b.status))
    .map((result) => ({
      ...result,
      file: path.relative(process.cwd(), result.file),
    }));
}

function printResults(results: Result[]) {
  console.log("\nTest Results:");
  console.table(results, [
    "file",
    "result",
    "confidence",
    "expected",
    "status",
  ]);

  const failCount = results.filter((r) => r.status === "FAIL").length;

  console.log(
    `Fail rate: ${failCount}/ ${results.length} (${(failCount / results.length) * 100}%)`,
  );
}

function writeResults(results: Result[]) {
  const resultsFilePath = path.resolve("testResults.json");
  fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2));
}

function writeImage(fileName: string, image: Buffer<ArrayBufferLike>) {
  const processedPath = path.join(path.dirname(fileName), "processed");
  if (!fs.existsSync(processedPath)) {
    fs.mkdirSync(processedPath);
  }
  const processedFile = path.join(processedPath, path.basename(fileName));
  fs.writeFileSync(processedFile, image);
}

runTests();
