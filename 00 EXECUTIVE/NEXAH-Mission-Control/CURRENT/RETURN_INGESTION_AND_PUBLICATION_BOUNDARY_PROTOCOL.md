# Mission Control Return Ingestion and Publication Boundary Protocol

Status: `HUMAN_OWNER_DIRECTIVE / CONTROLLING LOCAL OPERATING PROTOCOL`

Date: `2026-10-26`

Last clarification: `2026-10-30` · explicit Desk-to-NSNavigator return
binding; no authority transfer or Source Graph vocabulary change

## Scope and controlled vocabulary

This protocol controls accepted returns, public-surface candidates, staging,
commit, push, deployment, publication and the return of verified live state.
The operational cold start and authority matrix are maintained in
[`../MISSION_CONTROL_ENTRYPOINT.md`](../MISSION_CONTROL_ENTRYPOINT.md). This
document supplies the detailed release workflow and must not be read as a
transfer of scientific, source, implementation or Human Owner authority.

The word `owner` must always be qualified:

| Term | Controlled meaning |
|---|---|
| `Human Owner` | final decision, acceptance, adoption, publication and STOP |
| `Study Owner` | named responsibility for one admitted Study under the Science Lab Constitution |
| `source authority` | record or repository that controls the content, evidence or contract |
| `implementation authority` | canonical repository that controls editable code or website source |
| `release authority` | Human Owner decision routed and recorded through Mission Control |
| `A0 Owner Control Plane` | review and acceptance frame; not a person, source owner or second repository |

Mission Control is the operational Owner interface, not the owner of scientific
truth, source content or channel implementation. A0 is the Owner frame, not a
replacement for Mission Control, the Science Lab, Builder Desk or the public
channel repositories.

Within this protocol, authority order is:

1. the applicable constitution and adopted Human Owner decisions within their
   declared scopes; a conflict remains stopped until the formal amendment path
   is complete;
2. canonical source contract and repository policy;
3. Mission Control entrypoint and this protocol;
4. role-specific Desk and channel policies;
5. generated projections, staging copies and readable summaries.

If a generated projection, staging copy, build artifact or live surface
differs from its controlling source, stop with `VERSION_AMBIGUOUS`. Do not
repair the derived copy by hand.

## Invariants

1. The Scarabäus mark and any link explicitly presented as “Scarabäus” always
   resolve to `https://www.scarabaeus1033.net`.
2. A Scarabäus brand link is never replaced by a Science Desk, Mission Control
   or GitHub destination. Repository links may exist only when they are clearly
   labelled as source/repository links and separately authorized for release.
3. Science Desks and Mission Control are internal operating surfaces. They are
   not public brand-navigation targets and are not pushed or deployed merely
   because a source return has been accepted. A Human-Owner-authorized,
   read-only Web projection may publish an allowlisted snapshot of Mission
   Control, the A0 Science Desk and the B0 Builder Deck. That projection is a
   reading surface only: it cannot write to source repositories, change
   currentness, activate research, alter evidence or authorize a release.
4. Mission Control is maintained locally. Accepting a material return triggers
   the local currentness reconciliation below without requiring the Human Owner
   to coordinate individual Desks.
5. Local reconciliation never implies GitHub push, public deployment,
   publication, outreach or a change of scientific authority. Each remains a
   separate Human Owner gate.

## Automatic local reconciliation on accepted return

When Mission Control accepts a material return, the handling task must, within
the same closeout:

1. preserve the owning source and its authority;
2. update the applicable current return and `CURRENT/CONTROLLING_SOURCES.csv`;
3. update `CURRENT/PORTFOLIO_TRUTH.json` only when the big-picture truth changed;
4. rebuild affected local Navigator projections and the internal catalog;
5. rebuild transparency indexes and `CURRENT/MANIFEST_SHA256.txt`;
6. run `python3 -B CURRENT/validate_currentness.py` and stop on any mismatch;
7. perform the Owner Editorial materiality check below;
8. report the local synchronization separately from any external release.

### Owner Editorial materiality check

The Owner Editorial is a living Mission Control projection, not a parallel
source of truth. Every accepted material Science Desk or Builder Desk return
must be checked in the same closeout for whether it changes at least one of:

- a visible milestone or achieved state;
- a demonstrated capability or explicit non-capability;
- the current scientific or Builder boundary;
- a retained opportunity, integration edge or moonshot condition;
- an active, parked, closed or hold disposition;
- the exact next Human Owner decision.

If one of these changes, update the Owner Editorial from the controlling Desk
source and preserve the link back to that source. If none changes, record no
editorial delta and do not add narrative noise. An editorial update never
promotes evidence, activates an opportunity, opens a build or authorizes
publication or outreach. Vision and moonshot language remains conditional
until its own evidence and Owner gates pass.

For Navigator-connected returns, the Science Lab Source Graph remains the
source authority and the Navigator governance workflow must also pass. This
protocol creates no identity, relation, Study, claim or publication state.

### Desk-to-NSNavigator return binding

Every material Science Desk or Builder Desk return must make its NSNavigator
disposition explicit. The closeout records:

1. the reused stable Navigator identity or binder, or a concrete reason the
   return does not affect the Source Graph;
2. the canonical source path, Desk receipt and affected binder, component
   index or Mission Control projection paths;
3. whether the return only references an existing object, changes only source
   hashes/currentness, or proposes a semantic identity or relation change;
4. the node, relation and alias counts before and after, including an explicit
   zero when they are unchanged;
5. the exact binder, Source Graph, application and currentness validators that
   apply, with their outcomes;
6. unresolved duplicate, authority, evidence or publication risks.

These are operational return fields, not new canonical Source Graph
vocabulary. Builder Desk may report and route an NSNavigator delta but may not
create an identity or typed relation by implication. Science Desk classifies
the evidence and claim boundary; Navigator governance admits graph changes;
Mission Control records the validated currentness result. Navigation
placement, a demonstrator, a GLB connection or a working link alone creates no
identity or relation.

## Release boundary

```text
SOURCE RETURN
  -> LOCAL MISSION CONTROL RECONCILIATION
  -> VALIDATED CURRENTNESS
  -> STOP

OPTIONAL EXTERNAL PUSH / DEPLOYMENT / PUBLICATION
  -> SEPARATE HUMAN OWNER AUTHORIZATION
```

The default after a successful return is therefore a current local Mission
Control, not a GitHub update.

## Website source, commit and push policy

Website work uses one control path and one editable master per public channel:

| Channel | Canonical editable source | Role |
|---|---|---|
| `nexah.de` | public Science sources: `30 SCIENCE LAB/NEXAH-Science-Lab/.../A0_BOOK`; delivery shell, Library and legal routes: `40 EXPERIENCE PRODUCTION/NEXAH-Experience` | leading public NEXAH Science and orientation surface; source-bound method, released research, papers, instruments, Library and open questions |
| A0 | `30 SCIENCE LAB/NEXAH-Science-Lab/.../A0_BOOK` | integrated Owner acceptance view and A0 question/work engine containing the book, contracts, instruments and source-bound records |
| `nexahedron.com` | `40 EXPERIENCE PRODUCTION/NEXAHEDRON` | A0 Human View and playable public experience |
| `www.scarabaeus1033.net` | `70 SCARABAEUS1033 WORKBENCH/Scarabaeus-1033` | independent workshop, works, Builder and Rödelheim window |

A0 is the Human Owner's integrated view of the current NEXAH field and the
working engine in which questions, research, building, instruments and staged
external views are brought together for acceptance. `Engine` names this
operational and curatorial role; it does not create a universal Runtime or
transfer source or scientific authority. A0 may preview or connect the other
public houses, but it is not their editable website master. B0 may route
website tasks, reuse components and classify old pages; it records the owning
path instead of copying a page into a second live source tree.

For `nexah.de`, Human, Science and Builder are functions of the public research
story, not merely outbound destinations. The primary reader routes are
`Orientieren`, `Forschen`, `Lesen & erkunden` and `Anwenden & erleben`.
NEXAHEDRON and Scarabæus retain distinct repositories, domains and authority,
but may be featured inside the appropriate route.

Science-Desk HTMLs enter the public surface only through an exact manifest
that records source identity, owning path, evidence state, publication state,
claim ceiling, rights/privacy disposition, public route and generated target.
File presence, internal navigation placement or successful local rendering is
not public admission. The public home remains curated; the complete admitted
corpus belongs in the section hubs and `Navigation+`, not in repeated parallel
home-page link grids.

### A0 Owner Control Plane

For website and public-surface work, A0 is the **single internal Owner review,
staging and acceptance frame**. This is a control-plane rule, not a transfer of
source authority:

- the public channel's owning repository remains the only editable master;
- A0 embeds or projects that source for Owner review and Desk context;
- Science Desk, Builder Desk and Mission Control may appear inside the internal
  A0 frame according to their existing authority, but never become public
  navigation merely through that placement;
- a page is Owner-approved only when the exact candidate revision is shown in
  the A0 frame with its source and release state visible;
- every deployment returns its commit, deployment revision, live URL and smoke
  result to the same A0 frame.

Standalone browser pages, ad-hoc preview hosts and temporary local servers are
diagnostic tools only. They are not parallel Owner views, accepted staging
surfaces or deployable masters. Do not create a new standalone website draft
when the candidate can be rendered in the A0 frame. A historical standalone
instrument may remain in its owning package, but it must be linked or embedded
from A0 and may not silently become a website master.

The A0 frame must identify, for every website candidate:

1. public channel and production URL;
2. canonical repository and source path;
3. branch and exact commit or explicit uncommitted state;
4. preview kind: `OWNER_STAGING`, `GENERATED_PROJECTION` or `LIVE`;
5. Owner acceptance state and timestamp;
6. deployment target, deployed revision and live verification state;
7. return links to the responsible Science, Builder and Mission Control
   records where applicable.

If any of these values is missing or if the A0 candidate differs from the
source tree, build artifact or live channel, the release is `STOP / VERSION
AMBIGUOUS`. The mismatch is resolved before further design edits.

```text
CANONICAL SOURCE REPOSITORY
  -> BUILD OR SOURCE-BOUND PROJECTION
  -> A0 OWNER STAGING FRAME
  -> HUMAN OWNER ACCEPTANCE
  -> COMMIT
  -> PUSH
  -> ONE DECLARED PRODUCTION DEPLOYMENT
  -> LIVE SMOKE CHECK
  -> A0 RELEASE RECEIPT
```

There is no direct path from an unframed standalone preview to production.
There is no second editable copy inside A0. “One version” means one canonical
source revision, one identified A0 projection of that revision and one
deployment receipt—not that all website source files physically live in A0.

Mission Control remains the Human Owner's strategy, currentness and release
interface. Builder Desk / B0 owns strategy-to-build routing. Science Lab owns
scientific evidence and lifecycle, with the A0 Science Desk as the research
work and return surface inside A0. Workbenches are shared research/build
objects. NEXAHEDRON is the `nexahedron.com` Human View; the public websites are
bounded outward channels, not peers competing with A0.

Every website change follows this order:

1. identify the public channel and its canonical repository before editing;
2. search that repository and B0 for an existing page, component, redirect or
   historical predecessor;
3. edit only the canonical source; never hand-edit a generated projection;
4. render or refresh the candidate inside the A0 Owner frame; do not present a
   standalone tab or temporary host as the acceptance surface;
5. expose the source revision, dirty state, preview class and intended
   deployment target in that frame;
6. classify a displaced page as `CURRENT`, `SUPERSEDED`, `ARCHIVED`,
   `REDIRECT` or `GENERATED_PROJECTION`, and point it to its successor/source;
7. inspect the exact repository diff and stage only reviewed paths; never use
   broad staging across the ecosystem or absorb unrelated thread changes;
8. run the owning repository's tests, build and applicable browser checks;
9. obtain Human Owner acceptance against the exact A0-framed candidate;
10. when A0 feeds another repository, commit the canonical A0 source first,
   generate the downstream bundle through its declared sync command, verify
   its manifest, and commit that projection separately in the consumer repo;
11. create one coherent commit per owning repository and report its branch,
   commit SHA, included paths, tests and remaining limits;
12. push only after explicit Human Owner authorization and only to the verified
   remote/branch; a missing or ambiguous remote is a STOP;
13. deploy only the accepted revision to the channel's one declared production
    target; staging hosts remain staging and are never substituted silently;
14. after deployment, record the source commit, deployed revision, URL,
    rollback point and live smoke result in the A0 frame and Mission Control.

`commit`, `push`, `deployment` and `publication` are therefore four distinct
states. A successful local build establishes none of the later three. A push
does not establish that the corresponding public URL is current.

## Read-only Owner Portal projection

The Owner may authorize preparation of a public-readable snapshot even when
the source repository remains private. Repository visibility and Web-surface
visibility are separate controls.

The projection uses this sequence:

```text
OWNING SOURCES
  -> EXPLICIT ALLOWLIST
  -> LOCAL STAGING BUILD
  -> HASH / LINK / SECRET / BRAND AUDIT
  -> STOP

HUMAN OWNER RELEASE AUTHORIZATION
  -> PROMOTE STAGING TO VERSIONED RELEASE
  -> MANUAL DEPLOY WORKFLOW
  -> LIVE SMOKE CHECK
  -> RETURN RECEIPT TO MISSION CONTROL
```

Required boundaries:

1. the first release is static and read-only;
2. no browser action may write to Mission Control, the Science Lab, B0 or a
   connected repository;
3. the portal visibly identifies itself as a snapshot and records source
   repository, revision, entry hash and build time;
4. local absolute paths are removed or replaced by neutral source markers;
5. secrets and credentials are excluded and audited before promotion;
6. Scarabäus brand links resolve exactly to
   `https://www.scarabaeus1033.net`;
7. GitHub repository links are labelled as source links and do not replace the
   Scarabäus brand return;
8. `staging` is never deployable; only an explicitly promoted `release`
   directory may enter the manual deployment workflow;
9. a push does not imply deployment; the deployment workflow is manual only;
10. the hosted snapshot has no scientific, Builder, Mission Control or release
    authority. Authority remains with the owning sources.

The implementation lives in `OWNER_READ_PORTAL/`. Preparation of that local
projection does not by itself authorize promotion, push or deployment.
