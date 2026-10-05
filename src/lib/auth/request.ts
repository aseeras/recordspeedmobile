import * as changeCase from "change-case";
import { Account, AccountType } from "../types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface SignInParams {
  personalIdentifier: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  registrationMethod: string;
  type?: "Patient" | "Attorney";
}

export async function signIn({
  personalIdentifier,
  email,
  firstName,
  lastName,
  password,
  registrationMethod,
  type,
}: SignInParams) {
  const response = await fetch(`${API_BASE_URL}/accounts/sign_in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account: {
        personal_identifier: personalIdentifier,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
        registration_method: registrationMethod,
        type,
      },
    }),
  });
  const resBody = await response.json();
  if (resBody.error) throw new Error(resBody.error);
  if (resBody.status.code !== 200) throw new Error(resBody.status.message);

  // Use the standard Headers API: Expo's fetch has no `headers.map` (the old
  // whatwg-fetch internal), which left every session without a token.
  const token = response.headers.get("authorization");
  if (!token) {
    throw new Error("Signed in, but the server did not return a session token.");
  }

  return {
    token,
    account: resBody.data.account,
    statusCode: resBody.status.code,
    statusMessage: resBody.status.message,
  } as {
    token: string;
    account?: Account;
    statusCode: number;
    statusMessage: string;
  };
}
export interface SignUpParams {
  personalIdentifier: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  registrationMethod: string;
  type?: AccountType;
}

export async function signUp({
  personalIdentifier,
  email,
  firstName,
  lastName,
  password,
  registrationMethod,
  type = "patient",
}: SignUpParams) {
  const response = await fetch(`${API_BASE_URL}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      account: {
        personal_identifier: personalIdentifier,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
        registration_method: registrationMethod,
        type: changeCase.pascalCase(type),
      },
    }),
  });

  const resBody = await response.json();

  if (resBody.status.code !== 201) throw new Error(resBody.status.message);

  return resBody.data.account as Account;
}
