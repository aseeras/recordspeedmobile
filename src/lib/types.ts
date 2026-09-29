export interface ApiResource<T> {
  data: {
    attributes: T;
    id: string;
    type: string;
  };
}

export interface ApiCollectionResource<T> {
  data: {
    attributes: T;
    id: string;
    type: string;
  }[];
}

export interface AccountCredentials {
  authToken: string;
  type: AccountType;
}

export type AccountType = "patient" | "attorney" | "insurance_company";

export interface Account {
  id: number;
  personalIdentifier: string;
  username: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  fullName: string;
  dateOfBirth?: string;
  registrationMethod: string;
  pushToken?: string;
  ssnAreaNumber?: string;
  ssnGroupNumber?: string;
  ssnSerialNumber?: string;
  medicalInstitutionId?: number;
  isPublic: boolean;
  caseDescription?: string;
  barState?: string;
  barStateNumber?: string;
  phone?: string;
  professionalEmail?: string;
  website?: string;
  type: "Patient" | "Attorney";
  subscriptions?: ApiResource<Subscription>[];
}

export type Patient = Partial<
  Omit<
    Account,
    "phone" | "professionalEmail" | "website" | "barState" | "barStateNumber"
  >
> & {
  attorneysCount?: number;
};

export type Attorney = Partial<
  Omit<
    Account,
    | "dateOfBirth"
    | "ssnAreaNumber"
    | "ssnGroupNumber"
    | "ssnSerialNumber"
    | "medicalInstitutionId"
    | "isPublic"
    | "caseDescription"
  >
> & {
  publicPatientsCount?: number;
};

export interface Contact {
  id: number;
  patientId: number;
  attorney: Attorney;
}

export enum MedicalRecordRequestStatus {
  pending,
  fulfilled,
}

export interface MedicalRecordRequest {
  id: number;
  from: string;
  to: string;
  status?: MedicalRecordRequestStatus;
  medicalInstitutionId: number;
  patientId: number;
  createdAt?: string;
  documents?: Document[];
  sharingPatient?: Patient;
  sharedAt?: string;
}

export interface Document {
  id: number;
  url: string;
  filename: string;
  contentType?: string;
  byteSize?: string;
  createdAt: string;
  purchased: boolean;
}

export interface Plan {
  id: number;
  name: string;
  userType: "attorney" | "patient";
  interval: "month" | "year";
  price: {
    cents: number;
    currency_iso: string;
  };
  stripePriceId?: string;
  features: ApiResource<PlanFeature>[];
}

export interface PlanFeature {
  title: string;
  description: string;
  icon: string;
}

export interface Subscription {
  id: number;
  planId: number;
  accountId: number;
  activeAt: string;
  stripeId: string;
}

export interface SubscriptionIntent {
  id: number;
  planId: number;
  clientSecret?: string;
}

export interface DocumentPurchaseIntent {
  id: string;
  clientSecret: string;
  ephemeralKey: string;
  pageCount: number;
  perPagePriceCents: number;
}

export interface DocumentPurchase {
  id: string;
  medicalRecordRequestId: number;
  priceCents: number;
  price: {
    cents: number;
    currency_iso: string;
  };
  accountId: number;
  document: Document;
}
