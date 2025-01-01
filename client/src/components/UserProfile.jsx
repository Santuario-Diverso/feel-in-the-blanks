import React, { useState } from "react";
import { getDocuments, addDocument, getNotes, updateNotes, generateInviteLink } from "../fakeApi";

export default function UserProfile({ currentUser }) {
  const [activeTab, setActiveTab] = useState("docs");
  const [documents, setDocuments] = useState(getDocuments(currentUser.id));
  const [notes, setNotes] = useState(getNotes(currentUser.id));
  const [inviteResult, setInviteResult] = useState(null);
  const [noteText, setNoteText] = useState(notes.content || "");
  const [isNoteDirty, setIsNoteDirty] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSaveNotes = () => {
    updateNotes(currentUser.id, noteText);
    setIsNoteDirty(false);
    alert("Notes saved.");
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    setUploading(true);
    setTimeout(() => {
      const fileInput = document.getElementById("file-upload");
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const newDoc = addDocument(currentUser.id, {
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024).toFixed(1)} KB`,
        });
        setDocuments((prev) => [...prev, newDoc]);
        fileInput.value = "";
        alert("Document uploaded.");
      }
      setUploading(false);
    }, 1000);
  };

  const generateInvite = (type) => {
    setInviteResult(generateInviteLink(type));
  };

  return (
    <div className="profile-container">
      <div className="panel" style={{ marginBottom: 20 }}>
        <h2 className="panel-title">My Profile & Data</h2>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 8 }}>
          <div className="avatar-placeholder" style={{ width: 60, height: 60, fontSize: "1.5rem", borderRadius: "50%", background: "var(--teal-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h3 style={{ margin: 0 }}>{currentUser.name}</h3>
            <p style={{ margin: 0, color: "var(--ink-soft)" }}>{currentUser.role}</p>
          </div>
        </div>
      </div>

      <nav className="tab-bar" style={{ marginBottom: 20, background: "transparent", border: "none", padding: 0 }}>
        {["docs", "notes", "invites", "story"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {{ docs: "My Documents", notes: "My Notes", invites: "Invites", story: "My Story & Clearance" }[tab]}
          </button>
        ))}
      </nav>

      {activeTab === "docs" && (
        <section className="panel">
          <h3 className="panel-title">Document Safe</h3>
          <p className="panel-text">
            Upload copies of your registration documents (e.g. NIE, safeguarding certificates) securely.
            Files are stored only in this browser — nothing is sent to a server.
          </p>
          <div style={{ border: "2px dashed var(--teal)", borderRadius: 12, padding: 24, textAlign: "center", marginBottom: 24, background: "#f9f9f9" }}>
            <input type="file" id="file-upload" style={{ display: "none" }} onChange={handleFileUpload} />
            <button className="btn btn-primary" onClick={() => document.getElementById("file-upload").click()} disabled={uploading}>
              {uploading ? "Uploading…" : "Upload New Document"}
            </button>
            <p style={{ fontSize: "0.8rem", color: "var(--ink-soft)", marginTop: 8 }}>
              Simulated upload — files stay in your browser only.
            </p>
          </div>
          {documents.length > 0 && (
            <div className="list">
              {documents.map((doc) => (
                <div key={doc.id} className="list-item">
                  <div>
                    <div className="list-title">{doc.name}</div>
                    <div className="list-sub">{doc.size} · Uploaded {doc.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "notes" && (
        <section className="panel">
          <h3 className="panel-title">My Private Notes</h3>
          <p className="panel-text">
            A personal notepad — visible only to you and stored in this browser.
          </p>
          <textarea
            className="input"
            rows={10}
            style={{ width: "100%", marginBottom: 12 }}
            value={noteText}
            onChange={(e) => { setNoteText(e.target.value); setIsNoteDirty(true); }}
            placeholder="Write anything here…"
          />
          <button className="btn btn-primary" onClick={handleSaveNotes} disabled={!isNoteDirty}>
            Save Notes
          </button>
        </section>
      )}

      {activeTab === "invites" && (
        <section className="panel">
          <h3 className="panel-title">Invite a Friend</h3>
          <p className="panel-text">
            Generate a single-use invite code to bring someone new into the community.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            <button className="btn btn-primary" onClick={() => generateInvite("member")}>Generate Member Invite</button>
            <button className="btn btn-outline" onClick={() => generateInvite("volunteer")}>Generate Volunteer Invite</button>
          </div>
          {inviteResult && (
            <div className="card" style={{ padding: 20 }}>
              <p><strong>Invite Code:</strong> <code style={{ background: "var(--teal-soft)", padding: "2px 8px", borderRadius: 6 }}>{inviteResult.code}</code></p>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>Type: {inviteResult.type}</p>
              <button
                className="btn btn-sm btn-primary"
                style={{ marginTop: 12 }}
                onClick={() => alert(`Share this code with your invitee:\n\n${inviteResult.code}\n\nThey can use it to register at the nook.`)}
              >
                Share Code
              </button>
            </div>
          )}
        </section>
      )}

      {activeTab === "story" && (
        <section className="panel">
          <h3 className="panel-title">My Story & Clearance</h3>
          <div className="card" style={{ padding: 24 }}>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>My Story (why I joined SD)</label>
              <textarea
                className="input"
                rows={5}
                placeholder="Share a bit about yourself and what brings you to this community…"
                defaultValue={currentUser.story || ""}
              />
            </div>
            <h4 style={{ borderBottom: "1px solid #eee", paddingBottom: 8 }}>Clearance & Safety Checks</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
              <label className="checkbox-container">
                <input type="checkbox" defaultChecked />
                <span>I agree to the Community Code of Conduct</span>
              </label>
              <label className="checkbox-container">
                <input type="checkbox" />
                <span>I have a valid DBS / Criminal Record Check (upload in Documents)</span>
              </label>
              <label className="checkbox-container">
                <input type="checkbox" />
                <span>I have completed the Safeguarding Training</span>
              </label>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 20 }}>Update Profile</button>
          </div>
        </section>
      )}
    </div>
  );
}
