import React from "react";

export default function ItemDetailsModal({ item, onClose, onRequest }) {
  if (!item) return null;

  const synopsis =
    item.synopsis ||
    "A key title in the Santuario Diverso collection. It explores themes of identity, community, and resilience — chosen for its relevance to our LGBTQ+, neurodiversity, trauma, and migration focus areas.";

  const coverUrl =
    item.coverUrl ||
    `https://placehold.co/400x600/e0e0e0/333333?text=${encodeURIComponent(item.title)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <div className="item-preview-column">
            <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
              <img src={coverUrl} alt={`Cover of ${item.title}`} style={{ width: "100%", display: "block" }} />
            </div>
          </div>
          <div className="item-details-column">
            <h2 className="modal-title">{item.title}</h2>
            <div className="modal-meta">
              <span className="pill pill-category">{item.category}</span>
              {item.recommendedAudience && <span className="pill">{item.recommendedAudience}</span>}
            </div>
            <div className="synopsis-section">
              <h3>About this book</h3>
              <p>{synopsis}</p>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-primary full-width"
                onClick={() => { onRequest(item.id); onClose(); }}
              >
                Request from Library
              </button>
              <p style={{ fontSize: "0.75rem", color: "var(--ink-soft)", marginTop: 8, textAlign: "center" }}>
                Metadata only — no in-copyright text or cover art reproduced.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
