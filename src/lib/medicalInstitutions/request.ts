import Toast from "react-native-toast-message";
import { API_BASE_URL } from "@/lib/apiBaseUrl";

export type MedicalInstitution = {
  id: number;
  name: string;
};

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
