#!/usr/bin/env python3
"""
Relay Bridge for Visual AI <-> Cursor workflow.

Important:
- This bridge automates message relay via repository files.
- It cannot directly type into Cursor/VS chat UIs by itself.
- Use this for asynchronous "no manual copy/paste" coordination.
"""

from __future__ import annotations

import json
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Any


ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "RELAY_CONFIG.json"
STATE_PATH = ROOT / ".relay_state.json"


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def load_json(path: Path, fallback: Any) -> Any:
    if not path.exists():
        return fallback
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, payload: Any) -> None:
    ensure_parent(path)
    path.write_text(json.dumps(payload, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")


def read_jsonl(path: Path) -> List[Dict[str, Any]]:
    if not path.exists():
        return []
    rows: List[Dict[str, Any]] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            rows.append(json.loads(line))
        except Exception:
            rows.append({"raw": line, "invalid": True})
    return rows


def append_jsonl(path: Path, payload: Dict[str, Any]) -> None:
    ensure_parent(path)
    with path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(payload, ensure_ascii=True) + "\n")


def append_audit(audit_path: Path, text: str) -> None:
    ensure_parent(audit_path)
    with audit_path.open("a", encoding="utf-8") as fh:
        fh.write(f"[{now_iso()}] {text}\n")


def build_auto_ack(src_msg: Dict[str, Any], prefix: str) -> Dict[str, Any]:
    return {
        "id": f"ack-{src_msg.get('id', 'unknown')}",
        "timestamp": now_iso(),
        "from": "relay-bridge",
        "to": src_msg.get("from", "unknown"),
        "type": "ack",
        "content": f"{prefix} Received message '{src_msg.get('id', 'unknown')}' and queued for processing.",
        "relates_to": src_msg.get("id"),
    }


def process_cycle(config: Dict[str, Any], state: Dict[str, Any]) -> Dict[str, Any]:
    paths = config["paths"]
    rules = config["rules"]
    max_messages = int(config.get("max_messages_per_cycle", 20))

    vs_to_cursor_path = ROOT / paths["vs_to_cursor"]
    cursor_to_vs_path = ROOT / paths["cursor_to_vs"]
    audit_path = ROOT / paths["audit_log"]

    all_vs_msgs = read_jsonl(vs_to_cursor_path)
    seen_ids = set(state.get("seen_vs_ids", []))
    new_vs_msgs = [m for m in all_vs_msgs if m.get("id") not in seen_ids][:max_messages]

    for msg in new_vs_msgs:
        msg_id = msg.get("id", f"noid-{int(time.time())}")
        append_audit(audit_path, f"Queued Visual->Cursor message id={msg_id}")
        seen_ids.add(msg_id)

        if rules.get("allow_auto_ack", True):
            ack = build_auto_ack(msg, rules.get("prefix_cursor_to_visual", "[CURSOR->VISUAL]"))
            append_jsonl(cursor_to_vs_path, ack)
            append_audit(audit_path, f"Generated ACK for id={msg_id}")

    state["seen_vs_ids"] = list(seen_ids)[-5000:]
    state["last_cycle_at"] = now_iso()
    return state


def main() -> None:
    config = load_json(
        CONFIG_PATH,
        {
            "poll_seconds": 30,
            "max_messages_per_cycle": 20,
            "paths": {
                "vs_to_cursor": "relay/vs_to_cursor.jsonl",
                "cursor_to_vs": "relay/cursor_to_vs.jsonl",
                "audit_log": "relay/runtime/relay_audit.log",
            },
            "rules": {
                "allow_auto_ack": True,
                "prefix_visual_to_cursor": "[VISUAL->CURSOR]",
                "prefix_cursor_to_visual": "[CURSOR->VISUAL]",
            },
        },
    )
    state = load_json(STATE_PATH, {"seen_vs_ids": [], "created_at": now_iso()})

    poll_seconds = max(5, int(config.get("poll_seconds", 30)))
    print(f"[relay] started, poll_seconds={poll_seconds}")

    while True:
        try:
            state = process_cycle(config, state)
            save_json(STATE_PATH, state)
            print(f"[relay] cycle ok @ {state.get('last_cycle_at')}")
        except Exception as exc:
            audit_path = ROOT / config["paths"]["audit_log"]
            append_audit(audit_path, f"ERROR: {str(exc)}")
            print(f"[relay] warning: {exc}")
        time.sleep(poll_seconds)


if __name__ == "__main__":
    main()

