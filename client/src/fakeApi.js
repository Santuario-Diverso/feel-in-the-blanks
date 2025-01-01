import { items as initialItems } from "./data/items";
import { initialEvents, initialIdeas } from "./data/events";
import { initialThreads, mockMembers } from "./data/forum";

const STORAGE_KEY    = "mysd_items_v1";
const EMEMBERS_KEY   = "mysd_emembers_v1";
const EVENTS_KEY     = "mysd_events_v1";
const IDEAS_KEY      = "mysd_ideas_v1";
const USER_STATS_KEY = "mysd_user_stats_v1";
const FORUM_KEY      = "mysd_forum_v1";
const MEMBERS_KEY    = "mysd_members_v1";
const INBOX_KEY      = "mysd_inbox_v1";
const DOCS_KEY       = "mysd_docs_v1";
const NOTES_KEY      = "mysd_notes_v1";

const initialEDevices = [
  { id: "er-1", locationId: "loc-cartama", status: "available" },
  { id: "er-2", locationId: "loc-cartama", status: "available" },
  { id: "er-3", locationId: "loc-cartama", status: "available" },
  { id: "er-4", locationId: "loc-cartama", status: "on_allocation", requesterId: "user-b" },
];

const initialUserStats = {
  "user-member": { itemsCompleted: 3, eventsOrganized: 0, tasksCompleted: 0, ideasContributed: 1 },
  "user-vol":    { itemsCompleted: 12, eventsOrganized: 3, tasksCompleted: 5, ideasContributed: 2 },
};

const initialMessages = [
  {
    id: "msg-1",
    from: "Guardian of new member",
    subject: "Question about NeuroQueer Dads night",
    body: "Hi, I saw your flyer. Is it okay if I arrive a bit late? I work until 7pm.",
    date: "2025-12-08",
    completed: false,
    type: "contact",
  },
  {
    id: "msg-2",
    from: "System",
    subject: "New Member Registration: Jordan",
    body: "A new member Jordan (16) has registered and requires minor verification.",
    date: "2025-12-09",
    completed: true,
    type: "system",
  },
];

function loadState(key, initial) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(initial);
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return structuredClone(initial);
    return parsed;
  } catch {
    return structuredClone(initial);
  }
}

let stateItems      = loadState(STORAGE_KEY,    initialItems);
let stateEDevices   = loadState(EMEMBERS_KEY,   initialEDevices);
let stateEvents     = loadState(EVENTS_KEY,     initialEvents);
let stateIdeas      = loadState(IDEAS_KEY,      initialIdeas);
let stateUserStats  = loadState(USER_STATS_KEY, initialUserStats);
let stateThreads    = loadState(FORUM_KEY,      initialThreads);
let stateMembers    = loadState(MEMBERS_KEY,    mockMembers);
let stateInbox      = loadState(INBOX_KEY,      initialMessages);
let stateDocs       = loadState(DOCS_KEY,       {});
let stateNotes      = loadState(NOTES_KEY,      {});

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY,    JSON.stringify(stateItems));
    localStorage.setItem(EMEMBERS_KEY,   JSON.stringify(stateEDevices));
    localStorage.setItem(EVENTS_KEY,     JSON.stringify(stateEvents));
    localStorage.setItem(IDEAS_KEY,      JSON.stringify(stateIdeas));
    localStorage.setItem(USER_STATS_KEY, JSON.stringify(stateUserStats));
    localStorage.setItem(FORUM_KEY,      JSON.stringify(stateThreads));
    localStorage.setItem(MEMBERS_KEY,    JSON.stringify(stateMembers));
    localStorage.setItem(INBOX_KEY,      JSON.stringify(stateInbox));
    localStorage.setItem(DOCS_KEY,       JSON.stringify(stateDocs));
    localStorage.setItem(NOTES_KEY,      JSON.stringify(stateNotes));
  } catch {
    // storage unavailable — silently skip
  }
}

// ── Items ────────────────────────────────────────────────────────────────────

export function getAllItems() { return stateItems; }

export function getItemsForLocation(locationId) {
  return stateItems.filter((item) =>
    Array.isArray(item.copies) && item.copies.some((c) => c.locationId === locationId)
  );
}

export function requestCopy({ itemId, userId, locationId }) {
  stateItems = stateItems.map((item) => {
    if (item.id !== itemId) return item;
    const availableCopy = item.copies.find(
      (c) => c.locationId === locationId && c.status === "available"
    );
    if (!availableCopy) return item;
    const updatedCopies = item.copies.map((c) =>
      c.id === availableCopy.id ? { ...c, status: "on_allocation", requesterId: userId } : c
    );
    return { ...item, copies: updatedCopies };
  });
  const stats = stateUserStats[userId] || { itemsCompleted: 0, eventsOrganized: 0, tasksCompleted: 0, ideasContributed: 0 };
  stateUserStats[userId] = { ...stats };
  persist();
}

export function returnCopy({ copyId }) {
  stateItems = stateItems.map((item) => {
    const copy = item.copies?.find((c) => c.id === copyId);
    if (!copy) return item;
    const requesterId = copy.requesterId;
    const updatedCopies = item.copies.map((c) =>
      c.id === copyId ? { ...c, status: "available", requesterId: null } : c
    );
    if (requesterId) {
      const stats = stateUserStats[requesterId] || { itemsCompleted: 0, eventsOrganized: 0, tasksCompleted: 0, ideasContributed: 0 };
      stateUserStats[requesterId] = { ...stats, itemsCompleted: stats.itemsCompleted + 1 };
    }
    return { ...item, copies: updatedCopies };
  });
  persist();
}

export function getAllocationsForUser(userId, locationId) {
  const result = [];
  for (const item of stateItems) {
    if (!Array.isArray(item.copies)) continue;
    for (const copy of item.copies) {
      if (copy.status === "on_allocation" && copy.requesterId === userId && copy.locationId === locationId) {
        result.push({ item, copy });
      }
    }
  }
  return result;
}

// ── E-Devices (Resource Kit) ─────────────────────────────────────────────────

export function getEDevices(locationId) {
  return stateEDevices.filter((d) => d.locationId === locationId);
}

export function requestEMember({ userId, locationId }) {
  const available = stateEDevices.find(
    (d) => d.locationId === locationId && d.status === "available"
  );
  if (!available) return false;
  stateEDevices = stateEDevices.map((d) =>
    d.id === available.id ? { ...d, status: "on_allocation", requesterId: userId } : d
  );
  persist();
  return true;
}

// ── Events ───────────────────────────────────────────────────────────────────

export function getEvents() { return stateEvents; }

export function addEvent(event) {
  const newEvent = {
    ...event,
    id: `evt-${Date.now()}`,
    signups: 0,
    rsvps: [],
    tasks: event.tasks || [],
  };
  stateEvents = [...stateEvents, newEvent];
  const stats = stateUserStats[event.organizerId] || { itemsCompleted: 0, eventsOrganized: 0, tasksCompleted: 0, ideasContributed: 0 };
  stateUserStats[event.organizerId] = { ...stats, eventsOrganized: stats.eventsOrganized + 1 };
  persist();
  return newEvent;
}

export function toggleTask(eventId, taskId) {
  stateEvents = stateEvents.map((evt) => {
    if (evt.id !== eventId) return evt;
    const tasks = (evt.tasks || []).map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );
    return { ...evt, tasks };
  });
  persist();
}

export function rsvpEvent(eventId, userId, status) {
  stateEvents = stateEvents.map((evt) => {
    if (evt.id !== eventId) return evt;
    const otherRsvps = (evt.rsvps || []).filter((r) => r.userId !== userId);
    const newRsvps = [...otherRsvps, { userId, status }];
    const signups = newRsvps.filter((r) => r.status === "yes").length;
    return { ...evt, rsvps: newRsvps, signups };
  });
  persist();
}

// ── Ideas ─────────────────────────────────────────────────────────────────────

export function getIdeas() { return stateIdeas; }

export function addIdea(text, creator) {
  const newIdea = { id: `idea-${Date.now()}`, text, creator };
  stateIdeas = [...stateIdeas, newIdea];
  persist();
  return newIdea;
}

export function deleteIdea(id) {
  stateIdeas = stateIdeas.filter((i) => i.id !== id);
  persist();
}

// ── Forum ─────────────────────────────────────────────────────────────────────

export function getThreads() { return stateThreads; }

export function addThread({ title, categoryId, creatorId, creatorName }) {
  const thread = {
    id: `th-${Date.now()}`,
    categoryId,
    title,
    creatorId,
    creatorName,
    date: new Date().toISOString().split("T")[0],
    posts: [],
  };
  stateThreads = [...stateThreads, thread];
  persist();
  return thread;
}

export function addPost(threadId, { text, creatorName, creatorId }) {
  stateThreads = stateThreads.map((th) => {
    if (th.id !== threadId) return th;
    const post = {
      id: `p-${Date.now()}`,
      creatorName,
      creatorId,
      text,
      date: new Date().toISOString().split("T")[0],
      flagged: false,
    };
    return { ...th, posts: [...th.posts, post] };
  });
  persist();
}

export function deleteThread(threadId) {
  stateThreads = stateThreads.filter((th) => th.id !== threadId);
  persist();
}

export function deletePost(threadId, postId) {
  stateThreads = stateThreads.map((th) => {
    if (th.id !== threadId) return th;
    return { ...th, posts: th.posts.filter((p) => p.id !== postId) };
  });
  persist();
}

export function togglePostFlag(threadId, postId) {
  stateThreads = stateThreads.map((th) => {
    if (th.id !== threadId) return th;
    return {
      ...th,
      posts: th.posts.map((p) => (p.id === postId ? { ...p, flagged: !p.flagged } : p)),
    };
  });
  persist();
}

export function getFlaggedPosts() {
  const result = [];
  for (const th of stateThreads) {
    for (const post of th.posts) {
      if (post.flagged) result.push({ ...post, threadId: th.id, threadTitle: th.title });
    }
  }
  return result;
}

// ── Members ───────────────────────────────────────────────────────────────────

export function getMembers() { return stateMembers; }

// ── Inbox ─────────────────────────────────────────────────────────────────────

export function getInbox() { return stateInbox; }

export function markMessageCompleted(id) {
  stateInbox = stateInbox.map((m) => (m.id === id ? { ...m, completed: true } : m));
  persist();
}

export function deleteMessage(id) {
  stateInbox = stateInbox.filter((m) => m.id !== id);
  persist();
}

// ── Documents & Notes ─────────────────────────────────────────────────────────

export function getDocuments(userId) { return stateDocs[userId] || []; }

export function addDocument(userId, docMeta) {
  const newDoc = {
    ...docMeta,
    id: `doc-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
  };
  stateDocs[userId] = [...(stateDocs[userId] || []), newDoc];
  persist();
  return newDoc;
}

export function getNotes(userId) { return stateNotes[userId] || { content: "" }; }

export function updateNotes(userId, content) {
  stateNotes[userId] = { content };
  persist();
}

// ── Invites ───────────────────────────────────────────────────────────────────

export function generateInviteLink(type) {
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  return { code, type, url: `https://mysd.example.org/join?code=${code}` };
}

// ── Logistics ─────────────────────────────────────────────────────────────────

export function generateLabel(copyId) {
  return {
    carrier: "Correos",
    trackingNumber: `ES${Math.random().toString().slice(2, 12)}ES`,
    copyId,
  };
}

export function updateAllocationShipping(copyId, shippingData) {
  stateItems = stateItems.map((item) => ({
    ...item,
    copies: (item.copies || []).map((c) =>
      c.id === copyId ? { ...c, ...shippingData } : c
    ),
  }));
  persist();
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export function getUserStats(userId) {
  return stateUserStats[userId] || { itemsCompleted: 0, eventsOrganized: 0, tasksCompleted: 0, ideasContributed: 0 };
}

// ── Reset ─────────────────────────────────────────────────────────────────────

export function resetInventory() {
  stateItems     = structuredClone(initialItems);
  stateEDevices  = structuredClone(initialEDevices);
  stateEvents    = structuredClone(initialEvents);
  stateIdeas     = structuredClone(initialIdeas);
  stateUserStats = structuredClone(initialUserStats);
  stateThreads   = structuredClone(initialThreads);
  stateMembers   = structuredClone(mockMembers);
  stateInbox     = structuredClone(initialMessages);
  stateDocs      = {};
  stateNotes     = {};
  persist();
}
