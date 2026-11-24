# Proje Durumu — cizgi-short

> Son güncelleme: 2026-11-24
> Bu dosya her adımda güncellenir. Yeni oturumda Claude önce bunu okur.

## Hedef
Sıfırdan, seslendirmeli dikey (9:16) çizgi film Short'ları üretmek (`cizgi-short` skill'i).
Dil: **İngilizce** (kullanıcı İngilizce üretim istedi).

## Şu an neredeyiz
- [x] `cizgi-short` skill'i projeye kuruldu: `.claude/skills/cizgi-short` (sadece bu projede geçerli)
- [x] Bağımlılıklar kuruldu (Playwright + Chromium, numpy, Pillow, faster-whisper, ffmpeg). Motor test edildi, GPU ile ~0,6 sn/kare.
- [x] 10 hikâye fikri sunuldu (aşağıda). Fikir 5 seçildi.
- [x] Seslendirme denemeleri yapılıyor:
  - edge-tts Türkçe Emel (`ses-deneme/emel_*.mp3`) — kullanıcı Emel'i seçmişti, sonra İngilizceye geçti
  - Chatterbox İngilizce: `chatterbox_varsayilan.wav`, `chatterbox_klon.wav` → kullanıcı **sesi düz buldu, inişli çıkışlı istiyor**
  - Daha canlı denemeler: `chatterbox_canli.wav` (exaggeration 0.8, cfg 0.3), `chatterbox_cok_canli.wav` (1.1, 0.3) — 2026-11-23: senaryonun tamamıyla **üretildi** (canlı 24,7 sn, çok canlı 23,4 sn; her biri ~14 dk sürdü). Kullanıcı **çok canlı (1.1)** sesi seçti ama **fazla hızlı** buldu. 2026-11-23: ilk ~8,5 sn ffmpeg atempo ile yavaşlatıldı → `ses-deneme/cok_canli_yavas_085.wav` (%85, 10 sn), `cok_canli_yavas_075.wav` (%75, 11,3 sn). Kullanıcı dinleyip tempo seçecek; sonra tam ses aynı tempoyla yavaşlatılıp `work/voice.wav` olacak.
- [x] 2026-11-23: Kullanıcı **fikir 5'i (ketçap ilaç)** seçti, süre **~30 sn**
- [x] İngilizce senaryo yazıldı: `work/script.txt` (80 kelime, ~30 sn)
- [x] 2026-11-23: Kullanıcı **edge-tts en-GB-RyanNeural** sesini seçti. Tam senaryo üretildi: `work/voice.mp3` (43 sn, cümle arası ~1 sn boşluk) → boşluklar 0,3 sn'ye indirildi: **`work/voice.wav` (32,9 sn, final ses)**
- [x] 2026-11-23: **Video 1 bitti** → `projeler/ketchup/out/Ketchup_Was_Medicine.mp4` (33,1 sn, 1080x1920, -14 LUFS, donma/siyah kare yok)
  - Proje: `projeler/ketchup/` (story.js, sound.json, work/PLAN.md, out/qa_sheet.jpg). 12 çekim: eczane → sokak → gazete → satıcı → hap kutusu → rakip tezgâhlar → hapın içi → laxative → 1850 → modern patates
  - Bilgi doğrulandı (web): Bennett 1834 iddiası, tarifler, hap furyası, müshil skandalı, ~1850 çöküş
- [ ] **Sıradaki:** kullanıcı videoyu izleyip geri bildirim verecek (çekim/altyazı/müzik değişikliği) → sonra listeden sıradaki fikir

## Açık sorular (kullanıcıya)
1. (yok — ses seçildi)
2. 2026-11-24: Kullanıcı "yayına alıp her yerden sadece senaryo girerek video üretme" sordu. Seçenekler sunuldu: (A) claude.ai/code + GitHub repo, (B) Claude API'li otomatik web servisi, (C) PC'ye uzaktan erişim. **A seçildi.** 2026-11-24: yerel git reposu kuruldu (main, ilk commit 49a9d74, ~27 MB; frames/.remotion/mp4/ses-deneme .gitignore'da). Sıradaki: kullanıcı GitHub'da özel boş repo açıp adresini verecek → push → bulut kurulum betiği (Chromium, ffmpeg, faster-whisper, edge-tts) → claude.ai/code'da deneme.

## 10 fikir (özet)
1. Galata'dan uçan adam, padişah sürgün etti (rivayet)
2. Kahve içene ceza veren padişah (belgelenmiş, ceza ayrıntısı tartışmalı)
3. Roma'da tuvalet vergisi, "para kokmaz" (belgelenmiş)
4. 1518 Strazburg dans salgını (belgelenmiş, sebep tartışmalı)
5. Ketçap ilaç olarak satıldı, 1830'lar (belgelenmiş)
6. Emu Savaşı 1932, ordu kuşlara yenildi (belgelenmiş)
7. Penisilin: dağınık laboratuvar 1928 (belgelenmiş)
8. Mikrodalga: cepte eriyen çikolata 1945 (belgelenmiş)
9. Tutmayan yapıştırıcıdan yapışkan not (belgelenmiş)
10. Kasabanın onursal başkanı kedi (tartışmalı)

## Ses araçları
- Chatterbox: `~/.chatterbox/Scripts/python.exe tools/chatterbox_tts.py --text "..." --out X.wav [--ref ref.wav] [--exaggeration 0.8 --cfg 0.3]`
  - CPU'da ~10 sn ses ≈ 3,5–4 dk
- edge-tts: `python -m edge_tts --voice tr-TR-EmelNeural --rate=+8% --text "..." --write-media X.mp3`

## Yapılan düzeltmeler (bozulmasın)
- `.claude/settings.json`: PYTHONUTF8=1 (Windows konsol Türkçe karakter hatası)
- Chatterbox venv: `setuptools<81` (resemble-perth pkg_resources istiyor)
- Sistem Python: `av==15.1.0` (faster-whisper; skill'in timing.py'si buna bağlı)
- `~/.shorts-skill/bin/activate` PATH düzeltmesi, `~/.claude/skills/shorts/scripts/validate.sh` ffprobe ayrıştırma düzeltmesi (eski `shorts` skill'i — video kesme, bu proje için kullanılmıyor)
