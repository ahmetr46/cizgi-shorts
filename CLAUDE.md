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
