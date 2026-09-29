import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ApiResource,
  DocumentPurchase,
  DocumentPurchaseIntent,
} from "../types";
import { useAccountCredentials } from "../auth/hooks";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export function useDocumentPurchase({ documentId }: { documentId: number }) {
  const { data: credentials } = useAccountCredentials();
  return useQuery({
    queryKey: ["documentPurchases", documentId],
    queryFn: async function () {
      return getDocumentPurchase({
        documentId,
        authToken: credentials?.authToken,
      });
    },
  });
}

async function getDocumentPurchase({
  documentId,
  authToken,
}: {
  documentId: number;
  authToken: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/attorneys/document_purchases/${documentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    }
  );
  const resBody = (await response.json()) as ApiResource<DocumentPurchase>;
  return resBody.data.attributes;
}

export function useDocumentPurchaseIntent() {
  const { data: credentials } = useAccountCredentials();
  return useMutation({
    mutationFn: function ({
      medicalRecordRequestId,
      documentId,
    }: {
      medicalRecordRequestId: number;
      documentId: number;
    }) {
      return createDocumentPurchaseIntent({
        medicalRecordRequestId,
        documentId,
        authToken: credentials?.authToken,
      });
    },
  });
}

async function createDocumentPurchaseIntent({
  medicalRecordRequestId,
  documentId,
  authToken,
}: {
  medicalRecordRequestId: number;
  documentId: number;
  authToken: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/attorneys/document_purchase_intents`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
      body: JSON.stringify({
        document_purchase_intent: {
          medical_record_request_id: medicalRecordRequestId,
          document_id: documentId,
        },
      }),
    }
  );
  const resBody =
    (await response.json()) as ApiResource<DocumentPurchaseIntent>;
  return resBody.data.attributes;
}
