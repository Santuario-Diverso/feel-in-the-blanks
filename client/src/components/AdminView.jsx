import React, { useState } from "react";
import { getUserStats, getInbox, markMessageCompleted, deleteMessage, getFlaggedPosts, deletePost, togglePostFlag } from "../fakeApi";

function computeStats(items, allItems, allocations, eDevices, events, currentUser) {
  const totalCopies = items.reduce((sum, b) => sum + (Array.isArray(b.copies) ? b.copies.length : 0), 0);
  const totalOnLoan = items.reduce(
    (sum, b) => sum + (Array.isArray(b.copies) ? b.copies.filter((c) => c.status === "on_allocation").length : 0),
    0
  );
  const uniqueCategories = new Set(allItems.map((b) => b.category).filter(Boolean)).size;
  const eDevicesTotal = eDevices.length;
  const eDevicesOnLoan = eDevices.filter((d) => d.status === "on_allocation").length;
  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now).length;
  const pastEvents = events.filter((e) => new Date(e.date) < now).length;

  const userStats = getUserStats(currentUser.id);
  // SD Score is a software engagement indicator only — not a validated impact metric.
  const sdScore =
    userStats.itemsCompleted * 10 +
    userStats.eventsOrganized * 50 +
    userStats.tasksCompleted * 5 +
    userStats.ideasContributed * 20;

  return {
    totalItems: items.length,
    totalCopies,
    totalOnLoan,
    uniqueCategories,
    myAllocations: allocations.length,
    eDevicesTotal,
    eDevicesOnLoan,
    eDevicesAvailable: eDevicesTotal - eDevicesOnLoan,
    upcomingEvents,
    pastEvents,
    sdScore,
    userStats,
  };
}

export default function AdminView({ items, allItems, allocations, eDevices, events, currentUser, onReset }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const stats = computeStats(items, allItems, allocations, eDevices, events, currentUser);
  const [inboxVersion, setInboxVersion] = useState(0);
  const [modVersion, setModVersion] = useState(0);

  const inboxMessages = getInbox();
  const uncompletedCount = inboxMessages.filter((m) => !m.completed).length;
  const flaggedPosts = getFlaggedPosts();

  const handleMarkCompleted = (id) => { markMessageCompleted(id); setInboxVersion((v) => v + 1); };
  const handleDeleteMessage = (id) => { deleteMessage(id); setInboxVersion((v) => v + 1); };
  const handleDismissFlag = (threadId, postId) => { togglePostFlag(threadId, postId); setModVersion((v) => v + 1); };
  const handleDeletePost = (threadId, postId) => {
    if (window.confirm("Permanently delete this post?")) {
      deletePost(threadId, postId);
      setModVersion((v) => v + 1);
    }
  };

  return (
    <div className="volunteer-view">
      <nav className="tab-bar" style={{ marginBottom: 20, background: "transparent", border: "none", padding: 0 }}>
        <button className={`tab ${activeTab === "dashboard" ? "tab-active" : ""}`} onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </button>
        <button className={`tab ${activeTab === "inbox" ? "tab-active" : ""}`} onClick={() => setActiveTab("inbox")}>
          Inbox{uncompletedCount > 0 && <span style={{ marginLeft: 6, background: "var(--danger)", color: "#fff", borderRadius: 10, padding: "2px 8px", fontSize: "0.7rem" }}>{uncompletedCount}</span>}
        </button>
        <button className={`tab ${activeTab === "moderation" ? "tab-active" : ""}`} onClick={() => setActiveTab("moderation")}>
          Moderation{flaggedPosts.length > 0 && <span style={{ marginLeft: 6, background: "var(--danger)", color: "#fff", borderRadius: 10, padding: "2px 8px", fontSize: "0.7rem" }}>{flaggedPosts.length}</span>}
        </button>
      </nav>

      {activeTab === "dashboard" && (
        <section className="panel">
          <h2 className="panel-title">Impact Dashboard</h2>
          <p className="panel-text" style={{ fontSize: "0.8rem", color: "var(--ink-soft)" }}>
            SD Score is a software engagement indicator for demo purposes — not a validated impact metric.
          </p>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Books in collection", value: stats.totalItems },
              { label: "Copies tracked", value: stats.totalCopies },
              { label: "Currently on loan", value: stats.totalOnLoan },
              { label: "Categories", value: stats.uniqueCategories },
              { label: "Resource Kits available", value: stats.eDevicesAvailable },
              { label: "Upcoming events", value: stats.upcomingEvents },
              { label: "Past events", value: stats.pastEvents },
              { label: "My SD Score", value: stats.sdScore },
            ].map((stat) => (
              <div key={stat.label} className="card" style={{ padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--teal)" }}>{stat.value}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--ink-soft)", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <button className="btn btn-outline" style={{ fontSize: "0.8rem" }} onClick={onReset}>
            Reset demo data
          </button>
        </section>
      )}

      {activeTab === "inbox" && (
        <section className="panel">
          <h2 className="panel-title">Volunteer Inbox</h2>
          <div className="list">
            {inboxMessages.length === 0 ? (
              <div className="empty-state">Inbox is empty.</div>
            ) : (
              inboxMessages.map((msg) => (
                <div key={msg.id} className="list-item" style={{ flexDirection: "column", alignItems: "stretch", gap: 8, opacity: msg.completed ? 0.6 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{msg.subject}</strong>
                    <span style={{ fontSize: "0.8rem", color: "var(--ink-soft)" }}>{msg.date}</span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>From: {msg.from}</div>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>{msg.body}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {!msg.completed && (
                      <button className="btn btn-sm btn-primary" onClick={() => handleMarkCompleted(msg.id)}>Mark done</button>
                    )}
                    <button className="btn btn-sm btn-outline" onClick={() => handleDeleteMessage(msg.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {activeTab === "moderation" && (
        <section className="panel">
          <h2 className="panel-title">Moderation Queue</h2>
          <p className="panel-text">Review content flagged by community members.</p>
          <div className="list">
            {flaggedPosts.length === 0 ? (
              <div className="empty-state">No flagged content. Great job!</div>
            ) : (
              flaggedPosts.map((post) => (
                <div key={post.id} className="list-item" style={{ flexDirection: "column", alignItems: "stretch", gap: 10, borderLeft: "4px solid var(--danger)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="pill pill-category" style={{ background: "#ffebee", color: "#c62828" }}>Flagged</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--ink-soft)" }}>{post.date}</span>
                  </div>
                  <div style={{ background: "#f5f5f5", padding: 12, borderRadius: 8, fontSize: "0.9rem" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--ink-soft)", marginBottom: 4 }}>
                      By <strong>{post.creatorName}</strong> in <em>{post.threadTitle}</em>
                    </div>
                    "{post.text}"
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <button className="btn btn-sm btn-outline" onClick={() => handleDismissFlag(post.threadId, post.id)}>Keep (dismiss flag)</button>
                    <button className="btn btn-sm btn-primary" style={{ background: "var(--danger)", borderColor: "var(--danger)" }} onClick={() => handleDeletePost(post.threadId, post.id)}>Delete post</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}
