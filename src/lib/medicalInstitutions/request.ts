import Toast from "react-native-toast-message";

export type MedicalInstitution = {
  id: number;
  name: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function fetchMedicalInstitutions(): Promise<
  MedicalInstitution[]
> {
  const response = await fetch(`${API_BASE_URL}/medical_institutions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resBody = await response.json();
  const medicalInstitutions = resBody.data.medical_institutions;

  switch (resBody.status.code) {
    case 200:
      return medicalInstitutions;
  }
}
