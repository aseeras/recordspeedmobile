import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { ACCOUNT_KEYS, APP_KEYS } from "../storageKeychain";
import {
  Account,
  AccountCredentials,
  AccountType,
  Attorney,
  Patient,
} from "../types";
import { signIn, SignInParams, signUp, SignUpParams } from "./request";

export const ACCOUNT_TOKEN_KEY = "@account:token";
export const ACCOUNT_DATA_KEY = "@account:data";

export const useGoogleAuth = function ({
  iosClientId,
  androidClientId,
  handleResponse,
}: {
  iosClientId: string;
  androidClientId: string;
  handleResponse: (token: string) => void;
}) {
  const [_, response, promptAsync] = Google.useAuthRequest({
    iosClientId,
    androidClientId,
  });

  useEffect(() => {
    if (response?.type === "success") {
      handleResponse(response.authentication.accessToken);
    }
  }, [response]);

  return useMutation({
    mutationFn: () => {
      return promptAsync();
    },
  });
};

export const useAccountCredentials = function (): UseQueryResult<
  AccountCredentials | null,
  Error
> {
  return useQuery({
    queryKey: [ACCOUNT_KEYS.credentials],
    queryFn: async function () {
      const credentials = await AsyncStorage.getItem(ACCOUNT_KEYS.credentials);

      if (!credentials) return null;
      return JSON.parse(credentials);
    },
  });
};

export function useCurrentAccount<T extends Patient | Attorney>() {
  return useQuery({
    queryKey: [ACCOUNT_KEYS.account],
    queryFn: async function () {
      const account = await AsyncStorage.getItem(ACCOUNT_KEYS.account);
      if (!account) return null;

      return JSON.parse(account) as T;
    },
  });
}

function useStoreCredentials() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      authToken,
      type,
    }: {
      authToken: string;
      type: AccountType;
    }) => {
      return AsyncStorage.setItem(
        ACCOUNT_KEYS.credentials,
        JSON.stringify({ authToken, type })
      );
    },
    // Keep the cached query in sync with storage. Otherwise screens that
    // already read "signed out" (e.g. the /home redirect) keep using that
    // stale value and bounce the user back to Sign In after a successful login.
    onSuccess: (_, { authToken, type }) => {
      queryClient.setQueryData([ACCOUNT_KEYS.credentials], { authToken, type });
    },
  });
}

export function useStoreAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ account }: { account: Account }) => {
      return AsyncStorage.setItem(
        ACCOUNT_KEYS.account,
        JSON.stringify(account)
      );
    },
    onSuccess: (_, { account }) => {
      queryClient.setQueryData([ACCOUNT_KEYS.account], account);
    },
  });
}

export function useAccountSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return AsyncStorage.multiRemove(
        Object.values(ACCOUNT_KEYS)
          .map((key) => (typeof key === "object" ? Object.values(key) : key))
          .flat()
      );
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useSkipOnboarding() {
  return useQuery({
    queryKey: [APP_KEYS.skipOnboarding],
    queryFn: async function () {
      // This timeout sets a minimum loading time (2 seconds) so that the loader is properly seen (for UX purposes).
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const shouldSkipOnboarding = await AsyncStorage.getItem(
        APP_KEYS.skipOnboarding
      );

      return !!shouldSkipOnboarding;
    },
  });
}

export const useStoreSkipOnboarding = function () {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: boolean) => {
      return AsyncStorage.setItem(APP_KEYS.skipOnboarding, value.toString());
    },
    onSuccess: () => {
      // Refetch flag query after mutating the store
      queryClient.invalidateQueries({
        queryKey: [APP_KEYS.skipOnboarding],
      });
    },
  });
};

export function useSignIn() {
  const { mutateAsync: storeCredentials } = useStoreCredentials();
  const { mutateAsync: storeAccount } = useStoreAccount();
  return useMutation({
    mutationFn: async function (payload: SignInParams) {
      const result = await signIn(payload);

      await storeCredentials({
        authToken: result.token,
        type: result.account.type.toLocaleLowerCase() as AccountType,
      });

      await storeAccount({
        account: result.account,
      });
      return result.account;
    },
    onError(error) {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    },
  });
}

export function useSignUp({ accountType }: { accountType: AccountType }) {
  const signInMutation = useSignIn();
  return useMutation({
    mutationFn: async function (payload: SignUpParams) {
      let account = await signUp(payload);
      account = await signInMutation.mutateAsync({
        email: account.email,
        password: payload.password,
        firstName: account.firstName,
        lastName: account.lastName,
        personalIdentifier: account.email,
        registrationMethod: "internal",
      });
      return account;
    },
  });
}
