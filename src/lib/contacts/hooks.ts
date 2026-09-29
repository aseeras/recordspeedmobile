import { useMutation, useQuery } from "@tanstack/react-query";
import { useAccountCredentials } from "../auth/hooks";
import { ACCOUNT_KEYS } from "../storageKeychain";
import { createContact, fetchContacts } from "./request";

export const MEDICAL_RECORD_REQUESTS_KEY = "@medicalRecordRequests";
export const PATIENTS_MEDICAL_RECORD_REQUESTS_KEY =
  "@patients@medicalRecordRequests";

export function usePatientContacts() {
  const { data: credentials } = useAccountCredentials();
  return useQuery({
    queryKey: [ACCOUNT_KEYS.contacts],
    enabled: !!credentials?.authToken && credentials?.type == "patient",
    queryFn: async function () {
      return fetchContacts({
        credentials,
      });
    },
  });
}

export function useCreateContact() {
  const { data: credentials } = useAccountCredentials();
  return useMutation({
    mutationFn: ({ patientId }: { patientId: number }) =>
      createContact({
        patientId,
        authToken: credentials?.authToken,
      }),
  });
}
