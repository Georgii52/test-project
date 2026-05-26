"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers, useUpdateTask } from "../hooks/hooks";
import { createTaskSchema } from "@repo/shared";
import { Pen, Plus } from "lucide-react";
import { UNITS } from "../CONSTANTS";
import { z } from "zod";
import toast from "react-hot-toast";
import { Task } from "@/types";

type FieldErrors = Partial<
  Record<"workType" | "workAmount" | "workAmountUnit" | "executor", string[]>
>;

export default function EditTaskModal({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);
  const [workType, setWorkType] = useState(task.workType);
  const [workAmount, setWorkAmount] = useState(task.workAmount);
  const [workAmountUnit, setWorkAmountUnit] = useState(task.workAmountUnit);
  const [executor, setExecutor] = useState(task.executor.id);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | null>(null);

  const { data: users, isPending: usersLoading } = useUsers();
  const { mutate, isPending } = useUpdateTask();

  function handleOpenChange(next: boolean) {
    if (!next) {
      setFieldErrors(null);
    }
    setOpen(next);
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const result = createTaskSchema.safeParse({
      workType: String(form.get("workType")),
      workAmount: Number(form.get("workAmount")),
      workAmountUnit,
      executor,
    });

    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setFieldErrors(null);
    mutate(
      { id: task.id, workType, workAmount, workAmountUnit, executor },
      {
        onSuccess: () => {
          toast.success("Задача успешно изменена");
          setOpen(false);
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

  const toErrors = (msgs?: string[]) => msgs?.map((message) => ({ message }));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full normal-case tracking-normal font-medium text-sm px-4 py-2 h-auto bg-background shadow-xs cursor-pointer"
        >
          <span className="flex items-center gap-1 justify-center cursor-pointer">
            Редактировать
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Редактирование</DialogTitle>
            <DialogDescription>
              Изменить задачу {task.workType}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-5 py-4">
            <Field>
              <Label htmlFor="workType">Наименование работы</Label>
              <Input
                id="workType"
                name="workType"
                placeholder="напр. Укладка плитки"
                defaultValue={workType}
                onChange={(e) => setWorkType(e.target.value)}
              />
              <FieldError errors={toErrors(fieldErrors?.workType)} />
            </Field>
            <Field>
              <Label htmlFor="workAmount">Объем работы</Label>
              <Input
                id="workAmount"
                name="workAmount"
                type="number"
                min={1}
                defaultValue={workAmount}
                onChange={(e) => setWorkAmount(Number(e.target.value))}
              />
              <FieldError errors={toErrors(fieldErrors?.workAmount)} />
            </Field>
            <Field>
              <Label>Единица измерения</Label>
              <Select
                value={workAmountUnit}
                onValueChange={(e) => setWorkAmountUnit(e)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите единицу измерения" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={toErrors(fieldErrors?.workAmountUnit)} />
            </Field>
            <Field>
              <Label>Исполнитель</Label>
              <Select
                value={executor}
                onValueChange={(e) => setExecutor(e)}
                disabled={usersLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      usersLoading ? "Загрузка..." : "Выберите исполнителя"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <span className="flex items-center gap-2">
                        <span>{user.name}</span>
                        <span className="text-muted-foreground text-sm">
                          {user.role}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={toErrors(fieldErrors?.executor)} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Отмена
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохраняем..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
