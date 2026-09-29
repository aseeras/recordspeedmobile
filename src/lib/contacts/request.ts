import { AccountCredentials, ApiCollectionResource, Contact } from "../types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function fetchContacts({
  credentials,
}: {
  credentials: AccountCredentials;
}) {
  if (credentials.type != "patient") return [];

  const response = await fetch(`${API_BASE_URL}/api/v1/patients/contacts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: credentials.authToken,
    },
  });
  const resBody = (await response.json()) as ApiCollectionResource<any>;

  return resBody.data.map((item) => {
    item.attributes.attorney = item?.attributes.attorney?.data?.attributes;
    return item.attributes;
  });
}

export async function createContact({
  patientId,
  authToken,
}: {
  patientId: number;
  authToken: string;
}): Promise<Contact> {
  const response = await fetch(`${API_BASE_URL}/api/v1/attorneys/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
    },
    body: JSON.stringify({
      contact: {
        patient_id: patientId,
      },
    }),
  });
  const resBody = await response.json();

  if (response.status != 201) {
    throw new Error();
  }

  return resBody?.data?.attributes;
}
