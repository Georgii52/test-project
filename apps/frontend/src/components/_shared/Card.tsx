"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types";
import { getColorByStatus } from "@/lib/utils";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { apiDelete, apiPatch } from "@/app/lib/data";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import EditTaskModal from "../modals/EditTaskModal";

export default function Card({ data }: { data: Task }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();

  const changeStatus = async (id: string) => {
    setError("");
    setLoading(true);
    try {
      const updated = (await apiPatch(`/api/tasks/${id}/toggle`)) as Task;
      queryClient.setQueriesData({ queryKey: ["tasks"] }, (old: unknown) => {
        const cache = old as { data: Task[]; totalPages: number } | undefined;
        if (!cache) return old;
        return {
          ...cache,
          data: cache.data.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        };
      });
      toast.success("Успешно обновлено");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const consent = confirm("Удалить выбранную запись?");
    if (!consent) return;
    setError("");
    setIsDeleting(true);
    try {
      await apiDelete(`/api/tasks/${id}`);
      queryClient.setQueriesData({ queryKey: ["tasks"] }, (old: unknown) => {
        const cache = old as { data: Task[]; totalPages: number } | undefined;
        if (!cache) return old;
        return { ...cache, data: cache.data.filter((t) => t.id !== id) };
      });
      toast.success("Успешно удалено");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Неизвестная ошибка");
      toast.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <Item
        variant={data.status === "active" ? "outline" : "muted"}
        size="default"
      >
        <ItemMedia variant="icon">
          <div
            className={`w-4 h-4 rounded-full ${getColorByStatus(data.status)}`}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{data.workType}</ItemTitle>
          <ItemDescription>
            Объем работ: {data.workAmount} {data.workAmountUnit}
          </ItemDescription>
          <ItemDescription>
            Исполнитель: <span className="font-bold">{data.executor.role}</span>{" "}
            {data.executor.name}
          </ItemDescription>
          <ItemDescription>
            Создано: {new Date(data.createdAt).toLocaleDateString("ru-RU")}
          </ItemDescription>
          {data.doneAt && (
            <ItemDescription>
              Выполнено: {new Date(data.doneAt).toLocaleDateString("ru-RU")}
            </ItemDescription>
          )}
        </ItemContent>
        <ItemActions className="flex flex-col items-end gap-2">
          {data.status === "active" && (
            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-8 w-4"
              onClick={() => handleDelete(data.id)}
            >
              {isDeleting ? <Spinner /> : <Trash className="size-4" />}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => changeStatus(data.id)}
          >
            {loading ? (
              <span className="flex gap-1 items-center">
                Выполняем
                <Spinner className="size-3" />
              </span>
            ) : data.status === "active" ? (
              "Выполнить"
            ) : (
              "Отменить"
            )}
          </Button>
          {data.status === "active" && (
            <EditTaskModal task={data}/>
          )}
        </ItemActions>
      </Item>
    </div>
  );
}
