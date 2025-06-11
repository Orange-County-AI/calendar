// src/App.tsx

import { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubscribeCalendar = () => {
    const webcalUrl = `webcal://${window.location.host}/api/events.ics`;
    window.location.href = webcalUrl;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0 }}>OCAI Events</h1>
        <button
          onClick={handleSubscribeCalendar}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          title="Subscribe to calendar feed"
        >
          📅 Subscribe to Calendar
        </button>
      </div>
      
      {eventsLoading && <p>Loading events...</p>}
      {eventsError && <p style={{ color: "red" }}>Error: {eventsError}</p>}
      
      {!eventsLoading && events.length === 0 && !eventsError && (
        <p>No events found.</p>
      )}
      
      {events.length > 0 && (
        <div style={{ marginTop: "20px" }}>
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
  );
}

export default App;
