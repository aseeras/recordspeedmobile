const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantSuggestion {
  type: string;
  target: string;
  label: string;
}

// Asks the RecordSpeed assistant. It can look up the signed-in account (read-only) and suggest screens.
export async function askAssistant({
  authToken,
  messages,
  screen,
}: {
  authToken: string;
  messages: AssistantMessage[];
  screen?: string;
}): Promise<{ message: string; suggestions: AssistantSuggestion[] }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/assistant_messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: authToken },
    body: JSON.stringify({ surface: "ios", screen, messages: messages.slice(-20) }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.error?.message ?? "The assistant is unavailable right now.");
  }
  return { message: body.message, suggestions: body.suggestions ?? [] };
}
