# Provenance

## Release statement

**My Santuario Diverso (MySD)** is released as open-source software by **Santuario Diverso (SD)**. SD is the releasing entity and steward of this work, and holds the right to publish and licence it.

This release reflects the software artefact described in the Anexo II of the SD grant application. The release is made under SD's own authority and does not name, imply endorsement by, or create obligations for any third party, programme, or private instrument involved in the project's funding history.

---

## What is included

| Layer | Included? | Notes |
|---|---|---|
| Frontend prototype (React, `fakeApi.js`, all nine Anexo II views) | ✅ Yes | EUPL-1.2 |
| Bibliographic metadata (book titles, authors, categories) | ✅ Yes | Public bibliographic data, no in-copyright text |
| `components/ui/` (shadcn/ui scaffolding) | ✅ Yes | MIT licence, retains its own attribution |
| In-copyright book text or cover images | ❌ No | Not reproduced |
| L3/L4 backend infrastructure | ❌ No | Out of scope for Phase 1 |
| Personal data of real individuals | ❌ No | All seed data is fully synthetic |

---

## Synthetic demo data

All names, email addresses, phone numbers, and addresses in the codebase are synthetic fixtures created for demonstration purposes. They do not correspond to any real person.

Demo accounts:
- `user-member` — Alex (member role)
- `user-vol` — Sam Volunteer (volunteer role)

Minor member records (`user-teen`, `user-kid`) and their guardian contacts are entirely fictional and are included solely to demonstrate the platform's safeguarding UI.

---

## Licence

Source code: [EUPL-1.2](LICENSE)
Documentation and content: [CC BY 4.0](LICENSES/CC-BY-4.0.txt)

Contributions accepted under the Developer Certificate of Origin (DCO). See [CONTRIBUTING.md](CONTRIBUTING.md).
