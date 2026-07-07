#!/usr/bin/env node
/**
 * Extract a readable conversation transcript from a Claude Code session JSONL file.
 * Usage:
 *   node extract-session.js <session-jsonl-path> [--last N] [--compact] [--full]
 *   node extract-session.js --id <session-id> [--last N] [--compact]
 *   node extract-session.js --name <keyword> [--last N] [--compact]
 *
 * Flags:
 *   --id <sid>   Find session by session ID (prefix match supported)
 *   --name <kw>  Find session by name/title (substring match)
 *   --last N     Only extract the last N user-assistant exchange pairs
 *   --compact    Trim tool results, skip file-history-snapshot/attachment/system messages
 *   --full       Include full tool results (default is trimmed)
 *
 * Output: Markdown-formatted conversation to stdout
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Parse args
const args = process.argv.slice(2);
let jsonlPath = '';
let sessionId = '';
let sessionName = '';

const flagsWithValues = ['--id', '--name', '--last'];
for (let i = 0; i < args.length; i++) {
  if (flagsWithValues.includes(args[i]) && args[i + 1]) {
    if (args[i] === '--id') sessionId = args[++i];
    else if (args[i] === '--name') sessionName = args[++i];
    else if (args[i] === '--last') i++; // skip value, parsed below
  } else if (!args[i].startsWith('--')) {
    jsonlPath = args[i];
  }
}
const lastN = parseInt(args[args.indexOf('--last') + 1]) || 0;
const compact = args.includes('--compact');
const full = args.includes('--full');

// Resolve session by ID or name if no direct path given
if (!jsonlPath) {
  if (sessionId || sessionName) {
    jsonlPath = resolveSession(sessionId, sessionName);
  } else {
    console.error('Usage: node extract-session.js <path> | --id <sid> | --name <keyword> [--last N] [--compact] [--full]');
    process.exit(1);
  }
}

// Resolve path (support ~)
const resolvedPath = jsonlPath.replace('~', os.homedir());

if (!fs.existsSync(resolvedPath)) {
  console.error(`File not found: ${resolvedPath}`);
  process.exit(1);
}

// Parse JSONL
const lines = fs.readFileSync(resolvedPath, 'utf-8').split('\n').filter(Boolean);
const records = [];
for (const line of lines) {
  try { records.push(JSON.parse(line)); } catch {}
}

// Extract session title
let sessionTitle = '';
for (const r of records) {
  if (r.type === 'ai-title' && r.aiTitle) {
    sessionTitle = r.aiTitle;
    break;
  }
}

// Extract conversation messages
const messages = records.filter(r => r.type === 'user' || r.type === 'assistant');

// Build exchange pairs (user -> assistant)
const exchanges = [];
let currentExchange = null;

for (const msg of messages) {
  if (msg.type === 'user') {
    if (isOnlyToolResult(msg.message)) continue;
    currentExchange = { user: extractContent(msg.message), assistant: null, timestamp: msg.timestamp };
    exchanges.push(currentExchange);
  } else if (msg.type === 'assistant' && currentExchange) {
    currentExchange.assistant = extractContent(msg.message);
    currentExchange = null;
  } else if (msg.type === 'assistant' && !currentExchange) {
    exchanges.push({ user: null, assistant: extractContent(msg.message), timestamp: msg.timestamp });
  }
}

// Apply --last filter
const selected = lastN > 0 ? exchanges.slice(-lastN) : exchanges;

// Format output
let output = '';
output += `# Session Transcript\n`;
if (sessionTitle) output += `Title: ${sessionTitle}\n`;
output += `Source: ${resolvedPath}\n`;
output += `Total exchanges: ${exchanges.length}${lastN ? ` (showing last ${selected.length})` : ''}\n`;
output += `Generated: ${new Date().toISOString()}\n\n`;

for (const ex of selected) {
  if (ex.user) {
    output += `## 👤 User\n\n${trimContent(ex.user, compact ? 500 : 2000)}\n\n`;
  }
  if (ex.assistant) {
    output += `## 🤖 Assistant\n\n${trimContent(ex.assistant, compact ? 800 : 4000)}\n\n`;
  }
  output += '---\n\n';
}

console.log(output);

// --- Helper: resolve session by ID or name ---

function resolveSession(sid, name) {
  const cwd = process.cwd().replace(/\//g, '-');
  const sessionsDir = path.join(os.homedir(), '.claude', 'projects', cwd);

  if (!fs.existsSync(sessionsDir)) {
    console.error(`Sessions directory not found: ${sessionsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(sessionsDir)
    .filter(f => f.endsWith('.jsonl'))
    .map(f => ({ file: f, path: path.join(sessionsDir, f), mtime: fs.statSync(path.join(sessionsDir, f)).mtime }))
    .sort((a, b) => b.mtime - a.mtime);

  // Match by session ID (prefix match)
  if (sid) {
    const match = files.find(f => f.file.startsWith(sid));
    if (match) return match.path;
    console.error(`Session not found with ID: ${sid}`);
    process.exit(1);
  }

  // Match by name (substring, case-insensitive)
  if (name) {
    for (const f of files) {
      const content = fs.readFileSync(f.path, 'utf-8');
      for (const line of content.split('\n')) {
        if (!line.trim()) continue;
        try {
          const obj = JSON.parse(line);
          if (obj.type === 'ai-title' && obj.aiTitle && obj.aiTitle.toLowerCase().includes(name.toLowerCase())) {
            return f.path;
          }
        } catch {}
      }
    }
    console.error(`Session not found with name: ${name}`);
    process.exit(1);
  }

  return '';
}

// --- Helper: content extraction ---

function extractContent(message) {
  if (!message) return '(empty)';
  const content = message.content;
  if (typeof content === 'string') return content;

  if (Array.isArray(content)) {
    return content.map(block => {
      if (typeof block === 'string') return block;

      switch (block.type) {
        case 'text':
          return block.text || '';
        case 'tool_use':
          const inputStr = JSON.stringify(block.input, null, 2);
          const truncated = compact ? truncateStr(inputStr, 200) : truncateStr(inputStr, 500);
          return `\n🔧 **Tool: ${block.name}**\n\`\`\`json\n${truncated}\n\`\`\`\n`;
        case 'tool_result':
          if (compact) return '';
          const resultContent = block.content;
          if (typeof resultContent === 'string') {
            return `\n📋 **Tool Result**\n\`\`\`\n${truncateStr(resultContent, 500)}\n\`\`\`\n`;
          }
          if (Array.isArray(resultContent)) {
            return resultContent.map(rc => {
              if (rc.type === 'text') {
                return `\n📋 **Tool Result**\n\`\`\`\n${truncateStr(rc.text, 500)}\n\`\`\`\n`;
              }
              return '';
            }).join('');
          }
          return '';
        case 'thinking':
          return full ? `\n💭 *Thinking: ${truncateStr(block.thinking || '', 300)}*\n` : '';
        default:
          return '';
      }
    }).join('\n');
  }

  return '(unknown content format)';
}

function isOnlyToolResult(message) {
  if (!message) return false;
  const content = message.content;
  if (typeof content === 'string') return false;
  if (!Array.isArray(content)) return false;
  return content.every(block => block.type === 'tool_result');
}

function truncateStr(str, maxLen) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + `\n... (truncated, ${str.length} chars total)`;
}

function trimContent(content, maxLen) {
  if (!content || content.length <= maxLen) return content;
  return content.slice(0, maxLen) + `\n\n... (truncated, ${content.length} chars total)`;
}
