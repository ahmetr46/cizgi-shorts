#!/usr/bin/env bash
# claude.ai/code bulut ortamı için kurulum. Yerel Windows'ta çalışmaz/gerekmez.
# Tekrar çalıştırmak güvenli: kurulu olanı atlar.
[ "$CLAUDE_CODE_REMOTE" = "true" ] || [ "$1" = "--force" ] || exit 0
set -e
PY=$(command -v python3 || command -v python)
mark="$HOME/.cizgi-kurulum-tamam"
[ -f "$mark" ] && exit 0
echo "[kurulum] Python paketleri..."
$PY -m pip install -q --upgrade pip >/dev/null 2>&1 || true
$PY -m pip install -q numpy Pillow imageio-ffmpeg faster-whisper edge-tts playwright
echo "[kurulum] Chromium..."
$PY -m playwright install --with-deps chromium >/dev/null 2>&1 || $PY -m playwright install chromium
command -v ffmpeg >/dev/null || (sudo apt-get install -y -qq ffmpeg >/dev/null 2>&1 || apt-get install -y -qq ffmpeg >/dev/null 2>&1 || echo "[kurulum] sistem ffmpeg yok, imageio-ffmpeg kullanılacak")
touch "$mark"
echo "[kurulum] tamam"
