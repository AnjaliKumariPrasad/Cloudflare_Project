import { Hono } from "hono";

import todosRoutes from "./routes/todos";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Tier 2 (API): everything under /api is handled by this Worker.
// Everything else (the React app) is served by Workers Static Assets.
app.get("/api/health", (c) => c.json({ ok: true }));
app.route("/api/todos", todosRoutes);

app.notFound((c) => c.json({ success: false, message: "Not found" }, 404));

export default app;
