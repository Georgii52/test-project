"use client";

import { DefaultWork } from "./../../../../backend/src/db/schema";
import { apiGet, apiPost, apiPatch } from "@/app/lib/data";
import type {
  TasksResponse,
  User,
  Role,
  CreateDefautWorkInput,
} from "@repo/shared";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  CreateUserInput,
  CreateRoleInput,
} from "@repo/shared";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";

const retryFn = (failureCount: number, error: Error) => {
  if ((error as Error & { cause?: number }).cause === 404) return false;
  return failureCount < 2;
};

function useMutate<T>(
  mutationFn: (data: T) => Promise<unknown>,
  invalidateKey: QueryKey,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invalidateKey }),
  });
}

export function useUsers() {
  const { data, isPending, error } = useQuery<{ users: User[] }>({
    queryKey: ["users"],
    queryFn: () => apiGet("/api/users"),
    retry: retryFn,
  });

  return { data: data?.users ?? [], isPending, error };
}

export function useRoles() {
  const { data, isPending, error } = useQuery<{ roles: Role[] }>({
    queryKey: ["roles"],
    queryFn: () => apiGet("/api/roles"),
    retry: retryFn,
  });

  return { data: data?.roles ?? [], isPending, error };
}

export function useDefaultWorks() {
  const { data, isPending, error } = useQuery<{ defaultWorks: DefaultWork[] }>({
    queryKey: ["defaultWorks"],
    queryFn: () => apiGet("/api/default-works"),
    retry: retryFn,
  });

  return { data: data?.defaultWorks ?? [], isPending, error };
}

export function useTasks({ page, date }: { page: number; date: string }) {
  return useQuery<TasksResponse>({
    queryKey: ["tasks", page, date],
    queryFn: () =>
      apiGet(`/api/tasks?page=${page}${date ? `&date=${date}` : ""}`),
    retry: retryFn,
  });
}

export function useCreateTask() {
  return useMutate(
    (data: CreateTaskInput) => apiPost("/api/tasks", data),
    ["tasks"],
  );
}

export function useUpdateTask() {
  return useMutate(
    ({ id, ...data }: { id: string } & UpdateTaskInput) =>
      apiPatch(`/api/tasks/${id}`, data),
    ["tasks"],
  );
}

export function useCreateUser() {
  return useMutate(
    (data: CreateUserInput) => apiPost("/api/users", data),
    ["users"],
  );
}

export function useCreateRole() {
  return useMutate(
    (data: CreateRoleInput) => apiPost("/api/roles", data),
    ["roles"],
  );
}

export function useCreateDefaultWork() {
  return useMutate(
    (data: CreateDefautWorkInput) => apiPost("/api/default-works", data),
    ["defaultWorks"],
  );
}
