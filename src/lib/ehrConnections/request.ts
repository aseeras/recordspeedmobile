const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface EhrConnection {
  id: number;
  status: "pending" | "connected" | "failed" | "revoked";
  medicalRecordRequestId?: number;
  institutionName?: string;
  lastError?: string;
  authorizeUrl?: string;
}

// Starts a MyChart connection for a request and returns where the patient signs in.
export async function startEhrConnection({
  authToken,
  medicalRecordRequestId,
}: {
  authToken: string;
  medicalRecordRequestId: number;
}): Promise<EhrConnection> {
  const response = await fetch(`${API_BASE_URL}/api/v1/patients/ehr_connections`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: authToken },
    body: JSON.stringify({ medical_record_request_id: medicalRecordRequestId }),
  });
  const resBody = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(resBody?.error?.message ?? "MyChart isn't available right now.");
  }
  return resBody.data.attributes;
}

export async function fetchEhrConnection({
  authToken,
  id,
}: {
  authToken: string;
  id: number;
}): Promise<EhrConnection | undefined> {
  const response = await fetch(`${API_BASE_URL}/api/v1/patients/ehr_connections`, {
    headers: { "Content-Type": "application/json", Authorization: authToken },
  });
  const resBody = await response.json().catch(() => null);
  return resBody?.data?.map((item) => item.attributes).find((c: EhrConnection) => c.id === id);
}
