import { API_BASE_URL } from "@/lib/apiBaseUrl";

// Permanently deletes the signed-in account and everything in it.
export async function deleteAccount({ authToken }: { authToken: string }): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/account`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: authToken },
  });
  if (!response.ok) {
    const resBody = await response.json().catch(() => null);
    throw new Error(resBody?.error?.message ?? "Your account couldn't be deleted. Please try again.");
  }
}
