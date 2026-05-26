import { database, pool } from "./index";
import { rolesTable, usersTable, tasksTable } from "./schema";

const roles = ["Монтажник", "Электрик", "Сантехник", "Прораб"];

const users = [
  { name: "Алексей Петров", role: "Монтажник" },
  { name: "Дмитрий Иванов", role: "Электрик" },
  { name: "Сергей Козлов", role: "Сантехник" },
  { name: "Андрей Смирнов", role: "Прораб", isAdmin: true },
];

const workTypes = [
  { type: "Укладка кабеля", unit: "м" },
  { type: "Монтаж розеток", unit: "шт" },
  { type: "Сварка труб", unit: "шт" },
  { type: "Заливка стяжки", unit: "м²" },
  { type: "Штукатурка стен", unit: "м²" },
];

async function seed() {
  console.log("Seeding...");

  await database
    .insert(rolesTable)
    .values(roles.map((name) => ({ name })))
    .onConflictDoNothing();

  const insertedUsers = await database
    .insert(usersTable)
    .values(
      users.map((u) => ({
        name: u.name,
        role: u.role,
        isAdmin: u.isAdmin ?? false,
      })),
    )
    .onConflictDoNothing()
    .returning();

  if (insertedUsers.length === 0) {
    console.log("Users already exist, skipping tasks seed.");
    await pool.end();
    return;
  }

  const tasks = Array.from({ length: 20 }, (_, i) => {
    const work = workTypes[i % workTypes.length];
    const executor = insertedUsers[i % insertedUsers.length];
    const doneAt = i % 3 === 0 ? new Date() : null;
    return {
      workType: work.type,
      workAmount: Math.floor(Math.random() * 50) + 1,
      workAmountUnit: work.unit,
      executor: executor.id,
      doneAt,
      status: doneAt ? "done" : "active",
    };
  });

  await database.insert(tasksTable).values(tasks);

  console.log(`Done: ${insertedUsers.length} users, 20 tasks`);
  await pool.end();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
