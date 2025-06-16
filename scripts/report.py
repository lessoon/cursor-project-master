#!/usr/bin/env python3
"""
Summarise project progress into project/PROGRESS_REPORT.md.

• Counts tasks in todo / in_progress / done.
• Calculates percent_complete (done / all) as an integer.
No timestamps – the Engine will overwrite the file each pass.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TASKS = ROOT / "project" / "tasks"

def count(pattern: str) -> int:
    return len(list((TASKS / pattern).glob("T*.md")))

todo       = count("todo")
in_prog    = count("in_progress")
done       = len(list(TASKS.rglob("done/**/T*.md")))
total      = todo + in_prog + done or 1  # avoid div-by-zero
percent    = f"{int(done / total * 100)}%"

report = ROOT / "project" / "PROGRESS_REPORT.md"
report.write_text(
f"""# Progress Report

| metric            | value |
|-------------------|------:|
| tasks_todo        | {todo} |
| tasks_in_progress | {in_prog} |
| tasks_done        | {done} |
| percent_complete  | {percent} |
"""
)

print("✓ PROGRESS_REPORT.md written")