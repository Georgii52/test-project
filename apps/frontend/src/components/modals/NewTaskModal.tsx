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
import {
  useUsers,
  useCreateTask,
  useDefaultWorks,
  useCreateDefaultWork,
} from "../hooks/hooks";
import { createTaskSchema } from "@repo/shared";
import { Plus } from "lucide-react";
import { UNITS } from "../CONSTANTS";
import { z } from "zod";
import toast from "react-hot-toast";

type FieldErrors = Partial<
  Record<"workType" | "workAmount" | "workAmountUnit" | "executor", string[]>
>;

export default function NewTaskModal() {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState("");
  const [executor, setExecutor] = useState("");
  const [defaultWork, setDefaultWork] = useState("");
  const [newDefaultWork, setNewDefaultWork] = useState("");
  const [showNewDefaultWork, setShowNewDefaultWork] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | null>(null);

  const { data: users, isPending: usersLoading } = useUsers();
  const { mutate, isPending } = useCreateTask();
  const {
    data: defaultWorks,
    isPending: defaultWorksLoading,
    error: defaultWorksError,
  } = useDefaultWorks();
  const { mutate: createDefaultWork, isPending: workCreating } =
    useCreateDefaultWork();

  function handleOpenChange(next: boolean) {
    if (!next) {
      setUnit("");
      setShowNewDefaultWork(false);
      setExecutor("");
      setFieldErrors(null);
    }
    setOpen(next);
  }

  function handleAddWork() {
    const name = newDefaultWork.trim();
    if (!name) return;

    createDefaultWork(
      { name },
      {
        onSuccess: (data) => {
          setDefaultWork((data as { name: string }).name);
          setNewDefaultWork("");
          setShowNewDefaultWork(false);
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const result = createTaskSchema.safeParse({
      workType: defaultWork,
      workAmount: Number(form.get("workAmount")),
      workAmountUnit: unit,
      executor,
    });

    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setFieldErrors(null);
    mutate(result.data, {
      onSuccess: () => {
        toast.success("Задача успешно создана");
        setOpen(false);
      },
      onError: (err) => toast.error(err.message),
    });
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
            Добавить задачу <Plus />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Новая задача</DialogTitle>
            <DialogDescription>
              Добавление новой задачи для объекта
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-5 py-4">
            <Field>
              <Label htmlFor="workType">Наименование работы</Label>
              <Select
                value={defaultWork}
                onValueChange={setDefaultWork}
                disabled={defaultWorksLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      defaultWorksLoading
                        ? "Загрузка..."
                        : "Выберите наименование"
                    }
                  />
                  <SelectContent>
                    {defaultWorks.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectTrigger>
              </Select>
              <FieldError errors={toErrors(fieldErrors?.workType)} />
              {!showNewDefaultWork ? (
                <button
                  type="button"
                  className="mt-1 text-xs text-muted-foreground underline-offset-2 hover:underline cursor-pointer w-fit"
                  onClick={() => setShowNewDefaultWork(true)}
                >
                  + Добавить наименование
                </button>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={newDefaultWork}
                    onChange={(e) => setNewDefaultWork(e.target.value)}
                    placeholder="Наименование"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddWork();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={workCreating || !newDefaultWork.trim()}
                    onClick={handleAddWork}
                  >
                    {workCreating ? "..." : "Добавить"}
                  </Button>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:underline cursor-pointer shrink-0"
                    onClick={() => {
                      setShowNewDefaultWork(false);
                      setNewDefaultWork("");
                    }}
                  >
                    Отмена
                  </button>
                </div>
              )}
            </Field>
            <Field>
              <Label htmlFor="workAmount">Объем работы</Label>
              <Input id="workAmount" name="workAmount" type="number" min={1} />
              <FieldError errors={toErrors(fieldErrors?.workAmount)} />
            </Field>
            <Field>
              <Label>Единица измерения</Label>
              <Select value={unit} onValueChange={setUnit}>
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
                onValueChange={setExecutor}
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
              {isPending ? "Сохранение..." : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
