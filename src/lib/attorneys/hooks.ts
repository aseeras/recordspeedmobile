import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  useAccountCredentials,
  useCurrentAccount,
  useStoreAccount,
} from "../auth/hooks";
import { ACCOUNT_KEYS } from "../storageKeychain";
import { AttorneyToPatch, patchAttorney } from "./request";
import { Account, Attorney } from "../types";

export function useUpdateAttorney(queryClient: QueryClient) {
  const { data: credentials } = useAccountCredentials();
  const { data: account } = useCurrentAccount<Attorney>();
  const { mutate: storeAccount } = useStoreAccount();
  return useMutation({
    mutationFn: async function (attorney: AttorneyToPatch) {
      const patchedAttorney = await patchAttorney({
        attorney,
        authToken: credentials?.authToken,
      });

      await storeAccount({
        account: { ...account, ...patchedAttorney } as Account,
      });
    },
    onSuccess: async function () {
      await queryClient.refetchQueries({
        queryKey: [ACCOUNT_KEYS.account],
      });
    },
    onError: (error) =>
      Toast.show({
        type: "error",
        text1: `Something went wrong updating the attorney.`,
      }),
  });
}
