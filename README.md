# DSD Knowledge Workflow

A clickable React prototype of the **Knowledge** feature inside Growth Hub (a white-label HighLevel CRM).
It turns recurring patient questions from appointment transcripts into clinician-approved knowledge,
then into multi-channel content, while keeping the clinician's own voice.

Built from the Claude Design handoff (`DSD Workflow.dc.html`).

## Run it

Requires Node.js 20.19+ or 22.12+ (get the LTS from https://nodejs.org).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run lint
```

## The demo flow

Click the avatar in the top-right to switch roles (**MC** = Maya Chen, content manager; **MO** = Dr. M. Okafor, clinician).

1. **Transcripts** (content manager, landing screen): weekly transcripts sync automatically. The manual upload box is a backup; clicking it runs the clustering animation and lists the new opportunities sent for clinical approval.
2. **Review** (clinician): the queue opens on *Does getting an implant hurt?*. Verify each medical claim against its evidence, which is grouped by trust type (patient transcript, provider history, research and guidelines). The clinician can mark evidence as not applicable, add their own, or refine the answer wording. Approve unlocks once every claim is verified.
3. **Create** (content manager): the approved topic now appears in the prioritized queue, with its score broken down by signal.
4. **Content Studio**: a locked source-of-truth card and trust bar, an editorial content plan (recommended vs. lower-priority channels), then generate and edit drafts.
5. **Send to publishing queue** → **Marketing**: drafts are pinned above scheduled posts, with an audit line showing who approved and who drafted each one. **Statistics** shows performance by brief, with a recommended follow-up topic.
6. **Library**: clinician-verified briefs with source counts, evidence, approver and linked assets.
7. **Settings** (content manager): editable system instructions for question grouping, voice, and each content format.

All data is mock data kept in memory. Refresh the page to reset the demo.

## Code layout

```
src/
  App.tsx                 layout, role-based tabs, screen switching
  state/                  reducer + provider (timers, toasts, scroll handling)
  data/                   seed topics, content plan, publisher/statistics seed data
  lib/                    scoring/priority rules, evidence model
  components/shell/       Growth Hub nav, top bar, feature headers (host-CRM mock)
  components/icons.tsx    inline SVG icon set
  screens/                one component + stylesheet per screen
```

The Growth Hub side nav and top bar are mock context. In production the CRM provides them and this feature renders only the content area (`FeatureHeader` + the screens).
