import { prompt } from "./prompt";

export function buildRequest(base64Url: string, apiKey: string) {
  return {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: "You are a medical AI assistant." },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt.trim(),
            },
            {
              type: "image_url",
              image_url: { url: base64Url },
            },
          ],
        },
      ],
    }),
  };
}
