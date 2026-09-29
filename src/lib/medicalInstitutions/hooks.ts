import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchMedicalInstitutions, MedicalInstitution } from "./request";

const MEDICAL_INSTITUTIONS_KEY = "@medicalInstitutions";
const MEDICAL_INSTITUTION_KEY = "@medicalInstitutions:item";

export const useMedicalInstitutions = function ({
  query = "",
}: { query?: string } = {}): UseQueryResult<MedicalInstitution[], Error> {
  return useQuery({
    networkMode: "online",
    queryKey: [MEDICAL_INSTITUTIONS_KEY, query],
    queryFn: async function () {
      const data = await fetchMedicalInstitutions();

      return query
        ? data.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
          )
        : data;
    },
  });
};

export function useMedicalInstitution(id: number) {
  return useQuery({
    queryKey: [MEDICAL_INSTITUTION_KEY, id],
    queryFn: async function () {
      const data = await fetchMedicalInstitutions();
      return data.find((item) => item.id == id) ?? null;
    },
  });
}
