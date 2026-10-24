# Mission Control Return Ingestion and Publication Boundary Protocol

Status: `HUMAN_OWNER_DIRECTIVE / CONTROLLING LOCAL OPERATING PROTOCOL`

Date: `2026-10-23`

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
7. report the local synchronization separately from any external release.

For Navigator-connected returns, the Science Lab Source Graph remains the
source authority and the Navigator governance workflow must also pass. This
protocol creates no identity, relation, Study, claim or publication state.

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
