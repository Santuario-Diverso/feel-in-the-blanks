import React, { useState } from "react";
import { getEvents, getIdeas, addEvent, addIdea, toggleTask, deleteIdea } from "../fakeApi";
import { activityTypes } from "../data/events";

function EventCard({ event, onToggleTask }) {
  const isPast = new Date(event.date) < new Date();
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
        <div className="event-details">
          <div className="detail-row"><strong>In Charge:</strong> {event.adultsInCharge}</div>
          {event.protectorDads && event.protectorDads !== "N/A" && (
            <div className="detail-row"><strong>Support Vols:</strong> {event.protectorDads}</div>
          )}
          <div className="detail-row"><strong>Sign-ups:</strong> {event.signups} / Vols needed: {event.volunteersNeeded}</div>
          <div className="detail-row"><strong>Budget:</strong> €{event.budget}</div>
        </div>
      )}
      {!isPast && (
        <div className="task-list">
          <h4 className="task-header">Tasks</h4>
          {event.tasks.map((task) => (
            <label key={task.id} className="task-item">
              <input type="checkbox" checked={task.done} onChange={() => onToggleTask(event.id, task.id)} />
              <span className={task.done ? "task-done" : ""}>{task.text}</span>
            </label>
          ))}
          {event.tasks.length === 0 && <span className="admin-hint">No tasks listed</span>}
        </div>
      )}
    </article>
  );
}

const emptyEvent = {
  title: "", date: "", time: "", activityType: activityTypes[0],
  description: "", budget: "", adultsInCharge: "", protectorDads: "", volunteersNeeded: "0",
};

export default function H2HEves({ currentUser }) {
  const [showPast, setShowPast] = useState(false);
  const [filterMyEvents, setFilterMyEvents] = useState(true);
  const [eventsVersion, setEventsVersion] = useState(0);
  const [newIdea, setNewIdea] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState(emptyEvent);

  const events = getEvents();
  const ideas = getIdeas();

  const filteredEvents = events.filter((e) => {
    const isPast = new Date(e.date) < new Date();
    if (showPast !== isPast) return false;
    if (filterMyEvents && e.organizerId !== currentUser.id) return false;
    return true;
  });

  const handleToggleTask = (eventId, taskId) => { toggleTask(eventId, taskId); setEventsVersion((v) => v + 1); };
  const handleAddIdea = () => {
    if (!newIdea.trim()) return;
    addIdea(newIdea, currentUser.name);
    setNewIdea("");
    setEventsVersion((v) => v + 1);
  };
  const handleSubmitEvent = (e) => {
    e.preventDefault();
    addEvent({ ...newEvent, organizerId: currentUser.id });
    setIsAdding(false);
    setNewEvent(emptyEvent);
    setEventsVersion((v) => v + 1);
  };
  const set = (field) => (e) => setNewEvent((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="h2h-container">
      <div className="h2h-sidebar">
        <section className="panel">
          <h2 className="panel-title">Ideas for Future Eves</h2>
          <div className="ideas-list">
            {ideas.map((idea) => (
              <div key={idea.id} className="idea-item">
                <span className="idea-text">{idea.text}</span>
                <span className="idea-creator">— {idea.creator}</span>
              </div>
            ))}
          </div>
          <div className="add-idea">
            <input className="input" placeholder="Add a new idea…" value={newIdea} onChange={(e) => setNewIdea(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddIdea()} />
            <button className="btn btn-soft" onClick={handleAddIdea}>Add</button>
          </div>
          <button className="btn btn-primary full-width" style={{ marginTop: 12 }} onClick={() => alert("Simulating email to all SD members with this ideas list!")}>
            Share with all of SD?
          </button>
        </section>
      </div>

      <div className="h2h-main">
        <div className="h2h-controls">
          <div className="toggle-group">
            <button className={`btn ${!showPast ? "btn-primary" : "btn-outline"}`} onClick={() => setShowPast(false)}>Upcoming</button>
            <button className={`btn ${showPast ? "btn-primary" : "btn-outline"}`} onClick={() => setShowPast(true)}>Past Events</button>
          </div>
          <label className="checkbox-label">
            <input type="checkbox" checked={filterMyEvents} onChange={(e) => setFilterMyEvents(e.target.checked)} />
            Show only my events
          </label>
          <button className="btn btn-soft" onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? "Cancel" : "+ New Event"}
          </button>
        </div>

        {isAdding && (
          <section className="panel new-event-form" style={{ marginBottom: 20 }}>
            <h3 className="panel-title">Organise New Heart2Heart Eve</h3>
            <form onSubmit={handleSubmitEvent} className="form-grid">
              <div className="form-group"><label>Title</label><input required className="input" value={newEvent.title} onChange={set("title")} /></div>
              <div className="form-group"><label>Activity Type</label>
                <select className="input" value={newEvent.activityType} onChange={set("activityType")}>
                  {activityTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Date</label><input required type="date" className="input" value={newEvent.date} onChange={set("date")} /></div>
              <div className="form-group"><label>Time</label><input required type="time" className="input" value={newEvent.time} onChange={set("time")} /></div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}><label>Description</label><textarea className="input" rows={2} value={newEvent.description} onChange={set("description")} /></div>
              <div className="form-group"><label>Adults in Charge</label><input className="input" value={newEvent.adultsInCharge} onChange={set("adultsInCharge")} /></div>
              <div className="form-group"><label>Support Volunteers</label><input className="input" value={newEvent.protectorDads} onChange={set("protectorDads")} /></div>
              <div className="form-group"><label>Budget (€)</label><input className="input" type="number" value={newEvent.budget} onChange={set("budget")} /></div>
              <div className="form-group"><label>Vols Needed</label><input className="input" type="number" value={newEvent.volunteersNeeded} onChange={set("volunteersNeeded")} /></div>
              <button type="submit" className="btn btn-primary" style={{ gridColumn: "1 / -1" }}>Create Event</button>
            </form>
          </section>
        )}

        <div className="grid">
          {filteredEvents.map((event) => <EventCard key={event.id} event={event} onToggleTask={handleToggleTask} />)}
          {filteredEvents.length === 0 && <div className="empty-state"><p>No events found for this filter.</p></div>}
        </div>
      </div>
    </div>
  );
}
