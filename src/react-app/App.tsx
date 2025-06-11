// src/App.tsx

import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import cloudflareLogo from "./assets/Cloudflare_Logo.svg";
import honoLogo from "./assets/hono.svg";
import "./App.css";

interface Event {
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
}

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");
  const [envVars, setEnvVars] = useState<{
    organizationId: string;
    organizerId: string;
  }>({ organizationId: "loading...", organizerId: "loading..." });
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setEventsLoading(true);
    setEventsError(null);
    try {
      const response = await fetch("/api/events");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      setEventsError(
        error instanceof Error ? error.message : "Failed to fetch events"
      );
    } finally {
      setEventsLoading(false);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://hono.dev/" target="_blank">
          <img src={honoLogo} className="logo cloudflare" alt="Hono logo" />
        </a>
        <a href="https://workers.cloudflare.com/" target="_blank">
          <img
            src={cloudflareLogo}
            className="logo cloudflare"
            alt="Cloudflare logo"
          />
        </a>
      </div>
      <h1>Vite + React + Hono + Cloudflare</h1>
      <div className="card">
        <button
          onClick={() => setCount((count) => count + 1)}
          aria-label="increment"
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card">
        <button
          onClick={() => {
            fetch("/api/")
              .then((res) => res.json() as Promise<{ name: string }>)
              .then((data) => setName(data.name));
          }}
          aria-label="get name"
        >
          Name from API is: {name}
        </button>
        <p>
          Edit <code>worker/index.ts</code> to change the name
        </p>
      </div>
      <div className="card">
        <button
          onClick={() => {
            fetch("/api/env")
              .then(
                (res) =>
                  res.json() as Promise<{
                    organizationId: string;
                    organizerId: string;
                  }>
              )
              .then((data) => setEnvVars(data));
          }}
          aria-label="get environment variables"
        >
          Fetch Environment Variables
        </button>
        <p>Organization ID: {envVars.organizationId}</p>
        <p>Organizer ID: {envVars.organizerId}</p>
      </div>
      <div className="card">
        <h2>Eventbrite Events</h2>
        <button onClick={fetchEvents} disabled={eventsLoading}>
          {eventsLoading ? "Loading..." : "Fetch Events"}
        </button>
        {eventsError && <p style={{ color: "red" }}>Error: {eventsError}</p>}
        {events.length > 0 && (
          <div style={{ marginTop: "20px", textAlign: "left" }}>
            {events.map((event) => (
              <div
                key={event.id}
                style={{
                  marginBottom: "20px",
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "flex-start",
                  }}
                >
                  {event.logo && (
                    <div style={{ flexShrink: 0 }}>
                      <img
                        src={event.logo.url}
                        alt={`${event.name.text} logo`}
                        style={{
                          width: "150px",
                          height: "auto",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
                      {event.name.text}
                    </h3>

                    {event.summary && (
                      <p
                        style={{
                          margin: "0 0 15px 0",
                          fontStyle: "italic",
                          color: "#666",
                          fontSize: "14px",
                        }}
                      >
                        {event.summary}
                      </p>
                    )}

                    <div style={{ marginBottom: "10px" }}>
                      <strong>📅 Start:</strong>{" "}
                      {new Date(event.start.local).toLocaleString()}
                      <br />
                      <strong>🏁 End:</strong>{" "}
                      {new Date(event.end.local).toLocaleString()}
                      <br />
                      <strong>🌍 Timezone:</strong> {event.start.timezone}
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          backgroundColor: event.is_free
                            ? "#4CAF50"
                            : "#FF9800",
                          color: "white",
                          borderRadius: "4px",
                          fontSize: "12px",
                          marginRight: "10px",
                        }}
                      >
                        {event.is_free ? "FREE" : "PAID"}
                      </span>

                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          backgroundColor: event.online_event
                            ? "#2196F3"
                            : "#9C27B0",
                          color: "white",
                          borderRadius: "4px",
                          fontSize: "12px",
                          marginRight: "10px",
                        }}
                      >
                        {event.online_event ? "ONLINE" : "IN-PERSON"}
                      </span>

                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          backgroundColor: "#607D8B",
                          color: "white",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {event.status.toUpperCase()}
                      </span>
                    </div>

                    {event.capacity && (
                      <p style={{ margin: "5px 0", fontSize: "14px" }}>
                        <strong>👥 Capacity:</strong> {event.capacity} attendees
                      </p>
                    )}

                    {event.description && event.description.text && (
                      <p
                        style={{
                          margin: "10px 0",
                          fontSize: "14px",
                          color: "#555",
                          lineHeight: "1.4",
                        }}
                      >
                        <strong>Description:</strong> {event.description.text}
                      </p>
                    )}

                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: "10px",
                        padding: "8px 16px",
                        backgroundColor: "#FF6600",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "5px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      View on Eventbrite →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="read-the-docs">Click on the logos to learn more</p>
    </>
  );
}

export default App;
