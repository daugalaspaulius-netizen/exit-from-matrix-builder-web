#!/usr/bin/env python3
"""
AI Orchestrator for Exit From Matrix collaboration runtime.

Purpose:
- Poll GitHub every 30 seconds (configurable)
- Detect new PRs / status changes
- Detect TODO-style commands in PR comments
- Write handoff events to AI_HANDOFF_LOG.md
- Keep AI_TASK_BOARD.json updated with lightweight status sync
"""

from __future__ import annotations

import json
import subprocess
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional


ROOT = Path(__file__).resolve().parent.parent
TASK_BOARD_PATH = ROOT / "AI_TASK_BOARD.json"
HANDOFF_LOG_PATH = ROOT / "AI_HANDOFF_LOG.md"
STATE_PATH = ROOT / ".ai_orchestrator_state.json"


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def run_gh_json(args: List[str]) -> Any:
    cmd = ["gh"] + args
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=ROOT)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "Unknown gh error")
    stdout = result.stdout.strip()
    if not stdout:
        return None
    return json.loads(stdout)


def load_json(path: Path, fallback: Any) -> Any:
    if not path.exists():
        return fallback
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")


def append_handoff(title: str, lines: List[str]) -> None:
    if not HANDOFF_LOG_PATH.exists():
        HANDOFF_LOG_PATH.write_text("# AI Handoff Log\n\n", encoding="utf-8")
    stamp = utc_now_iso()
    chunk = [f"### {title} ({stamp})"]
    chunk.extend([f"- {line}" for line in lines])
    chunk.append("")
    with HANDOFF_LOG_PATH.open("a", encoding="utf-8") as fh:
        fh.write("\n".join(chunk))


@dataclass
class Config:
    repo: str
    interval_seconds: int = 30
    max_prs: int = 30
    dry_run: bool = False


def load_config() -> Config:
    cfg_path = ROOT / "ORCHESTRATOR_CONFIG.json"
    raw = load_json(
        cfg_path,
        {
            "repo": "daugalaspaulius-netizen/exit-from-matrix-builder-web",
            "interval_seconds": 30,
            "max_prs": 30,
            "dry_run": False,
        },
    )
    return Config(
        repo=raw.get("repo", "daugalaspaulius-netizen/exit-from-matrix-builder-web"),
        interval_seconds=int(raw.get("interval_seconds", 30)),
        max_prs=int(raw.get("max_prs", 30)),
        dry_run=bool(raw.get("dry_run", False)),
    )


def fetch_prs(repo: str, limit: int) -> List[Dict[str, Any]]:
    return run_gh_json(
        [
            "pr",
            "list",
            "--repo",
            repo,
            "--limit",
            str(limit),
            "--state",
            "all",
            "--json",
            "number,title,state,headRefName,baseRefName,updatedAt,author,url",
        ]
    )


def fetch_issue_comments(repo: str, pr_number: int) -> List[Dict[str, Any]]:
    return run_gh_json(
        [
            "api",
            f"repos/{repo}/issues/{pr_number}/comments",
        ]
    ) or []


def maybe_update_task_board(prs: List[Dict[str, Any]], dry_run: bool = False) -> None:
    board = load_json(TASK_BOARD_PATH, {"version": 1, "updated_at": utc_now_iso(), "tasks": []})
    tasks = board.get("tasks", [])
    branch_to_task = {task.get("branch"): task for task in tasks if task.get("branch")}

    changed = False
    for pr in prs:
        branch = pr.get("headRefName")
        state = pr.get("state", "").lower()
        task = branch_to_task.get(branch)
        if not task:
            continue
        target = task.get("status")
        if state == "open" and target in {"pending"}:
            task["status"] = "in_progress"
            task["notes"] = f"{task.get('notes', '')} | PR #{pr.get('number')} opened".strip(" |")
            changed = True
        elif state == "merged" and target != "done":
            task["status"] = "done"
            task["notes"] = f"{task.get('notes', '')} | PR #{pr.get('number')} merged".strip(" |")
            changed = True
        elif state == "closed" and target not in {"done", "cancelled"}:
            task["status"] = "review"
            task["notes"] = f"{task.get('notes', '')} | PR #{pr.get('number')} closed without merge".strip(" |")
            changed = True

    if changed:
        board["updated_at"] = utc_now_iso()
        if not dry_run:
            save_json(TASK_BOARD_PATH, board)


def process_comment_commands(
    repo: str,
    prs: List[Dict[str, Any]],
    state: Dict[str, Any],
    dry_run: bool = False,
) -> None:
    seen_comments = set(state.get("seen_comment_ids", []))

    for pr in prs:
        pr_number = pr.get("number")
        comments = fetch_issue_comments(repo, pr_number)
        for comment in comments:
            cid = comment.get("id")
            if cid in seen_comments:
                continue
            body = (comment.get("body") or "").strip()
            user = (comment.get("user") or {}).get("login", "unknown")
            created_at = comment.get("created_at", "")
            lower = body.lower()

            # Minimal command grammar for asynchronous handoffs.
            # /handoff <message>
            # /blocked <message>
            # /task <message>
            if lower.startswith("/handoff"):
                payload = body[len("/handoff") :].strip() or "(no details)"
                append_handoff(
                    f"Handoff from @{user} on PR #{pr_number}",
                    [
                        f"PR: {pr.get('url')}",
                        f"Time: {created_at}",
                        f"Message: {payload}",
                    ],
                )
            elif lower.startswith("/blocked"):
                payload = body[len("/blocked") :].strip() or "(no details)"
                append_handoff(
                    f"Blocked signal from @{user} on PR #{pr_number}",
                    [
                        f"PR: {pr.get('url')}",
                        f"Time: {created_at}",
                        f"Blocker: {payload}",
                    ],
                )
            elif lower.startswith("/task"):
                payload = body[len("/task") :].strip() or "(no details)"
                append_handoff(
                    f"Task request from @{user} on PR #{pr_number}",
                    [
                        f"PR: {pr.get('url')}",
                        f"Time: {created_at}",
                        f"Task: {payload}",
                    ],
                )

            seen_comments.add(cid)

    state["seen_comment_ids"] = list(seen_comments)[-2000:]
    if not dry_run:
        save_json(STATE_PATH, state)


def process_pr_events(prs: List[Dict[str, Any]], state: Dict[str, Any], dry_run: bool = False) -> None:
    known = state.get("prs", {})
    for pr in prs:
        num = str(pr.get("number"))
        prev = known.get(num)
        current = {
            "state": pr.get("state"),
            "updatedAt": pr.get("updatedAt"),
            "headRefName": pr.get("headRefName"),
        }
        if prev is None:
            append_handoff(
                f"New PR detected #{num}",
                [
                    f"Title: {pr.get('title')}",
                    f"Author: {(pr.get('author') or {}).get('login', 'unknown')}",
                    f"Branch: {pr.get('headRefName')} -> {pr.get('baseRefName')}",
                    f"URL: {pr.get('url')}",
                ],
            )
        elif prev.get("state") != current.get("state"):
            append_handoff(
                f"PR state changed #{num}",
                [
                    f"Title: {pr.get('title')}",
                    f"{prev.get('state')} -> {current.get('state')}",
                    f"URL: {pr.get('url')}",
                ],
            )
        known[num] = current

    state["prs"] = known
    if not dry_run:
        save_json(STATE_PATH, state)


def ensure_state_file() -> Dict[str, Any]:
    state = load_json(STATE_PATH, {"created_at": utc_now_iso(), "prs": {}, "seen_comment_ids": []})
    if not STATE_PATH.exists():
        save_json(STATE_PATH, state)
    return state


def main() -> None:
    config = load_config()
    print(f"[orchestrator] repo={config.repo} interval={config.interval_seconds}s dry_run={config.dry_run}")
    state = ensure_state_file()

    while True:
        try:
            prs = fetch_prs(config.repo, config.max_prs)
            process_pr_events(prs, state, dry_run=config.dry_run)
            maybe_update_task_board(prs, dry_run=config.dry_run)
            process_comment_commands(config.repo, prs, state, dry_run=config.dry_run)
            print(f"[{utc_now_iso()}] checked {len(prs)} PRs")
        except Exception as exc:
            append_handoff(
                "Orchestrator runtime warning",
                [f"Error: {str(exc)}"],
            )
            print(f"[orchestrator] warning: {exc}")
        time.sleep(max(5, config.interval_seconds))


if __name__ == "__main__":
    main()

