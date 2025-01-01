import React from "react";

export default function MyItems({ allocations, onReturn }) {
  return (
    <section className="panel">
      <h2 className="panel-title">Your current loans</h2>
      {allocations.length === 0 && (
        <p className="panel-text">
          You don&apos;t have anything out right now. Time to find a new favourite?
        </p>
      )}
      <div className="list">
        {allocations.map(({ item, copy }) => (
          <div key={copy.id} className="list-item">
            <div>
              <div className="list-title">{item.title}</div>
              <div className="list-sub">by {item.creator} · copy #{copy.id}</div>
            </div>
            <button className="btn btn-outline" onClick={() => onReturn(copy.id)}>
              Return
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
