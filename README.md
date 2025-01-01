# My Santuario Diverso (MySD)

**My Santuario Diverso** is an open-source community library platform built for the Santuario Diverso (SD) nook network — physical safe spaces supporting LGBTQ+, neurodiversity, trauma recovery, and migration communities, starting in Cártama, Spain.

> **Phase 1 — Frontend prototype (PoC)**
> All data lives in the browser's `localStorage`. There is no backend or database in this release. This is the software artefact described in Anexo II of the SD grant application.

---

## What it does

MySD is a digital extension of the physical lending nook. It gives members and volunteers a unified interface for:

| View | Who | What |
|---|---|---|
| **Library** | Everyone | Browse, search, and filter the book collection by category |
| **Resource Kit** | Everyone | Request a pre-loaded e-reader device (the "Digital Resource Kit") for 1-week loans |
| **My Loans** | Everyone | See and return currently borrowed items |
| **Recommendations** | Everyone | Full curated reading list (130+ titles across all focus areas) |
| **H2H Eves** | Members / Volunteers | Browse and RSVP to Heart2Heart community events; volunteers create and manage events |
| **Forum** | Everyone | Threaded community discussions with moderation flagging |
| **My Profile** | Everyone | Document safe, private notes, invite codes, story & clearance |
| **Members & Logistics** | Volunteers only | Members directory (with guardian contacts for minors), shipping labels, book scanner simulation |
| **Volunteer Dashboard** | Volunteers only | Impact dashboard, inbox, moderation queue |

### SD Score

The SD Score visible on the volunteer dashboard is a **software engagement indicator** for demo purposes. It is not a validated impact metric and should not be presented as one.

---

## Getting started

```bash
# 1. Clone
git clone https://github.com/Santuario-Diverso/feel-in-the-blanks.git
cd feel-in-the-blanks

# 2. Install
npm install        # or: pnpm install

# 3. Run
npm run dev        # or: pnpm dev
```

Open the URL shown in your terminal. Use the **"Viewing as"** dropdown (top-right) to switch between the `Alex (member)` and `Sam Volunteer (volunteer)` demo accounts.

---

## Technology

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Routing | `wouter` |
| Styling | Custom CSS — Teal `#1cb5b1`, Lilac `#b28ad6`, Beige `#f7f1e8` |
| Data | `fakeApi.js` + `localStorage` (no backend) |
| Build | Vite |

---

## Scope notes (Anexo II)

- All nine views listed in the table above are within Anexo II scope.
- `components/ui/` (shadcn/ui) is MIT-licensed third-party UI scaffolding and retains its own licence.
- No in-copyright book text or cover art is reproduced — item data is bibliographic metadata only.
- The L3/L4 backend infrastructure layers are out of scope for this Phase 1 release.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Contributions require a Developer Certificate of Origin (DCO) sign-off (`git commit -s`). No CLA.

## Licence

Source code: [EUPL-1.2](LICENSE)
Content (documentation, copy): [CC BY 4.0](LICENSES/CC-BY-4.0.txt)
