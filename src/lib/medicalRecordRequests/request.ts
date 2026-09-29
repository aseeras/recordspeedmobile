import Toast from "react-native-toast-message";
import { router } from "expo-router";
import {
  AccountCredentials,
  ApiCollectionResource,
  MedicalRecordRequest,
} from "../types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function fetchOwnedMedicalRecordRequests({
  credentials,
}: {
  credentials: AccountCredentials;
}) {
  if (credentials.type != "patient") return [];

  const response = await fetch(
    `${API_BASE_URL}/api/v1/patients/medical_record_requests`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials.authToken,
      },
    }
  );
  const resBody =
    (await response.json()) as ApiCollectionResource<MedicalRecordRequest>;

  return resBody.data.map((item) => {
    return item.attributes;
  });
}

export async function fetchSharedWithMeMedicalRecordRequests({
  credentials,
}: {
  credentials: AccountCredentials;
}) {
  if (credentials.type != "attorney") return [];

  const response = await fetch(
    `${API_BASE_URL}/api/v1/attorneys/medical_record_requests/shared_with_me`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials.authToken,
      },
    }
  );
  const resBody =
    (await response.json()) as ApiCollectionResource<MedicalRecordRequest>;

  return resBody.data.map((item) => {
    return item.attributes;
  });
}

export async function createMedicalRecordRequest({
  medicalRecordRequest,
  authToken,
}: {
  medicalRecordRequest: Omit<MedicalRecordRequest, "id">;
  authToken: string;
}): Promise<MedicalRecordRequest> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/patients/medical_record_requests`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify({
        medical_record_request: {
          from: medicalRecordRequest.from,
          to: medicalRecordRequest.to,
          medical_institution_id: medicalRecordRequest.medicalInstitutionId,
          patient_id: medicalRecordRequest.patientId,
        },
      }),
    }
  );
  const resBody = await response.json();

  return resBody;
}

export async function shareMedicalRecordRequest({
  authToken,
  medicalRecordRequestId,
  recipientUsername,
}: {
  authToken: String;
  medicalRecordRequestId: number;
  recipientUsername: string;
}): Promise<{
  statusCode: number;
  statusMessage: string;
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/patients/medical_record_requests/share`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
        body: JSON.stringify({
          medical_record_request_id: medicalRecordRequestId,
          recipient_username: recipientUsername,
        }),
      }
    );

    const resBody = await response.json();

    return {
      statusCode: response.status,
      // Expect only an error message; success messages are built front-side
      statusMessage: resBody?.error?.message,
    };
  } catch (error) {
    router.back();
    Toast.show({
      type: "error",
      text1: `Something went wrong: ${error}`,
    });
  }
}
