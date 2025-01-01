export const forumCategories = [
  { id: "cat-1", title: "General Discussion", description: "Chat about anything related to the library." },
  { id: "cat-2", title: "Book Recommendations", description: "Share your favourite reads." },
  { id: "cat-3", title: "H2H Event Follow-up", description: "Continue the conversation from our events." },
  { id: "cat-4", title: "Support & Advice", description: "A safe space to ask for help." },
];

export const initialThreads = [
  {
    id: "th-1",
    categoryId: "cat-1",
    title: "Welcome to the new digital nook!",
    creatorId: "user-vol",
    creatorName: "Sam Volunteer",
    date: "2025-12-01",
    posts: [
      { id: "p-1", creatorName: "Sam Volunteer", text: "Welcome everyone! Feel free to introduce yourselves here.", date: "2025-12-01" },
      { id: "p-2", creatorName: "Alex", text: "Hi! Love the new setup.", date: "2025-12-02" },
    ],
  },
  {
    id: "th-2",
    categoryId: "cat-2",
    title: "Thoughts on 'The Transgender Issue'?",
    creatorId: "user-member",
    creatorName: "Alex",
    date: "2025-12-05",
    posts: [
      { id: "p-3", creatorName: "Alex", text: "Just finished Shon Faye's book. Incredible — especially the policy chapters.", date: "2025-12-05" },
    ],
  },
];

export const mockMembers = [
  {
    id: "user-member",
    name: "Alex",
    email: "alex.member@example.com",
    locationId: "loc-cartama",
    address: "Calle Ejemplo 1, Cártama, Spain",
    joined: "2024-01-15",
  },
  {
    id: "user-vol",
    name: "Sam Volunteer",
    email: "sam.vol@example.com",
    locationId: "loc-cartama",
    address: "Calle Ejemplo 2, Cártama, Spain",
    joined: "2024-01-10",
    role: "volunteer",
  },
  {
    id: "user-b",
    name: "River",
    email: "river@example.com",
    locationId: "loc-cartama",
    address: "Avenida Principal 10, Cártama, Spain",
    joined: "2024-02-20",
  },
  {
    id: "user-teen",
    name: "Jamie (16)",
    email: "jamie.guardian@example.com",
    locationId: "loc-cartama",
    address: "Calle Ejemplo 3, Cártama, Spain",
    joined: "2024-04-05",
    isMinor: true,
    family: {
      adults: [
        { name: "Guardian A", phone: "+34 600 000 001", email: "guardian.a@example.com" },
        { name: "Guardian B", phone: "+34 600 000 002", email: "guardian.b@example.com" },
      ],
    },
  },
  {
    id: "user-kid",
    name: "Sammy (12)",
    email: "sammy.guardian@example.com",
    locationId: "loc-cartama",
    address: "Avenida Principal 11, Cártama, Spain",
    joined: "2024-05-12",
    isMinor: true,
    family: {
      adults: [
        { name: "Guardian C", phone: "+34 600 000 003", email: "guardian.c@example.com" },
      ],
    },
  },
];
