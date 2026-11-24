"""SessionStart hook: DURUM.md'yi oturum başında Claude'un bağlamına ekler."""
import sys, json, os

root = os.environ.get("CLAUDE_PROJECT_DIR") or os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
p = os.path.join(root, "DURUM.md")
if os.path.exists(p):
    text = open(p, encoding="utf-8").read()
    out = {"hookSpecificOutput": {"hookEventName": "SessionStart",
           "additionalContext": "Proje durumu (DURUM.md) — kullanıcıya en son nerede kalındığını ve sıradaki adımı kısaca özetle:\n\n" + text}}
    sys.stdout.buffer.write(json.dumps(out, ensure_ascii=False).encode("utf-8"))
