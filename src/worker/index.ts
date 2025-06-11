import { Hono } from "hono";

type Bindings = {
  ORGANIZATION_ID: string;
  ORGANIZER_ID: string;
  PRIVATE_TOKEN: string;
};

interface EventbriteResponse {
  events: Array<{
    id: string;
    name: {
      text: string;
      html: string;
    };
    start: {
      local: string;
      utc: string;
      timezone: string;
    };
    end: {
      local: string;
      utc: string;
      timezone: string;
    };
    url: string;
    logo?: {
      id: string;
      url: string;
      original: {
        url: string;
        width: number;
        height: number;
      };
      edge_color?: string;
      aspect_ratio?: string;
    };
    summary?: string;
    description: {
      text: string;
      html: string;
    };
    venue_id?: string;
    capacity?: number;
    is_free: boolean;
    status: string;
    currency?: string;
    online_event: boolean;
    organizer_id: string;
    organization_id: string;
  }>;
  pagination: {
    page_number: number;
    page_size: number;
    page_count: number;
  };
}

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/api/env", (c) => {
  const organizationId = c.env.ORGANIZATION_ID || "not set";
  const organizerId = c.env.ORGANIZER_ID || "not set";

  return c.json({
    organizationId,
    organizerId,
  });
});

app.get("/api/events", async (c) => {
  const organizationId = c.env.ORGANIZATION_ID;
  const organizerId = c.env.ORGANIZER_ID;
  const token = c.env.PRIVATE_TOKEN;

  if (!organizationId || !organizerId || !token) {
    return c.json({ error: "Missing required environment variables" }, 500);
  }

  const status = c.req.query("status") || "live";
  const url = `https://www.eventbriteapi.com/v3/organizations/${organizationId}/events/?status=${status}&organizer_filter=${organizerId}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return c.json(
        { error: `Eventbrite API error: ${response.statusText}` },
        response.status as 200 | 400 | 401 | 403 | 404 | 500
      );
    }

    const data = (await response.json()) as EventbriteResponse;
    return c.json(data);
  } catch {
    return c.json({ error: "Failed to fetch events from Eventbrite" }, 500);
  }
});

export default app;
