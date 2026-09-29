import { ApiResource, Attorney } from "../types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export type AttorneyToPatch = Partial<
  Omit<
    Attorney,
    "id" | "personalIdentifier" | "fullName" | "registrationMethod" | "username"
  >
>;

export async function fetchAttorney({
  attorney,
  authToken,
}: {
  attorney: Attorney;
  authToken: string;
}): Promise<Attorney> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/attorneys/attorneys/${attorney.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    }
  );

  const resBody = (await response.json()) as ApiResource<Attorney>;
  return resBody.data.attributes;
}

export async function patchAttorney({
  attorney,
  authToken,
}: {
  attorney: AttorneyToPatch;
  authToken: string;
}): Promise<Attorney> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/attorneys/attorneys/me`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify({
        attorney: {
          first_name: attorney.firstName,
          last_name: attorney.lastName,
          middle_name: attorney.middleName,
          suffix: attorney.suffix,
          push_token: attorney.pushToken,
          bar_state: attorney.barState,
          bar_state_number: attorney.barStateNumber,
          phone: attorney.phone,
          professional_email: attorney.professionalEmail,
          website: attorney.website,
        },
      }),
    }
  );

  const resBody = (await response.json()) as ApiResource<Attorney>;
  return resBody.data.attributes;
}
