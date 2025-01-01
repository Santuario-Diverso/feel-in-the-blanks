import React, { useState, useMemo } from "react";
import { getMembers, getAllocationsForUser, getAllItems, generateLabel } from "../fakeApi";

export default function VolunteerLogistics({ currentUser }) {
  const [viewScope, setViewScope] = useState("loc-cartama");
  const [activeTab, setActiveTab] = useState("members");
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  const members = getMembers();
  const allItems = getAllItems();

  const activeAllocations = useMemo(() => {
    const allocations = [];
    members.forEach((member) => {
      if (viewScope !== "all" && member.locationId !== viewScope) return;
      const memberAllocations = getAllocationsForUser(
        member.id,
        viewScope === "all" ? member.locationId : viewScope
      );
      memberAllocations.forEach((a) => allocations.push({ ...a, requester: member }));
    });
    return allocations;
  }, [members, viewScope]);

  const filteredMembers = members.filter(
    (m) => viewScope === "all" || m.locationId === viewScope
  );

  const handlePrintLabel = (allocation) => {
    const label = generateLabel(allocation.copy.id);
    alert(
      `Label Generated!\nCarrier: ${label.carrier}\nTracking: ${label.trackingNumber}\nTo: ${allocation.requester.address}`
    );
  };

  const handleScan = () => {
    setScannerActive(true);
    setScannedResult(null);
    setTimeout(() => {
      setScannedResult({ title: "Transgender History", isbn: "978-1580056892", match: true });
    }, 1500);
  };

  return (
    <div className="logistics-view">
      <div className="panel" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <h2 className="panel-title" style={{ margin: 0 }}>Logistics & Members</h2>
          <div className="toggle-group">
            <button className={`btn ${viewScope === "loc-cartama" ? "btn-primary" : "btn-outline"}`} onClick={() => setViewScope("loc-cartama")}>
              My SD (Cártama)
            </button>
            <button className={`btn ${viewScope === "all" ? "btn-primary" : "btn-outline"}`} onClick={() => setViewScope("all")}>
              All SD Members
            </button>
          </div>
        </div>
      </div>

      <nav className="tab-bar" style={{ marginBottom: 20, background: "transparent", border: "none", padding: 0 }}>
        <button className={`tab ${activeTab === "members" ? "tab-active" : ""}`} onClick={() => setActiveTab("members")}>Members Directory</button>
        <button className={`tab ${activeTab === "allocations" ? "tab-active" : ""}`} onClick={() => setActiveTab("allocations")}>Shipping & Loans</button>
        <button className={`tab ${activeTab === "ocr" ? "tab-active" : ""}`} onClick={() => setActiveTab("ocr")}>Book Scanner (OCR)</button>
      </nav>

      {activeTab === "members" && (
        <div className="grid">
          {filteredMembers.map((member) => (
            <div key={member.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 className="card-title">{member.name}</h3>
                {member.isMinor && (
                  <span className="pill" style={{ background: "var(--lilac-soft)", color: "var(--lilac)", fontSize: "0.7rem" }}>Minor</span>
                )}
              </div>
              <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "var(--ink-soft)" }}>{member.email}</p>
              <p style={{ margin: "4px 0", fontSize: "0.85rem", color: "var(--ink-soft)" }}>Joined: {member.joined}</p>

              {member.isMinor && member.family?.adults?.length > 0 && (
                <div style={{ marginTop: 12, background: "var(--lilac-soft)", borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: 6, color: "var(--lilac)" }}>
                    Guardian contacts
                  </div>
                  {member.family.adults.map((adult, i) => (
                    <div key={i} style={{ fontSize: "0.8rem", marginBottom: 4 }}>
                      <strong>{adult.name}</strong> · {adult.phone}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {filteredMembers.length === 0 && <div className="empty-state">No members found.</div>}
        </div>
      )}

      {activeTab === "allocations" && (
        <div className="list">
          {activeAllocations.length === 0 ? (
            <div className="empty-state">No active loans for this view.</div>
          ) : (
            activeAllocations.map((allocation) => (
              <div key={allocation.copy.id} className="list-item" style={{ flexDirection: "column", alignItems: "stretch", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{allocation.item.title}</strong>
                  <span className="pill pill-category">On loan</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
                  Borrower: {allocation.requester.name} · Copy: {allocation.copy.id}
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => handlePrintLabel(allocation)}>
                  Print Shipping Label
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "ocr" && (
        <div className="panel" style={{ textAlign: "center", padding: 40 }}>
          <h3 className="panel-title">Physical Book Scanner</h3>
          <p className="panel-text">Use your device camera to scan book covers or ISBNs for quick inventory management.</p>
          {!scannerActive ? (
            <button className="btn btn-primary" style={{ fontSize: "1.1rem", padding: "12px 24px" }} onClick={handleScan}>
              Activate Camera / OCR
            </button>
          ) : (
            <div style={{ marginTop: 20 }}>
              <div style={{ width: "100%", height: 200, background: "#000", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginBottom: 20, flexDirection: "column", gap: 8 }}>
                <span>[Camera Feed Simulation]</span>
                <span>Scanning…</span>
              </div>
              {scannedResult && (
                <div className="card" style={{ textAlign: "left", maxWidth: 400, margin: "0 auto" }}>
                  <div style={{ background: "#d4edda", color: "#155724", padding: "8px 12px", borderRadius: "8px 8px 0 0", fontWeight: "bold" }}>
                    ✓ Match Found
                  </div>
                  <div style={{ padding: 16 }}>
                    <h4 style={{ margin: "0 0 8px" }}>{scannedResult.title}</h4>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>ISBN: {scannedResult.isbn}</p>
                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                      <button className="btn btn-sm btn-primary">Check In</button>
                      <button className="btn btn-sm btn-outline">View Info</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
