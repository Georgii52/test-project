"use client";
import React from "react";
import Card from "./Card";
import { useState } from "react";
import { Task } from "@/types";
import { useTasks } from "@/components/hooks/hooks";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import EmptyState from "./EmptyState";
import Loader from "./Loader";

export default function WorkLogContent({ date }: { date: string }) {
  const [page, setPage] = useState(1);

  const { data, isPending, error } = useTasks({ page, date });

  if (error) return <p>Ошибка при получении данных: {error.message}</p>;

  if (isPending) return <Loader />;

  if (data.data.length === 0) return <EmptyState />;

  return (
    <>
      <div className="flex flex-col gap-2">
        {data.data.map((item: Task) => (
          <Card key={item.id} data={item} />
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                setPage((p) => Math.max(1, p - 1));
              }}
              aria-disabled={page === 1}
              text="Назад"
            />
          </PaginationItem>
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  setPage(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                setPage((p) => Math.min(data.totalPages, p + 1));
              }}
              aria-disabled={page === data.totalPages}
              text="Вперед"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
