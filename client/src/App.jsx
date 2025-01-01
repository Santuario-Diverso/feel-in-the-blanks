import React, { useState, useMemo } from "react";
import { locations } from "./data/locations";
import {
  getAllItems,
  getItemsForLocation,
  getAllocationsForUser,
  requestCopy,
  returnCopy,
  resetInventory,
  getEDevices,
  requestEMember,
  getEvents,
} from "./fakeApi";
import ItemList from "./components/ItemList";
import MyItems from "./components/MyItems";
import AdminView from "./components/AdminView";
import H2HEves from "./components/H2HEves";
import MemberEvents from "./components/MemberEvents";
import ItemDetailsModal from "./components/ItemDetailsModal";
import Forum from "./components/Forum";
import VolunteerLogistics from "./components/VolunteerLogistics";
import UserProfile from "./components/UserProfile";
import RecommendedBooks from "./components/RecommendedBooks";

const USERS = [
  { id: "user-member", name: "Alex", role: "member", locationId: "loc-cartama" },
  { id: "user-vol", name: "Sam Volunteer", role: "volunteer", locationId: "loc-cartama" },
];

export default function App() {
  const [currentUserId, setCurrentUserId] = useState("user-member");
  const [view, setView] = useState("browse");
  const [itemsVersion, setItemsVersion] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const currentUser = USERS.find((u) => u.id === currentUserId) ?? USERS[0];
  const currentLocation = locations.find((loc) => loc.id === currentUser.locationId);

  const allItems = useMemo(() => getAllItems(), [itemsVersion]);
  const itemsAtLocation = useMemo(() => getItemsForLocation(currentUser.locationId), [itemsVersion, currentUser.locationId]);
  const allocations = useMemo(() => getAllocationsForUser(currentUser.id, currentUser.locationId), [itemsVersion, currentUser.id, currentUser.locationId]);
  const eDevices = useMemo(() => getEDevices(currentUser.locationId), [itemsVersion, currentUser.locationId]);
  const events = useMemo(() => getEvents(), [itemsVersion]);

  const categories = useMemo(() => {
    const set = new Set();
    allItems.forEach((b) => { if (b.category) set.add(b.category); });
    return Array.from(set).sort();
  }, [allItems]);

  const handleRequest = (itemId) => {
    requestCopy({ itemId, userId: currentUser.id, locationId: currentUser.locationId });
    setItemsVersion((v) => v + 1);
  };

  const handleRequestEMember = () => {
    const success = requestEMember({ userId: currentUser.id, locationId: currentUser.locationId });
    if (success) { setItemsVersion((v) => v + 1); setView("my"); }
    else alert("No Resource Kit devices available at this location right now.");
  };

  const handleReturn = (copyId) => { returnCopy({ copyId }); setItemsVersion((v) => v + 1); };
  const handleReset = () => { resetInventory(); setItemsVersion((v) => v + 1); };

  const filteredItems = itemsAtLocation.filter((item) => {
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.creator || "").toLowerCase().includes(search.toLowerCase());
    const isResourceKit = (item.useCase || "").includes("Resource Kit");
    if (view === "resource") return matchesSearch && isResourceKit;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app-root">
      <div className="app-shell">
        <header className="app-header">
          <div className="app-logo">
            <div className="logo-orb" />
            <div className="logo-text">
              <span className="logo-title">My Santuario Diverso</span>
              <span className="logo-subtitle">{currentLocation?.name}</span>
            </div>
          </div>
          <div className="app-controls">
            <div className="control-group">
              <span className="control-label">Viewing as</span>
              <select
                className="input"
                value={currentUserId}
                onChange={(e) => { setCurrentUserId(e.target.value); setView("browse"); }}
              >
                {USERS.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <nav className="tab-bar">
          {[
            { key: "browse", label: "Library" },
            { key: "resource", label: "Resource Kit" },
            { key: "my", label: "My Loans" },
            { key: "recommendations", label: "Recommendations" },
            { key: "h2h", label: "H2H Eves" },
            { key: "forum", label: "Forum" },
            { key: "profile", label: "My Profile" },
          ].map(({ key, label }) => (
            <button key={key} className={`tab ${view === key ? "tab-active" : ""}`} onClick={() => setView(key)}>
              {label}
            </button>
          ))}
          {currentUser.role === "volunteer" && (
            <>
              <button className={`tab ${view === "logistics" ? "tab-active" : ""}`} onClick={() => setView("logistics")}>Members & Logistics</button>
              <button className={`tab ${view === "admin" ? "tab-active" : ""}`} onClick={() => setView("admin")}>Volunteer</button>
            </>
          )}
        </nav>

        {(view === "browse" || view === "resource") && (
          <main className="main">
            <section className="filters">
              <div className="filter-item grow">
                <input className="input" placeholder="Search by title or creator…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </section>

            {view === "browse" && (
              <div className="filter-tags">
                <button className={`filter-tag ${categoryFilter === "all" ? "active" : ""}`} onClick={() => setCategoryFilter("all")}>All</button>
                {categories.map((cat) => (
                  <button key={cat} className={`filter-tag ${categoryFilter === cat ? "active" : ""}`} onClick={() => setCategoryFilter(cat)}>{cat}</button>
                ))}
              </div>
            )}

            {view === "resource" && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ background: "linear-gradient(135deg, rgba(28,181,177,0.1), rgba(178,138,214,0.15))", borderRadius: 18, padding: 20, display: "flex", flexDirection: "column", gap: 12, border: "1px solid rgba(255,255,255,0.5)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                    <div>
                      <h2 style={{ fontSize: "1.1rem", margin: "0 0 6px", fontWeight: 650 }}>Digital Resource Kit</h2>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--ink-soft)" }}>Request a pre-loaded e-reader device containing the entire Resource Kit collection.</p>
                    </div>
                    <button className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.9rem" }} onClick={handleRequestEMember}>
                      Request E-Reader (1 week)
                    </button>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--ink-soft)" }}>
                    <span className="availability availability-ok" style={{ background: "rgba(255,255,255,0.6)" }}>
                      {eDevices.filter((r) => r.status === "available").length} devices available
                    </span>
                  </div>
                </div>
              </div>
            )}

            <ItemList items={filteredItems} currentUser={currentUser} locationId={currentUser.locationId} onRequest={handleRequest} onItemClick={setSelectedItem} />
          </main>
        )}

        {view === "my" && <main className="main"><MyItems allocations={allocations} onReturn={handleReturn} /></main>}
        {view === "recommendations" && <main className="main"><RecommendedBooks /></main>}
        {view === "h2h" && (
          <main className="main">
            {currentUser.role === "volunteer" ? <H2HEves currentUser={currentUser} /> : <MemberEvents currentUser={currentUser} />}
          </main>
        )}
        {view === "forum" && <main className="main"><Forum currentUser={currentUser} /></main>}
        {view === "profile" && <main className="main"><UserProfile currentUser={currentUser} /></main>}
        {view === "logistics" && currentUser.role === "volunteer" && <main className="main"><VolunteerLogistics currentUser={currentUser} /></main>}
        {view === "admin" && currentUser.role === "volunteer" && (
          <main className="main">
            <AdminView items={itemsAtLocation} allItems={allItems} allocations={allocations} eDevices={eDevices} events={events} currentUser={currentUser} onReset={handleReset} />
          </main>
        )}

        <footer className="app-footer">
          <span>MySD alpha · frontend prototype only · data stored in this browser · EUPL-1.2</span>
        </footer>
      </div>

      {selectedItem && <ItemDetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} onRequest={handleRequest} />}
    </div>
  );
}
