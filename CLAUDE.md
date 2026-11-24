# cizgi-short

Seslendirmeli dikey çizgi film Short'ları üretme projesi. Video üretimi için `cizgi-short` skill'ini kullan (`.claude/skills/cizgi-short`).

## Oturum sürekliliği (zorunlu)
- **Oturum başında** `DURUM.md` dosyasını oku ve kullanıcıya kısaca "en son şurada kalmıştık, sıradaki adım şu" diye özetle.
- `.claude/oturum-gecmisi.md` her kullanıcı mesajını otomatik kaydeder (hook); gerekirse son mesajlara oradan bak.
- **Her kullanıcı isteğinden sonra** (bir adım bittiğinde, karar verildiğinde, dosya üretildiğinde) `DURUM.md`'yi güncelle: "Şu an neredeyiz", "Açık sorular", "Sıradaki" bölümleri her zaman güncel olsun. Tarihleri mutlak yaz.

## Ortam notları
- Windows; Türkçe karakterli Python çıktısı için PYTHONUTF8=1 gerekli (`.claude/settings.json`'da tanımlı).
- Chatterbox ayrı venv'de: `~/.chatterbox/Scripts/python.exe tools/chatterbox_tts.py`.
- NVIDIA GPU yok: Chatterbox CPU'da yavaş (~10 sn ses ≈ 3,5–4 dk). Render ise hızlı (~0,6 sn/kare).

## Bulutta çalışma (claude.ai/code)
- Kurulum `bulut-kurulum.sh` ile otomatik (SessionStart hook, sadece `CLAUDE_CODE_REMOTE=true` iken). Kurulum başarısızsa elle: `bash bulut-kurulum.sh --force`.
- Bulutta Python `python3`; Chatterbox yok → seslendirme **edge-tts en-GB-RyanNeural** (`python3 -m edge_tts --voice en-GB-RyanNeural --text "..." --write-media work/voice.mp3`).
- Bulutta GPU yok: render kare başına birkaç saniye sürebilir. Önce düşük çözünürlüklü önizleme / qa_sheet ile kontrol et, sonra tam render.
- Bitmiş MP4'ü `teslim/<proje>.mp4` olarak kopyala, commit'le ve gönder (push) — kullanıcı GitHub'dan indirir. Ara dosyaları (frames, .remotion) gönderme.
- Bulut oturumu kendi `claude/...` dalına gönderir. Bitince kullanıcıya **doğrudan indirme linkini** ver: `https://github.com/ahmetr46/cizgi-shorts/raw/<dal-adı>/teslim/<dosya>.mp4`.
- Ağ: seslendirme `speech.platform.bing.com` (edge-tts) ister. 403 alırsan kullanıcıya ortam ayarlarında Network access'i **Full** yapıp **yeni oturum** açmasını söyle; Full'de hâlâ 403 ise `pip install -U edge-tts` dene.
