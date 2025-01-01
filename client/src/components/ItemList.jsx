import React from "react";

function countAvailableCopies(item, locationId) {
  if (!Array.isArray(item.copies)) return 0;
  return item.copies.filter(
    (c) => c.locationId === locationId && c.status === "available"
  ).length;
}

function ItemCard({ item, locationId, onRequest, onClick }) {
  const availableCount = countAvailableCopies(item, locationId);
  const availableText = availableCount > 0 ? `${availableCount} available here` : "Currently on loan";
  const isAvailable = availableCount > 0;

  return (
    <article className="card" onClick={() => onClick(item)} style={{ cursor: "pointer" }}>
      <div className="card-pill">
        <span className="pill pill-category">{item.category}</span>
        {item.recommendedAudience && <span className="pill">{item.recommendedAudience}</span>}
      </div>
      <h3 className="card-title">{item.title}</h3>
      <p className="card-creator">by {item.creator}</p>
      <p className="card-meta">
        {item.originalLanguage && <span className="meta-chip">{item.originalLanguage}</span>}
        {Array.isArray(item.tags) &&
          item.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="meta-chip meta-chip-soft">{tag}</span>
          ))}
      </p>
      <p className="card-usecase">{item.useCase}</p>
      <div className="card-footer">
        <span className={`availability ${isAvailable ? "availability-ok" : "availability-busy"}`}>
          {availableText}
        </span>
        <button
          className={`btn ${isAvailable ? "btn-primary" : "btn-disabled"}`}
          disabled={!isAvailable}
          onClick={(e) => { e.stopPropagation(); if (isAvailable) onRequest(item.id); }}
        >
          {isAvailable ? "Request" : "Waitlist (soon)"}
        </button>
      </div>
    </article>
  );
}

export default function ItemList({ items, currentUser, locationId, onRequest, onItemClick }) {
  if (!items.length) {
    return (
      <div className="empty-state">
        <h2>No items here (yet)</h2>
        <p>Ask your MySD coordinator to add some to this nook.</p>
      </div>
    );
  }
  return (
    <section className="grid">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          currentUser={currentUser}
          locationId={locationId}
          onRequest={onRequest}
          onClick={onItemClick}
        />
      ))}
    </section>
  );
}
