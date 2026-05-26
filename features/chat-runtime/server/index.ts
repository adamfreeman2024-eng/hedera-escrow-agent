type ChatHandlerOptions = {
  // Intentionally loose for now; real implementation will define a strict interface.
  llm: unknown;
  getTools: () => unknown;
  getSystemPrompt: () => string;
};

export function createChatHandler(_opts: ChatHandlerOptions) {
  return async function handler(req: Request): Promise<Response> {
    const contentType = req.headers.get("content-type") ?? "";
    const body =
      contentType.includes("application/json") ? await req.json().catch(() => null) : await req.text();

    return new Response(
      JSON.stringify({
        ok: true,
        note: "Placeholder chat handler. Replace features/chat-runtime/server with real implementation.",
        body
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" }
      }
    );
  };
}

