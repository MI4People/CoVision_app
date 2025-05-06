import express, { Request, Response } from "express";

const app = express();
const PORT = 9000;

let counter = 0;
const responses = [
  { result: "positive" },
  { result: "negative" },
  { result: "invalid" },
  { error: "Incorrect padding" },
  { error: "membrane is missing from the prediction!" },
  { error: "Image type <class 'NoneType'> not supported!" },
  { error: "kit is missing from the prediction!" },
];

app.use(express.json());

app.post("/update", (req: Request, res: Response): void => {
  const password = req.header("x-api-password");

  if (password !== "very_secret_key") {
    console.warn("Unauthorized access attempt");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const response = responses[counter % responses.length];
  counter++;
  console.log("POST /update ->", response.result || response.error);
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Mock backend running at http://localhost:${PORT}`);
});
