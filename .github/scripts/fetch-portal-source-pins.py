"""Make the Git objects required by Mission Control's currentness check available."""

import csv
import json
import re
import subprocess
import sys
from pathlib import Path


def git(repo: Path, *args: str, **kwargs) -> subprocess.CompletedProcess:
    return subprocess.run(["git", "-C", str(repo), *args], **kwargs)


def main() -> None:
    sources = Path(sys.argv[1]).resolve()
    mission_control = sources / "00 EXECUTIVE/NEXAH-Mission-Control"
    current = mission_control / "CURRENT"
    pins = json.loads((current / "CONTROLLING_SOURCE_GIT_PINS.json").read_text())["commits"]
    with (current / "CONTROLLING_SOURCES.csv").open(newline="", encoding="utf-8") as handle:
        source_paths = {row["source_id"]: row["path"] for row in csv.DictReader(handle)}

    revisions = set()
    for source_id, revision in pins.items():
        if not re.fullmatch(r"[0-9a-f]{40}", revision):
            raise ValueError(f"Invalid Git revision for {source_id}: {revision}")
        path = (mission_control / source_paths[source_id]).resolve()
        if not path.is_relative_to(sources) or not path.is_file():
            raise ValueError(f"Pinned source is missing from the checkout: {source_id} ({path})")
        result = git(path.parent, "rev-parse", "--show-toplevel", check=True, capture_output=True, text=True)
        repo = Path(result.stdout.strip()).resolve()
        if not repo.is_relative_to(sources) or repo == sources:
            raise ValueError(f"Pinned source is outside a source repository: {source_id}")
        revisions.add((repo, revision))

    for repo, revision in sorted(revisions):
        exists = git(repo, "cat-file", "-e", f"{revision}^{{commit}}", capture_output=True)
        if exists.returncode != 0:
            print(f"Fetching {repo.relative_to(sources)} at {revision}", flush=True)
            git(repo, "fetch", "--no-tags", "--depth=1", "--filter=blob:none", "origin", revision, check=True)
        git(repo, "cat-file", "-e", f"{revision}^{{commit}}", check=True)

    print(f"{len(revisions)} pinned Git revisions available.")


if __name__ == "__main__":
    main()
