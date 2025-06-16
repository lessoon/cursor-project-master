#!/usr/bin/env python3
"""
EvoPrompt-lite for Cursor:
• Mutates ONE random non-empty line in any rule file under .cursor/rules/
• Writes result to .cursor/rules/zzz-experimental.mdc
• Does NOT auto-commit or open PR (Cursor CI will pick it up).

Guard rails:
• Skips YAML front-matter (first fence) so we never corrupt headers.
• Only applies word-level synonyms or emphasis – no destructive edits.
"""

import random, re, shutil, itertools
from pathlib import Path

ROOT   = Path(__file__).resolve().parents[1]
RULES  = ROOT / ".cursor" / "rules"

def candidate_lines(path):
    """Return editable line numbers (ignores YAML header)."""
    lines = path.read_text().splitlines()
    # header ends at first empty line after '---'
    header_end = next((i for i,l in enumerate(lines[1:],1) if l.strip()=="---"), 0)
    return [i for i,l in enumerate(lines[header_end+1:], header_end+1) if l.strip()]

def mutate(line: str) -> str:
    # simple emphasiser: swap 'must' -> 'MUST', or add clarifying adverb
    swaps = {"must":"MUST", "should":"MUST", "ensure":"ALWAYS ensure"}
    for k,v in swaps.items():
        m = re.search(rf"\b{k}\b", line, flags=re.I)
        if m:
            return re.sub(rf"\b{k}\b", v, line, count=1, flags=re.I)
    # fall-back: append clarifier
    return line + "  <!-- refined -->"

def main():
    pick = random.choice(sorted(RULES.glob("[0-9][0-9][0-9]-*.md")))
    cand = candidate_lines(pick)
    if not cand:
        print("No editable lines found.")
        return
    idx  = random.choice(cand)
    lines = pick.read_text().splitlines()
    lines[idx] = mutate(lines[idx])

    out = RULES / "zzz-experimental.mdc"
    out.write_text("\n".join(lines))
    print(f"✓ Mutated {pick.name}:{idx+1} → {out.name}")

if __name__ == "__main__":
    main()