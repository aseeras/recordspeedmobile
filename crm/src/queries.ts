import { useQuery as useRawQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAuth } from "./auth";
import { crm, staff } from "./api";
import type { AsanaProject, AsanaUser, CrmAccount, CrmActivity, CrmContact, CrmDeal, DemoRequest, Report, Staff } from "./types";

// Only ask the API once someone is signed in (the tabs mount for a moment before the sign-in redirect).
function useQuery<T>(options: UseQueryOptions<T>) {
  const { account } = useAuth();
  return useRawQuery<T>({ ...options, enabled: Boolean(account) && options.enabled !== false });
}

export const useReport = () => useQuery({ queryKey: ["report"], queryFn: () => crm<Report>("/report") });
export const useDeals = () => useQuery({ queryKey: ["deals"], queryFn: () => crm<{ deals: CrmDeal[]; staff: Staff[] }>("/deals") });
export const useDeal = (id: string) =>
  useQuery({ queryKey: ["deal", id], queryFn: () => crm<{ deal: CrmDeal; activities: CrmActivity[]; contacts: CrmContact[]; staff: Staff[] }>(`/deals/${id}`) });
export const useAccounts = (q: string) =>
  useQuery({ queryKey: ["accounts", q], queryFn: () => crm<{ accounts: CrmAccount[] }>(`/accounts${q ? `?q=${encodeURIComponent(q)}` : ""}`) });
export const useAccount = (id: string) =>
  useQuery({ queryKey: ["account", id], queryFn: () => crm<{ account: CrmAccount; contacts: CrmContact[]; deals: CrmDeal[]; activities: CrmActivity[] }>(`/accounts/${id}`) });
export const useFollowUps = (mine: boolean) =>
  useQuery({ queryKey: ["followups", mine], queryFn: () => crm<{ tasks: CrmActivity[]; staff: Staff[] }>(`/activities${mine ? "?mine=1" : ""}`) });
export const useProjects = () =>
  useQuery({ queryKey: ["projects"], queryFn: () => staff<{ connected: boolean; projects: AsanaProject[]; users?: AsanaUser[] }>("/projects") });
export const useDemoRequests = () => useQuery({ queryKey: ["demo_requests"], queryFn: () => staff<{ demo_requests: DemoRequest[] }>("/demo_requests") });
