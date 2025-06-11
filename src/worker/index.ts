import { Hono } from "hono";
const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/api/env", (c) => {
  const organizationId = c.env.ORGANIZATION_ID || "not set";
  const organizerId = c.env.ORGANIZER_ID || "not set";
  
  return c.json({
    organizationId,
    organizerId
  });
});

export default app;
