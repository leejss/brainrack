import { createWorkedExampleStreamResponse } from "@/lib/ai/stream";
import {
  InvalidWorkedExampleRequestError,
  parseWorkedExampleGenerationRequest,
} from "@/lib/generation/request";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await parseJsonBody(request);

  if (!body.ok) {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const generationRequest = parseWorkedExampleGenerationRequest(body.value);
    return createWorkedExampleStreamResponse(generationRequest);
  } catch (error) {
    if (error instanceof InvalidWorkedExampleRequestError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    const message =
      error instanceof Error
        ? error.message
        : "Could not start worked example generation.";

    return Response.json({ error: message }, { status: 500 });
  }
}

async function parseJsonBody(
  request: Request,
): Promise<{ ok: true; value: unknown } | { ok: false }> {
  try {
    return { ok: true, value: await request.json() };
  } catch {
    return { ok: false };
  }
}
