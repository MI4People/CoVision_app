import { GptClient } from "./gptClient";
import * as fs from "node:fs";

const client = new GptClient();
console.log(process.argv);
const base64 = fs.readFileSync(process.argv[2]).toString("base64");

client
  .getResult(`data:image/png;base64,${base64}`)
  .then(console.log)
  .catch(console.error);
