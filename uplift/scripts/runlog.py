#!/usr/bin/env python3
"""Record pipeline timing so cycle time is measured, not estimated.

Appends one JSON line per event to output/run_log.jsonl, timestamped by the
system clock (UTC). /run-pipeline calls it around every stage.

  python3 scripts/runlog.py reset
  python3 scripts/runlog.py start research
  python3 scripts/runlog.py end research
  python3 scripts/runlog.py end gate --decision approve --raised 4 --accepted 3

Stages: research, prd, critic, gate, stories, backlog.
"""
import argparse, datetime, json, pathlib

LOG = pathlib.Path(__file__).resolve().parent.parent / "output" / "run_log.jsonl"
STAGES = ["research", "prd", "critic", "gate", "stories", "backlog"]

p = argparse.ArgumentParser()
p.add_argument("event", choices=["reset", "start", "end"])
p.add_argument("stage", nargs="?", choices=STAGES)
p.add_argument("--decision", choices=["approve", "edit", "reject"])
p.add_argument("--raised", type=int, help="critic issues raised")
p.add_argument("--accepted", type=int, help="critic fixes the human accepted")
a = p.parse_args()

LOG.parent.mkdir(exist_ok=True)
if a.event == "reset":
    LOG.write_text("", encoding="utf-8")
    print("run log cleared:", LOG)
    raise SystemExit
if not a.stage:
    p.error("start/end need a stage")

rec = {"t": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
       "event": a.event, "stage": a.stage}
for k in ("decision", "raised", "accepted"):
    if getattr(a, k) is not None:
        rec[k] = getattr(a, k)
with LOG.open("a", encoding="utf-8") as f:
    f.write(json.dumps(rec) + "\n")
print(json.dumps(rec))
