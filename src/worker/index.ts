import { Hono } from "hono";

type Bindings = {
  WINDMILL_URL: string;
  WINDMILL_TOKEN: string;
  ORGANIZATION_ID: string;
  ORGANIZER_ID: string;
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

app.get("/api/events", async (c) => {
  const windmillUrl = c.env.WINDMILL_URL;
  const windmillToken = c.env.WINDMILL_TOKEN;
  const organizationId = c.env.ORGANIZATION_ID;
  const organizerId = c.env.ORGANIZER_ID;

  if (!windmillUrl || !windmillToken || !organizationId || !organizerId) {
    return c.json({ error: "Missing required environment variables" }, 500);
  }

  const status = c.req.query("status") || "live";

  const requestBody = JSON.stringify({
    status,
    organization_id: organizationId,
    organizer_id: organizerId,
  });

  try {
    const response = await fetch(windmillUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${windmillToken}`,
      },
      body: requestBody,
    });

    if (!response.ok) {
      return c.json(
        { error: `Windmill API error: ${response.statusText}` },
        response.status as 200 | 400 | 401 | 403 | 404 | 500
      );
    }

    const data = (await response.json()) as EventbriteResponse;
    return c.json(data);
  } catch {
    return c.json({ error: "Failed to fetch events from Windmill" }, 500);
  }
});

app.get("/api/events.ics", async (c) => {
  const windmillUrl = c.env.WINDMILL_URL;
  const windmillToken = c.env.WINDMILL_TOKEN;
  const organizationId = c.env.ORGANIZATION_ID;
  const organizerId = c.env.ORGANIZER_ID;

  if (!windmillUrl || !windmillToken || !organizationId || !organizerId) {
    return c.text("Missing required environment variables", 500);
  }

  const status = c.req.query("status") || "live";

  const requestBody = JSON.stringify({
    status,
    organization_id: organizationId,
    organizer_id: organizerId,
  });

  try {
    const response = await fetch(windmillUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${windmillToken}`,
      },
      body: requestBody,
    });

    if (!response.ok) {
      return c.text(
        `Windmill API error: ${response.statusText}`,
        response.status as 200 | 400 | 401 | 403 | 404 | 500
      );
    }

    const data = (await response.json()) as EventbriteResponse;

    // Generate iCalendar format
    const icsContent = generateICS(data.events);

    // Return with appropriate headers
    c.header("Content-Type", "text/calendar; charset=utf-8");
    c.header("Content-Disposition", 'attachment; filename="events.ics"');
    return c.text(icsContent);
  } catch {
    return c.text("Failed to fetch events from Windmill", 500);
  }
});

function generateICS(events: EventbriteResponse["events"]): string {
  const lines: string[] = [];

  // iCalendar header
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//OCAI Calendar//EN");
  lines.push("CALSCALE:GREGORIAN");
  lines.push("METHOD:PUBLISH");

  // Calendar metadata
  lines.push("X-WR-CALNAME:Orange County AI");
  lines.push("X-WR-CALDESC:Orange County AI events and meetups");
  lines.push("X-APPLE-CALENDAR-COLOR:#FF8C00");
  lines.push("X-OUTLOOK-COLOR:#FF8C00");

  // Add each event
  events.forEach((event) => {
    lines.push("BEGIN:VEVENT");

    // UID - unique identifier
    lines.push(`UID:${event.id}@eventbrite.com`);

    // Timestamps in UTC format (YYYYMMDDTHHMMSSZ)
    const startDate = new Date(event.start.utc);
    const endDate = new Date(event.end.utc);
    lines.push(`DTSTART:${formatDateToICS(startDate)}`);
    lines.push(`DTEND:${formatDateToICS(endDate)}`);

    // Event details
    lines.push(`SUMMARY:${escapeICS(event.name.text)}`);
    if (event.description?.text) {
      lines.push(`DESCRIPTION:${escapeICS(event.description.text)}`);
    }
    lines.push(`URL:${event.url}`);

    // Status
    if (event.status === "live") {
      lines.push("STATUS:CONFIRMED");
    } else if (event.status === "canceled") {
      lines.push("STATUS:CANCELLED");
    } else {
      lines.push("STATUS:TENTATIVE");
    }

    // Additional metadata
    lines.push(`DTSTAMP:${formatDateToICS(new Date())}`);
    lines.push(`ORGANIZER:CN=Organization ${event.organization_id}`);

    // Add 90-minute reminder
    lines.push("BEGIN:VALARM");
    lines.push("TRIGGER:-PT90M");
    lines.push("ACTION:DISPLAY");
    lines.push(`DESCRIPTION:Reminder: ${escapeICS(event.name.text)}`);
    lines.push("END:VALARM");

    lines.push("END:VEVENT");
  });

  // iCalendar footer
  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
}

function formatDateToICS(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function escapeICS(text: string): string {
  // Escape special characters for iCalendar format
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "");
}

export default app;
