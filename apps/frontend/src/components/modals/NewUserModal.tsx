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
import { useRoles, useCreateUser, useCreateRole } from "../hooks/hooks";
import { createUserSchema } from "@repo/shared";
import { Plus } from "lucide-react";
import { z } from "zod";
import toast from "react-hot-toast";

type FieldErrors = Partial<Record<"name" | "role", string[]>>;

export default function NewUserModal() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [showNewRole, setShowNewRole] = useState(false);

  const { data: roles, isPending: rolesLoading } = useRoles();
  const { mutate: createUser, isPending: creating } = useCreateUser();
  const { mutate: createRole, isPending: creatingRole } = useCreateRole();

  function handleOpenChange(next: boolean) {
    if (!next) {
      setRole("");
      setFieldErrors(null);
      setNewRoleName("");
      setShowNewRole(false);
    }
    setOpen(next);
  }

  function handleAddRole() {
    const name = newRoleName.trim();
    if (!name) return;
    createRole(
      { name },
      {
        onSuccess: (data) => {
          setRole((data as { name: string }).name);
          setNewRoleName("");
          setShowNewRole(false);
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const result = createUserSchema.safeParse({
      name: String(form.get("name")),
      role,
    });

    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setFieldErrors(null);
    createUser(result.data, {
      onSuccess: () => setOpen(false),
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
          <span className="flex items-center gap-1 justify-center">
            Добавить исполнителя <Plus />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Новый исполнитель</DialogTitle>
            <DialogDescription>
              Добавление нового исполнителя и задание роли
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-5 py-4">
            <Field>
              <Label htmlFor="name">ФИО</Label>
              <Input id="name" name="name" placeholder="Иванов Иван Иванович" />
              <FieldError errors={toErrors(fieldErrors?.name)} />
            </Field>
            <Field>
              <Label>Роль</Label>
              <Select
                value={role}
                onValueChange={setRole}
                disabled={rolesLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={rolesLoading ? "Загрузка..." : "Выберите роль"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={toErrors(fieldErrors?.role)} />
              {!showNewRole ? (
                <button
                  type="button"
                  className="mt-1 text-xs text-muted-foreground underline-offset-2 hover:underline cursor-pointer w-fit"
                  onClick={() => setShowNewRole(true)}
                >
                  + Добавить новую роль
                </button>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Название роли"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddRole();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={creatingRole || !newRoleName.trim()}
                    onClick={handleAddRole}
                  >
                    {creatingRole ? "..." : "Создать"}
                  </Button>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:underline cursor-pointer shrink-0"
                    onClick={() => {
                      setShowNewRole(false);
                      setNewRoleName("");
                    }}
                  >
                    Отмена
                  </button>
                </div>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Отмена
              </Button>
            </DialogClose>
            <Button type="submit" disabled={creating}>
              {creating ? "Сохранение..." : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
