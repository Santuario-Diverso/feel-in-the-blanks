import { useState, useMemo } from "react";
import { items } from "../data/items";

export default function RecommendedBooks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(items.map((item) => item.category))];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.creator.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="panel">
      <h2 className="panel-title">Recommended Reading</h2>
      <p className="panel-text">
        All {items.length} titles we recommend across LGBTQ+, neurodiversity, trauma recovery, and migration.
        Metadata only — no in-copyright text reproduced.
      </p>

      <div className="filters" style={{ marginBottom: 16 }}>
        <input
          className="input"
          style={{ flex: "1 1 220px" }}
          type="text"
          placeholder="Search by title or author…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="input"
          style={{ flex: "0 0 200px" }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="card">
            <div className="card-pill">
              <span className="pill pill-category">{item.category}</span>
              {item.recommendedAudience && <span className="pill">{item.recommendedAudience}</span>}
            </div>
            <h3 className="card-title">{item.title}</h3>
            <p className="card-creator">by {item.creator}</p>
            <p className="card-meta">
              {Array.isArray(item.tags) &&
                item.tags.map((tag) => (
                  <span key={tag} className="meta-chip meta-chip-soft">{tag}</span>
                ))}
            </p>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="empty-state">No titles match your search.</div>
        )}
      </div>
    </div>
  );
}
