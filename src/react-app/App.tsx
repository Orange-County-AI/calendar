// src/App.tsx

import { useState, useEffect } from "react";

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
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">OCAI Events</h1>
        <button
          onClick={handleSubscribeCalendar}
          className="btn btn-primary btn-sm sm:btn-lg gap-2 self-start sm:self-auto"
          title="Subscribe to calendar feed"
        >
          📅 Subscribe to Calendar
        </button>
      </div>

      {eventsLoading && (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-4 text-lg">Loading events...</span>
        </div>
      )}

      {eventsError && (
        <div className="alert alert-error mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {eventsError}</span>
        </div>
      )}

      {!eventsLoading && events.length === 0 && !eventsError && (
        <div className="hero min-h-[200px] bg-base-200 rounded-lg">
          <div className="hero-content text-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">No events found</h2>
              <p className="text-gray-600">
                Check back later for upcoming OCAI events!
              </p>
            </div>
          </div>
        </div>
      )}

      {events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-[420px] flex flex-col"
            >
              {/* Logo at top of card */}
              <div className="flex-shrink-0 h-48 overflow-hidden rounded-t-2xl">
                {event.logo ? (
                  <img
                    src={event.logo.url}
                    alt={`${event.name.text} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl">📅</span>
                  </div>
                )}
              </div>

              {/* Card content */}
              <div className="card-body p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="card-title text-lg mb-2 line-clamp-2">
                    {event.name.text}
                  </h3>

                  <div className="text-sm text-gray-600 mb-3">
                    <div className="mb-1">
                      📅 {new Date(event.start.local).toLocaleDateString()}
                    </div>
                    <div>
                      🕐{" "}
                      {new Date(event.start.local).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    <span
                      className={`badge ${
                        event.is_free ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {event.is_free ? "FREE" : "PAID"}
                    </span>
                    <span
                      className={`badge ${
                        event.online_event ? "badge-info" : "badge-secondary"
                      }`}
                    >
                      {event.online_event ? "ONLINE" : "IN-PERSON"}
                    </span>
                  </div>
                </div>

                <div className="card-actions justify-end mt-auto">
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm w-full"
                  >
                    View Event →
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
