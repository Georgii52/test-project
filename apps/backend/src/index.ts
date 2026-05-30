import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import tasksController from "./controllers/tasks";
import usersController from "./controllers/users";
import rolesController from "./controllers/roles";
import defaultWorksController from "./controllers/deafult-works";

const app = new Hono().basePath("/api");

app.use(logger());
app.use("*", cors({ origin: process.env.CORS_ORIGIN ?? "*" }));

app.route("/tasks", tasksController);
app.route("/users", usersController);
app.route("/roles", rolesController);
app.route("/default-works", defaultWorksController);

const port = Number(process.env.PORT ?? 3001);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Backend running on http://localhost:${info.port}`);
});
