import React, { useState } from "react";
import { getEvents, rsvpEvent } from "../fakeApi";

function MemberEventCard({ event, currentUser, onRsvp }) {
  const isPast = new Date(event.date) < new Date();
  const myRsvp = (event.rsvps || []).find((r) => r.userId === currentUser.id)?.status;

  return (
    <article className={`card ${isPast ? "card-past" : ""}`}>
      <div className="card-header">
        <span className="pill pill-category">{event.activityType}</span>
        {isPast && <span className="pill pill-past">Past Event</span>}
      </div>
      <h3 className="card-title" style={{ marginTop: 8 }}>{event.title}</h3>
      <div className="card-meta">
        <span className="meta-chip">{event.date}</span>
        <span className="meta-chip">{event.time}</span>
      </div>
      <p className="card-usecase">{event.description}</p>
      {!isPast && (
        <div className="event-rsvp-section">
          <div className="rsvp-label">Will you attend?</div>
          <div className="rsvp-buttons">
            {["yes", "maybe", "no"].map((s) => (
              <button
                key={s}
                className={`btn btn-sm ${myRsvp === s ? "btn-primary" : "btn-outline"}`}
                onClick={() => onRsvp(event.id, s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
      {myRsvp && (
        <div style={{ marginTop: 8, fontSize: "0.8rem", color: "var(--teal)" }}>
          You replied: <strong>{myRsvp.toUpperCase()}</strong>
        </div>
      )}
    </article>
  );
}

export default function MemberEvents({ currentUser }) {
  const [showPast, setShowPast] = useState(false);
  const [eventsVersion, setEventsVersion] = useState(0);

  const events = getEvents();
  const myClubs = ["Book Club", "CNS Regulation Workshop", "Art Therapy"];

  const filteredEvents = events.filter((e) => {
    const isPast = new Date(e.date) < new Date();
    return showPast === isPast;
  });

  const handleRsvp = (eventId, status) => {
    rsvpEvent(eventId, currentUser.id, status);
    setEventsVersion((v) => v + 1);
  };

  return (
    <div className="h2h-container">
      <div className="h2h-sidebar">
        <section className="panel">
          <h2 className="panel-title">My Clubs</h2>
          <div className="list">
            {myClubs.map((club) => (
              <div key={club} className="list-item">
                <span className="list-title" style={{ fontSize: "0.85rem" }}>{club}</span>
              </div>
            ))}
            <div className="list-item" style={{ background: "transparent", border: "1px dashed #ccc", justifyContent: "center", cursor: "pointer", color: "var(--ink-soft)" }}>
              + Join new club
            </div>
          </div>
        </section>
        <section className="panel" style={{ marginTop: 20, background: "var(--lilac-soft)" }}>
          <h3 className="panel-title" style={{ fontSize: "0.9rem" }}>Did you know?</h3>
          <p className="panel-text">Attending 3 events gives you priority access to new Resource Kits!</p>
        </section>
      </div>

      <div className="h2h-main">
        <div className="h2h-controls">
          <div className="toggle-group">
            <button className={`btn ${!showPast ? "btn-primary" : "btn-outline"}`} onClick={() => setShowPast(false)}>Upcoming Events</button>
            <button className={`btn ${showPast ? "btn-primary" : "btn-outline"}`} onClick={() => setShowPast(true)}>Past Events</button>
          </div>
        </div>
        <div className="grid">
          {filteredEvents.map((event) => (
            <MemberEventCard key={event.id} event={event} currentUser={currentUser} onRsvp={handleRsvp} />
          ))}
          {filteredEvents.length === 0 && <div className="empty-state"><p>No events found.</p></div>}
        </div>
      </div>
    </div>
  );
}
