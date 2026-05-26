import { z } from "zod";

export const createTaskSchema = z.object({
  workType: z.string().min(1, "Укажите вид работы"),
  workAmount: z.number().int().positive("Объём должен быть больше 0"),
  workAmountUnit: z.string().min(1, "Укажите единицу измерения"),
  executor: z.uuid("Некорректный исполнитель"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema;
export type UpdateTaskInput = CreateTaskInput;

export const createUserSchema = z.object({
  name: z.string().min(1, "Укажите ФИО"),
  role: z.string().min(1, "Укажите роль"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const createRoleSchema = z.object({
  name: z.string().min(1, "Укажите название роли"),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
