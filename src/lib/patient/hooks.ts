import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  useAccountCredentials,
  useCurrentAccount,
  useStoreAccount,
} from "../auth/hooks";
import { ACCOUNT_KEYS } from "../storageKeychain";
import { Account, Patient } from "../types";
import { fetchPublicPatients, patchPatient, PatientToPatch } from "./request";

export function usePublicPatients(): UseQueryResult<Patient[] | null, Error> {
  const { data: credentials } = useAccountCredentials();

  return useQuery({
    queryKey: [ACCOUNT_KEYS.patients.public],
    enabled: !!credentials?.authToken && credentials?.type == "attorney",
    queryFn: async function () {
      return fetchPublicPatients({
        credentials,
      });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  const { data: credentials } = useAccountCredentials();
  const { data: account } = useCurrentAccount<Patient>();
  const { mutate: storeAccount } = useStoreAccount();
  return useMutation({
    mutationFn: async function (patient: PatientToPatch) {
      const patchedPatient = await patchPatient({
        patient,
        authToken: credentials?.authToken,
      });

      await storeAccount({
        account: { ...account, ...patchedPatient } as Account,
      });
    },
    onSuccess: async function () {
      await queryClient.refetchQueries({
        queryKey: [ACCOUNT_KEYS.account],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
