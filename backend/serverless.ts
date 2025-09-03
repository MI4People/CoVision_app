import type { AWS } from "@serverless/typescript";

const serverlessConfig: AWS = {
  service: "my-ts-api",
  frameworkVersion: "4",
  plugins: ["serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs22.x",
  },
  functions: {
    root: {
      handler: "src/handler.handle",
      events: [{ httpApi: { path: "/", method: "POST" } }],
      timeout: 30,
      environment: {
        OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ?? "",
        API_KEY: process.env.API_KEY ?? "",
      },
    },
  },
};

module.exports = serverlessConfig;
