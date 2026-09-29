import { ApiCollectionResource, ApiResource, Plan } from "../types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function fetchPlans({
  userType,
  authToken,
}: {
  userType: "attorneys" | "patients";
  authToken: string;
}): Promise<Plan[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/${userType}/plans`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
    },
  });

  const resBody = (await response.json()) as ApiCollectionResource<Plan>;
  return resBody.data.map((item) => {
    return item.attributes;
  });
}

export async function fetchCurrentPlan({
  userType,
  accountId,
  authToken,
}: {
  userType: "attorneys" | "patients";
  accountId: number;
  authToken: string;
}): Promise<Plan> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/${userType}/${userType}/${accountId}/plans/active`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    }
  );

  const resBody = (await response.json()) as ApiResource<Plan>;
  return resBody.data.attributes;
}
