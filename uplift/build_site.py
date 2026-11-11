#!/usr/bin/env python3
"""Build uplift/index.html from the project files, so the page always shows the real skills, interviews and outputs."""
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent

def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")

interviews = [
    {"file": p.name, "text": p.read_text(encoding="utf-8")}
    for p in sorted((ROOT / "data" / "interviews").glob("*.md"))
]
system = [
    {"label": "CLAUDE.md", "kind": "Team context", "path": "CLAUDE.md"},
    {"label": "research-synthesis", "kind": "Skill", "path": ".claude/skills/research-synthesis/SKILL.md"},
    {"label": "prd-writer", "kind": "Skill", "path": ".claude/skills/prd-writer/SKILL.md"},
    {"label": "prd-critic", "kind": "Subagent", "path": ".claude/agents/prd-critic.md"},
    {"label": "story-writer", "kind": "Skill", "path": ".claude/skills/story-writer/SKILL.md"},
    {"label": "backlog-prioritizer", "kind": "Skill", "path": ".claude/skills/backlog-prioritizer/SKILL.md"},
    {"label": "/run-pipeline", "kind": "Command", "path": ".claude/commands/run-pipeline.md"},
]
for s in system:
    s["text"] = read(s["path"])
outputs = [
    {"label": "01 Research", "path": "output/01_research_synthesis.md"},
    {"label": "02 PRD", "path": "output/02_prd.md"},
    {"label": "03 Critic review", "path": "output/03_prd_review.md"},
    {"label": "04 Stories", "path": "output/04_user_stories.md"},
    {"label": "05 Backlog", "path": "output/05_backlog.md"},
]
for o in outputs:
    o["text"] = read(o["path"])

data = json.dumps({"interviews": interviews, "system": system, "outputs": outputs}).replace("</", "<\\/")
html = (ROOT / "template.html").read_text(encoding="utf-8").replace("/*__DATA__*/null", data)
(ROOT / "index.html").write_text(html, encoding="utf-8")
print("wrote", ROOT / "index.html", len(html), "bytes")
