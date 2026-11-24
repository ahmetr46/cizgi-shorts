"""UserPromptSubmit hook: her kullanıcı mesajını tarih-saatiyle .claude/oturum-gecmisi.md'ye ekler."""
import sys, json, os, datetime

data = json.loads(sys.stdin.buffer.read().decode("utf-8") or "{}")
prompt = (data.get("prompt") or "").strip()
if not prompt:
    sys.exit(0)
root = os.environ.get("CLAUDE_PROJECT_DIR") or os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
path = os.path.join(root, ".claude", "oturum-gecmisi.md")
new = not os.path.exists(path)
with open(path, "a", encoding="utf-8") as f:
    if new:
        f.write("# Oturum geçmişi (otomatik — her kullanıcı mesajı)\n\n")
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    sid = (data.get("session_id") or "")[:8]
    f.write(f"- **{ts}** `{sid}` — {prompt.replace(chr(10), ' / ')}\n")
