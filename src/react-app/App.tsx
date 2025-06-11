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
  };
  start: {
    local: string;
  };
  url: string;
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
      setEventsError(error instanceof Error ? error.message : "Failed to fetch events");
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
              .then((res) => res.json() as Promise<{
                organizationId: string;
                organizerId: string;
              }>)
              .then((data) => setEnvVars(data));
          }}
          aria-label="get environment variables"
        >
          Fetch Environment Variables
        </button>
        <p>
          Organization ID: {envVars.organizationId}
        </p>
        <p>
          Organizer ID: {envVars.organizerId}
        </p>
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
              <div key={event.id} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
                <h3>{event.name.text}</h3>
                <p>Date: {new Date(event.start.local).toLocaleString()}</p>
                <a href={event.url} target="_blank" rel="noopener noreferrer">
                  View on Eventbrite
                </a>
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
