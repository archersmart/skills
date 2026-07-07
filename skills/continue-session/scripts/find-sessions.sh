#!/usr/bin/env bash
# Find Claude Code session JSONL files by session_id, session_name, or list recent ones.
# Usage:
#   find-sessions.sh [--last N]                          # list recent sessions
#   find-sessions.sh --id <session-id>                   # find by exact session ID
#   find-sessions.sh --name <keyword>                    # find by session name (substring match)
#   find-sessions.sh --project <path> [--last N]         # list sessions for a different project
#
# Output: aligned table with columns — Session ID, Name, Last Modified, Size

set -euo pipefail

PROJECT=""
LAST=20
SESSION_ID=""
SESSION_NAME=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project) PROJECT="$2"; shift 2 ;;
    --last) LAST="$2"; shift 2 ;;
    --id) SESSION_ID="$2"; shift 2 ;;
    --name) SESSION_NAME="$2"; shift 2 ;;
    *) shift ;;
  esac
done

# Determine project sessions directory
if [[ -n "$PROJECT" ]]; then
  PROJECT_DIR=$(echo "$PROJECT" | sed 's|/|-|g')
else
  PROJECT_DIR=$(pwd | sed 's|/|-|g')
fi

SESSIONS_DIR="$HOME/.claude/projects/$PROJECT_DIR"

if [[ ! -d "$SESSIONS_DIR" ]]; then
  echo "No sessions directory found: $SESSIONS_DIR" >&2
  exit 1
fi

# Python script that collects sessions and prints an aligned table
python3 -c "
import json, os, sys
from datetime import datetime

sessions_dir = '$SESSIONS_DIR'
session_name = '$SESSION_NAME' if '$SESSION_NAME' else None
session_id = '$SESSION_ID' if '$SESSION_ID' else None
last_n = $LAST

# Collect all matching sessions
results = []
for f in sorted(
    [os.path.join(sessions_dir, f) for f in os.listdir(sessions_dir) if f.endswith('.jsonl')],
    key=lambda x: os.path.getmtime(x),
    reverse=True
):
    sid = os.path.basename(f).replace('.jsonl', '')

    # If --id given, only match by prefix
    if session_id and not sid.startswith(session_id):
        continue

    # Extract title from ai-title message
    title = ''
    with open(f) as fh:
        for line in fh:
            line = line.strip()
            if not line: continue
            try:
                obj = json.loads(line)
                if obj.get('type') == 'ai-title':
                    title = obj.get('aiTitle', '')
                    break
            except: pass

    # Filter by name if provided
    if session_name and session_name.lower() not in title.lower():
        continue

    size = os.path.getsize(f)
    mtime = os.path.getmtime(f)
    date_str = datetime.fromtimestamp(mtime).strftime('%Y-%m-%d %H:%M')

    # Human-readable size
    if size >= 1024*1024:
        size_str = f'{size/(1024*1024):.1f}MB'
    elif size >= 1024:
        size_str = f'{size/1024:.0f}KB'
    else:
        size_str = f'{size}B'

    # Short session ID (first 8 chars)
    short_sid = sid[:8]

    results.append({
        'sid': sid,
        'short_sid': short_sid,
        'title': title if title else '(untitled)',
        'date': date_str,
        'size': size_str,
        'path': f,
    })

# If --id given, only keep first match
if session_id:
    results = results[:1]

# Limit results
results = results[:last_n]

if not results:
    if session_name:
        print(f'No sessions found matching \"{session_name}\"')
    elif session_id:
        print(f'Session not found: {session_id}')
    else:
        print('No sessions found.')
    sys.exit(0 if not session_id else 1)

# Helper: display width accounting for CJK fullwidth chars
import unicodedata
def disp_width(s):
    w = 0
    for ch in s:
        eaw = unicodedata.east_asian_width(ch)
        w += 2 if eaw in ('W', 'F') else 1
    return w

def pad_right(s, width):
    return s + ' ' * (width - disp_width(s))

def truncate(s, width):
    if disp_width(s) <= width:
        return s
    result = ''
    cur = 0
    for ch in s:
        eaw = unicodedata.east_asian_width(ch)
        cw = 2 if eaw in ('W', 'F') else 1
        if cur + cw > width - 3:
            break
        result += ch
        cur += cw
    return result + '...'

# Print aligned table
# Calculate column widths (in display columns)
id_w = max(disp_width(r['short_sid']) for r in results)
name_w = min(max(disp_width(r['title']) for r in results), 44)  # cap at 44 display cols
date_w = max(disp_width(r['date']) for r in results)
size_w = max(disp_width(r['size']) for r in results)

# Header
header = f\"{pad_right('ID', id_w)}  {pad_right('Name', name_w)}  {pad_right('Last Modified', date_w)}  {pad_right('Size', size_w)}\"
sep = f\"{'─'*id_w}  {'─'*name_w}  {'─'*date_w}  {'─'*size_w}\"
print(header)
print(sep)

# Rows
for r in results:
    title = truncate(r['title'], name_w)
    print(f\"{pad_right(r['short_sid'], id_w)}  {pad_right(title, name_w)}  {pad_right(r['date'], date_w)}  {pad_right(r['size'], size_w)}\")

print()

# If only one result (e.g. --id match), also print the full path
if len(results) == 1:
    print(f'Full path: {results[0][\"path\"]}')
    print(f'Full ID:   {results[0][\"sid\"]}')
" 2>/dev/null
