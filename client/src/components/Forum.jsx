import React, { useState } from "react";
import { getThreads, addThread, addPost, deleteThread, deletePost } from "../fakeApi";
import { forumCategories } from "../data/forum";

function ThreadView({ thread, currentUser, onBack, onReply, onDeletePost, isModerator }) {
  const [replyText, setReplyText] = useState("");

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(thread.id, { text: replyText, creatorName: currentUser.name, creatorId: currentUser.id });
    setReplyText("");
  };

  return (
    <div className="forum-thread-view">
      <button onClick={onBack} className="btn btn-outline" style={{ marginBottom: 16 }}>
        ← Back to Discussions
      </button>
      <div className="card" style={{ marginBottom: 20 }}>
        <h2 className="card-title" style={{ fontSize: "1.4rem" }}>{thread.title}</h2>
        <div className="card-meta">
          <span className="meta-chip">Started by {thread.creatorName}</span>
          <span className="meta-chip">{thread.date}</span>
        </div>
      </div>
      <div className="forum-posts">
        {thread.posts.map((post) => (
          <div key={post.id} className="forum-post card" style={{ padding: 16, background: "rgba(255,255,255,0.6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontWeight: "bold", fontSize: "0.9rem", color: "var(--teal)" }}>{post.creatorName}</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-soft)" }}>{post.date}</span>
                {isModerator && (
                  <button
                    onClick={() => onDeletePost(thread.id, post.id)}
                    style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "0.8rem" }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.5 }}>{post.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleReply} style={{ marginTop: 24 }}>
        <textarea
          className="input"
          style={{ width: "100%", minHeight: 100, marginBottom: 12 }}
          placeholder="Write your reply…"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Post Reply</button>
      </form>
    </div>
  );
}

export default function Forum({ currentUser }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", categoryId: forumCategories[0].id, text: "" });
  const [forumVersion, setForumVersion] = useState(0);

  const threads = getThreads();
  const isModerator = currentUser.role === "volunteer";

  const filteredThreads = threads.filter(
    (th) => activeCategory === "all" || th.categoryId === activeCategory
  );
  const activeThread = threads.find((th) => th.id === activeThreadId);

  const handleCreateThread = (e) => {
    e.preventDefault();
    const thread = addThread({
      title: newThread.title,
      categoryId: newThread.categoryId,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
    });
    addPost(thread.id, { text: newThread.text, creatorName: currentUser.name, creatorId: currentUser.id });
    setIsCreating(false);
    setNewThread({ title: "", categoryId: forumCategories[0].id, text: "" });
    setForumVersion((v) => v + 1);
  };

  const handleReply = (threadId, postData) => {
    addPost(threadId, postData);
    setForumVersion((v) => v + 1);
  };

  const handleDeleteThread = (e, threadId) => {
    e.stopPropagation();
    if (window.confirm("Delete this discussion and all its replies?")) {
      deleteThread(threadId);
      setForumVersion((v) => v + 1);
    }
  };

  const handleDeletePost = (threadId, postId) => {
    if (window.confirm("Permanently delete this post?")) {
      deletePost(threadId, postId);
      setForumVersion((v) => v + 1);
    }
  };

  if (activeThread) {
    return (
      <ThreadView
        thread={activeThread}
        currentUser={currentUser}
        onBack={() => setActiveThreadId(null)}
        onReply={handleReply}
        onDeletePost={handleDeletePost}
        isModerator={isModerator}
      />
    );
  }

  return (
    <div className="forum-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 className="panel-title" style={{ margin: 0 }}>Community Forum</h2>
        <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
          + New Discussion
        </button>
      </div>

      {isCreating && (
        <form className="panel" onSubmit={handleCreateThread} style={{ marginBottom: 20 }}>
          <h3 className="panel-title">Start a Discussion</h3>
          <div className="form-group">
            <label>Category</label>
            <select
              className="input"
              value={newThread.categoryId}
              onChange={(e) => setNewThread({ ...newThread, categoryId: e.target.value })}
            >
              {forumCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              className="input"
              required
              value={newThread.title}
              onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
              placeholder="What do you want to discuss?"
            />
          </div>
          <div className="form-group">
            <label>Your opening post</label>
            <textarea
              className="input"
              required
              rows={4}
              value={newThread.text}
              onChange={(e) => setNewThread({ ...newThread, text: e.target.value })}
              placeholder="Share your thoughts…"
            />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="btn btn-primary">Post</button>
            <button type="button" className="btn btn-outline" onClick={() => setIsCreating(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="filter-tags" style={{ marginBottom: 16 }}>
        <button
          className={`filter-tag ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >All</button>
        {forumCategories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-tag ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
          >{cat.title}</button>
        ))}
      </div>

      <div className="forum-thread-list list">
        {filteredThreads.map((thread) => (
          <div
            key={thread.id}
            className="list-item"
            style={{ cursor: "pointer", padding: 16, alignItems: "flex-start" }}
            onClick={() => setActiveThreadId(thread.id)}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className="pill pill-category" style={{ fontSize: "0.65rem" }}>
                  {forumCategories.find((c) => c.id === thread.categoryId)?.title}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--ink-soft)" }}>
                  by {thread.creatorName} · {thread.date}
                </span>
              </div>
              <h3 className="list-title" style={{ fontSize: "1.1rem", marginBottom: 4 }}>{thread.title}</h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--ink-soft)" }}>
                {thread.posts[0]?.text.substring(0, 100)}…
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <span className="meta-chip">{thread.posts.length} posts</span>
              {isModerator && (
                <button
                  className="btn btn-sm btn-outline"
                  style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                  onClick={(e) => handleDeleteThread(e, thread.id)}
                >Delete</button>
              )}
            </div>
          </div>
        ))}
        {filteredThreads.length === 0 && (
          <div className="empty-state">No discussions in this category yet.</div>
        )}
      </div>
    </div>
  );
}
