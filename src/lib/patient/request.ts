import {
  AccountCredentials,
  ApiCollectionResource,
  ApiResource,
  Patient,
} from "../types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export type PatientToPatch = Partial<
  Omit<
    Patient,
    "id" | "personalIdentifier" | "fullName" | "registrationMethod" | "username"
  >
>;

export async function patchPatient({
  patient,
  authToken,
}: {
  patient: PatientToPatch;
  authToken: string;
}): Promise<Patient> {
  const socialSecurityNumber = `${patient.ssnAreaNumber ?? ""}${
    patient.ssnGroupNumber ?? ""
  }${patient.ssnSerialNumber ?? ""}`;

  const response = await fetch(`${API_BASE_URL}/api/v1/patients/patients/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
    },
    body: JSON.stringify({
      patient: {
        first_name: patient.firstName,
        middle_name: patient.middleName,
        last_name: patient.lastName,
        suffix: patient.suffix,
        date_of_birth: patient.dateOfBirth,
        push_token: patient.pushToken,
        is_public: patient.isPublic,
        case_description: patient.caseDescription,
        medical_institution_id: patient.medicalInstitutionId,
        ...(socialSecurityNumber
          ? { social_security_number: socialSecurityNumber }
          : {}),
      },
    }),
  });

  const resBody = (await response.json()) as ApiResource<Patient>;
  return resBody.data.attributes;
}

export async function fetchPublicPatients({
  credentials,
}: {
  credentials: AccountCredentials;
}) {
  if (credentials.type != "attorney") return [];

  const response = await fetch(
    // Add an "s" at the end of `credentials.type` to match the plural form
    `${API_BASE_URL}/api/v1/${credentials.type}s/patients`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: credentials.authToken,
      },
    }
  );
  const resBody = (await response.json()) as ApiCollectionResource<Patient>;

  return resBody.data.map((item) => {
    return item.attributes;
  });
}
