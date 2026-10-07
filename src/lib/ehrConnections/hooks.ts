import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useRef, useState } from "react";
import Toast from "react-native-toast-message";
import { useAccountCredentials } from "../auth/hooks";
import { ACCOUNT_KEYS } from "../storageKeychain";
import { MedicalRecordRequest, MedicalRecordRequestStatus } from "../types";
import { fetchEhrConnection, startEhrConnection } from "./request";

// Where the API sends the browser once MyChart is done (see the backend's EPIC_APP_RETURN_URL).
export const EHR_RETURN_URL = "record-speed-mobile://ehr-connected";
const POLL_INTERVAL_MS = 3000;
const POLL_ATTEMPTS = 30;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Connects the patient's MyChart account for one request: they sign in to MyChart in a secure browser sheet,
// then RecordSpeed imports their records into the request. `importing` stays true until the records arrive.
// The request is given here or to connect(), e.g. right after creating it.
export function useConnectMyChart(medicalRecordRequestId?: number) {
  const { data: credentials } = useAccountCredentials();
  const queryClient = useQueryClient();
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const target = useRef(medicalRecordRequestId);

  const isFulfilled = (requests?: MedicalRecordRequest[]) =>
    requests
      ?.find((r) => r.id === target.current)
      ?.status?.toString() === MedicalRecordRequestStatus[MedicalRecordRequestStatus.fulfilled];

  async function waitForImport(connectionId: number) {
    setImporting(true);
    try {
      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
        await sleep(POLL_INTERVAL_MS);
        await queryClient.refetchQueries({ queryKey: [ACCOUNT_KEYS.medicalRecordRequests.owned] });
        if (isFulfilled(queryClient.getQueryData([ACCOUNT_KEYS.medicalRecordRequests.owned]))) {
          Toast.show({ type: "success", text1: "Your MyChart records are here" });
          setImported(true);
          return;
        }
        const connection = await fetchEhrConnection({ authToken: credentials.authToken, id: connectionId });
        if (connection?.lastError) {
          Toast.show({ type: "error", text1: "Couldn't import from MyChart", text2: connection.lastError });
          return;
        }
      }
      Toast.show({ type: "info", text1: "Still importing from MyChart", text2: "Pull down to refresh in a minute." });
    } finally {
      setImporting(false);
    }
  }

  const connect = useMutation({
    mutationFn: async (requestId?: number) => {
      target.current = requestId ?? medicalRecordRequestId;
      const connection = await startEhrConnection({
        authToken: credentials?.authToken,
        medicalRecordRequestId: target.current,
      });
      const result = await WebBrowser.openAuthSessionAsync(connection.authorizeUrl, EHR_RETURN_URL);
      if (result.type !== "success") return { status: "cancelled", connectionId: connection.id };

      const { queryParams } = Linking.parse(result.url);
      return { status: String(queryParams?.status ?? ""), connectionId: connection.id };
    },
    onSuccess: ({ status, connectionId }) => {
      if (status === "connected") {
        Toast.show({ type: "success", text1: "MyChart connected", text2: "Importing your records…" });
        waitForImport(connectionId);
      } else if (status === "expired") {
        Toast.show({ type: "error", text1: "That took too long", text2: "Please connect MyChart again." });
      } else if (status !== "cancelled") {
        Toast.show({ type: "error", text1: "MyChart didn't connect", text2: "Please try again." });
      }
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: "Couldn't open MyChart", text2: `${error.message ?? error}` });
    },
  });

  return {
    connect: (requestId?: number) => connect.mutate(requestId),
    connectAsync: (requestId?: number) => connect.mutateAsync(requestId),
    connecting: connect.isPending,
    importing,
    imported,
  };
}
