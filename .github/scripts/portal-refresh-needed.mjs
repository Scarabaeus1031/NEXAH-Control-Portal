import { appendFileSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const event = process.env.PORTAL_REFRESH_EVENT || '';
const manifest = JSON.parse(readFileSync('portal-manifest.json', 'utf8'));
const roots = new Map([
  ['MISSION_CONTROL', '_sources/00 EXECUTIVE/NEXAH-Mission-Control'],
  ['B0_BUILDER_DECK', '_sources/10 NEXAH CORE/NEXAH'],
  ['A0_SCIENCE_DESK', '_sources/30 SCIENCE LAB/NEXAH-Science-Lab']
]);

const current = new Map(manifest.sources.map((source) => [source.id, source.revision]));
const revisions = [];
let changed = event !== 'schedule';

for (const [id, root] of roots) {
  const result = spawnSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Cannot read ${id} revision`);
  const revision = result.stdout.trim();
  revisions.push({ id, previous: current.get(id) || null, current: revision });
  if (current.get(id) !== revision) changed = true;
}

console.log(JSON.stringify({ event, needed: changed, revisions }, null, 2));
appendFileSync(process.env.GITHUB_OUTPUT, `needed=${changed ? 'true' : 'false'}\n`);
