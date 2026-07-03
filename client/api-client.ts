import type { WorkedExampleGenerationRequest } from "@/lib/types";

export type WorkedExampleStreamResult = {
  markdown: string;
  model: string;
  provider: string;
};

export async function streamWorkedExampleFromApi({
  request,
  signal,
  onMarkdown,
}: {
  request: WorkedExampleGenerationRequest;
  signal: AbortSignal;
  onMarkdown: (markdown: string) => void;
}): Promise<WorkedExampleStreamResult> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (!response.body) {
    throw new Error("Streaming response body is empty.");
  }

  const markdown = await readMarkdownStream(response.body, onMarkdown);

  return {
    markdown,
    model: response.headers.get("X-AI-Model") ?? "gemini-3.5-flash",
    provider: response.headers.get("X-AI-Provider") ?? "google",
  };
}

async function readMarkdownStream(
  body: ReadableStream<Uint8Array>,
  onMarkdown: (markdown: string) => void,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let markdown = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      markdown += decoder.decode();
      return markdown;
    }

    markdown += decoder.decode(value, { stream: true });
    onMarkdown(markdown);
  }
}

async function readErrorMessage(response: Response) {
  const fallback = `Request failed with ${response.status}`;
  const text = await response.text();

  try {
    const data = JSON.parse(text) as { error?: string };
    return data.error ?? fallback;
  } catch {
    return text || fallback;
  }
}
