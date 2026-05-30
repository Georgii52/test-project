import { database, pool } from "./index";
import { rolesTable, usersTable, tasksTable, defaultWorksTable } from "./schema";

const roles = ["Монтажник", "Электрик", "Сантехник", "Прораб"];

const users = [
  { name: "Алексей Петров", role: "Монтажник" },
  { name: "Дмитрий Иванов", role: "Электрик" },
  { name: "Сергей Козлов", role: "Сантехник" },
  { name: "Андрей Смирнов", role: "Прораб", isAdmin: true },
];

const workTypes = [
  { name: "Укладка кабеля", unit: "м" },
  { name: "Монтаж розеток", unit: "шт" },
  { name: "Сварка труб", unit: "шт" },
  { name: "Заливка стяжки", unit: "м²" },
  { name: "Штукатурка стен", unit: "м²" },
  { name: "Монтаж электропроводки", unit: "м" },
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

  await database
    .insert(defaultWorksTable)
    .values(workTypes.map(({ name }) => ({ name })))
    .onConflictDoNothing();

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
      workType: work.name,
      workAmount: Math.floor(Math.random() * 50) + 1,
      workAmountUnit: work.unit,
      executor: executor.id,
      doneAt,
      status: doneAt ? "done" : "active",
    };
  });

  await database.insert(tasksTable).values(tasks);

  console.log(`Done: ${insertedUsers.length} users, 20 tasks, ${workTypes.length} work types`);
  await pool.end();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
