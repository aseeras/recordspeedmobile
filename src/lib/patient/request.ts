import {
  AccountCredentials,
  ApiCollectionResource,
  ApiResource,
  Patient,
} from "../types";
import { API_BASE_URL } from "@/lib/apiBaseUrl";

export type PatientToPatch = Partial<
  Omit<
    Patient,
    "id" | "personalIdentifier" | "fullName" | "registrationMethod" | "username"
  >
> & {
  // The consent text version the patient agreed to when turning their card public.
  publicProfileConsent?: string;
};

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
        public_profile_consent: patient.publicProfileConsent,
        case_description: patient.caseDescription,
        medical_institution_id: patient.medicalInstitutionId,
        ...(socialSecurityNumber
          ? { social_security_number: socialSecurityNumber }
          : {}),
      },
    }),
  });

  const resBody = await response.json();
  if (!response.ok || !resBody.data) {
    throw new Error(
      resBody.error?.message ?? "Something went wrong updating your profile."
    );
  }
  return (resBody as ApiResource<Patient>).data.attributes;
}

export type AccessLogEntry = {
  id: number;
  action: string;
  description: string;
  at: string;
  count: number;
  success: boolean;
  recordsRequestId: number | null;
  document: string | null;
  who: { name: string; role: string | null; organization: string | null };
};

// Who has seen my records: what other accounts did with the patient's information.
export async function fetchAccessLog({
  authToken,
}: {
  authToken: string;
}): Promise<AccessLogEntry[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/patients/access_log`, {
    headers: { "Content-Type": "application/json", Authorization: authToken },
  });
  if (!response.ok) throw new Error("Couldn't load who has seen your records.");
  return ((await response.json()) as { data: AccessLogEntry[] }).data;
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
