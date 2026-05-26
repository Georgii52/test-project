"use client";
import { X, CalendarIcon, Plus } from "lucide-react";
import NewTaskModal from "../modals/NewTaskModal";
import type { User } from "@repo/shared";
import NewUserModal from "../modals/NewUserModal";

type FilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function Header({ value, onChange }: FilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 px-2 md:px-0 justify-between items-center">
      <div className="inline-flex w-full max-w-50 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-sm shadow-xs transition-colors has-focus:border-ring has-focus:ring-2 has-focus:ring-ring/30">
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="font-medium text-muted-foreground whitespace-nowrap">
          Дата
        </span>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 bg-transparent text-xs outline-none text-foreground"
        />
        <button
          onClick={() => onChange("")}
          className={`ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ${value ? "visible" : "invisible"}`}
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <NewTaskModal />
        <NewUserModal />
      </div>
    </div>
  );
}
