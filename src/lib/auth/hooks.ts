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
import { startActivity } from "./session";
import {
  Account,
  AccountCredentials,
  AccountType,
  Attorney,
  Patient,
} from "../types";
import {
  signIn,
  SignInParams,
  SignInResult,
  signOutOfApi,
  signUp,
  SignUpParams,
  TwoFactorChallenge,
  verifyTwoFactor,
} from "./request";
import { t } from "@/lib/i18n";

export const ACCOUNT_TOKEN_KEY = "@account:token";
// In-memory only: the pending two-step sign-in, and recovery codes to show once.
export const TWO_FACTOR_KEY = ["auth", "twoFactor"];
export const RECOVERY_CODES_KEY = ["auth", "recoveryCodes"];
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
    // endSession: also end it on the API (not needed when the API already ended it).
    mutationFn: async (options?: { endSession?: boolean }) => {
      if (options?.endSession ?? true) {
        const stored = await AsyncStorage.getItem(ACCOUNT_KEYS.credentials);
        await signOutOfApi(stored ? JSON.parse(stored).authToken : undefined);
      }
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

// Stores a completed sign-in. When the account needs two-step sign-in, keeps the challenge for the
// two_factor screen instead and returns null.
function useCompleteSignIn() {
  const queryClient = useQueryClient();
  const { mutateAsync: storeCredentials } = useStoreCredentials();
  const { mutateAsync: storeAccount } = useStoreAccount();
  return async (result: SignInResult) => {
    if ("twoFactor" in result) {
      queryClient.setQueryData<TwoFactorChallenge>(TWO_FACTOR_KEY, result.twoFactor);
      return null;
    }
    await startActivity();
    await storeCredentials({
      authToken: result.token,
      type: result.account.type.toLocaleLowerCase() as AccountType,
    });
    await storeAccount({ account: result.account });
    queryClient.removeQueries({ queryKey: TWO_FACTOR_KEY });
    if (result.recoveryCodes) queryClient.setQueryData(RECOVERY_CODES_KEY, result.recoveryCodes);
    return result.account;
  };
}

export function useSignIn() {
  const completeSignIn = useCompleteSignIn();
  return useMutation({
    mutationFn: async function (payload: SignInParams) {
      return completeSignIn(await signIn(payload));
    },
    onError(error) {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    },
  });
}

export function useTwoFactorChallenge() {
  return useQuery<TwoFactorChallenge | null>({
    queryKey: TWO_FACTOR_KEY,
    queryFn: () => null,
    staleTime: Infinity,
  });
}

export function useRecoveryCodes() {
  return useQuery<string[] | null>({
    queryKey: RECOVERY_CODES_KEY,
    queryFn: () => null,
    staleTime: Infinity,
  });
}

export function useTwoFactorSignIn() {
  const completeSignIn = useCompleteSignIn();
  return useMutation({
    mutationFn: async function ({ ticket, code }: { ticket: string; code: string }) {
      const account = await completeSignIn(await verifyTwoFactor(ticket, code));
      if (!account) throw new Error(t("Please sign in again."));
      return account;
    },
  });
}

export function useSignUp({ accountType }: { accountType: AccountType }) {
  const signInMutation = useSignIn();
  return useMutation({
    mutationFn: async function (payload: SignUpParams) {
      const created = await signUp(payload);
      // null: the account continues with two-step sign-in (attorneys).
      return signInMutation.mutateAsync({
        email: created.email,
        password: payload.password,
        firstName: created.firstName,
        lastName: created.lastName,
        personalIdentifier: created.email,
        registrationMethod: "internal",
      });
    },
  });
}
