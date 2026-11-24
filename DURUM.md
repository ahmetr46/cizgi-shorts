# Proje Durumu — cizgi-short

> Son güncelleme: 2026-11-24 (bulut: tavuk videosu · yerel: Japonya videosu)
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
- [x] 2026-11-24: **İlk bulut (claude.ai/code) testi yapıldı.**
  - Kurulum: Python paketleri tamam; `playwright install chromium` ağ engeli (cdn.playwright.dev) yüzünden başarısız ama gerek yok → konteynerde hazır Chromium (`/opt/pw-browsers`) var; `render.py` artık onu kendisi buluyor.
  - edge-tts ilk denemede engellendi → yeni kişisel bulut ortamı **`cizgi-shorts`** oluşturuldu (izinli: speech.platform.bing.com). edge-tts'e `--proxy "$HTTPS_PROXY"` vermek gerekiyor (CLAUDE.md güncellendi).
  - Test: `teslim/test_ses.mp3` (Ryan, 2,93 sn) + `teslim/test.mp4` (ketçap 0–89. kare, 1080x1920, 3 sn). Render **~2,3 sn/kare** (CPU/SwiftShader, 4 çekirdek) → 33 sn'lik video (~1000 kare) ≈ 38–40 dk.
  - Not: test videosundaki altyazı orijinal senaryodan (test sesiyle eşleşmiyor), sadece motor testi.
  - 2026-11-24: Altyazı zamanlaması (faster-whisper `small`) da bulutta test edildi: Hugging Face adresleri `cizgi-shorts` ortamına eklendi, `av==15.1.0` kurulum betiğine eklendi, `bulut-kurulum.sh` hazır Chromium varsa indirmeyi atlıyor. Kurulum baştan sona hatasız.
  - Kullanıcı sordu: "İngilizce senaryolarımla video üreteceksin, doğru mu?" → Evet: kullanıcı İngilizce senaryo verir → Ryan sesi → altyazı → render → `teslim/<proje>.mp4`.
  - 2026-11-24: Bulut düzeltmeleri için PR açıldı: https://github.com/ahmetr46/cizgi-shorts/pull/1 — kullanıcı GitHub'da "Merge" edecek (yeni oturumlar main'den başladığı için gerekli).
  - 2026-11-24: Kullanıcı kararı: **dal/PR yok, her şey doğrudan main'e.** Proje tamam; artık sadece senaryo → video üretimi. CLAUDE.md'ye kural yazıldı. PR #1 yerine dal doğrudan main'e gönderildi.
- [~] 2026-11-24: **Video 2 (tavuk / "rich get richer")** — kullanıcı İngilizce senaryo verdi (148 kelime). Proje: `projeler/chicken/`.
  - Ses: edge-tts Ryan → cümle arası boşluklar ~0,6 sn'ye indirildi → `work/voice.wav` 55,2 sn. Zamanlama tamam (26 parça, 1645 kare). Em-dash'li kelimeler altyazı için bölündü.
  - 21 çekim (`work/PLAN.md`); tavuk/civciv/yumurta/kümes 3D primitiflerle kodlandı; `engine/cast.js`'e hen/egg/basket/bowl el eşyaları eklendi (sadece bu projede).
  - Önizleme kullanıcıya gönderildi; ses miksi tamam (mischief 108 bpm, -16 dB). Tam render bulutta başladı (~2,3 sn/kare, ~1 saat).
  - Bitince: `finish.py` → `teslim/chicken.mp4` → main'e push → indirme linki.
- [x] 2026-11-24: **Japonya videosu bitti (yerel)** → `projeler/japan/out/Japan_You_Cant_Be_Fired.mp4` (70,4 sn, -14 LUFS, donma/siyah yok). Kullanıcı izleyip geri bildirim verecek. → `projeler/japan/` — kullanıcının İngilizce senaryosu (Japonya'da kovulamama / oidashi-beya / istifa ajansı). Ses Ryan, boşluklar 0,3 sn → `work/voice.wav` 70,6 sn. 26 çekim (`work/PLAN.md`). Tek metin değişikliği: "oidashi" → "oidashi beya", rakamlar yazıyla. Bilgi doğrulandı: İş Sözleşmesi Kanunu md.16; Momuri çalışanı Kasım 2024'te başka ajansla istifa etti. 
- [ ] **Sıradaki:** kullanıcı İngilizce senaryo gönderecek → video üret → `teslim/` → main; sonra bulutta yeni senaryodan tam video denemesi (bkz. Açık sorular 2); ayrıca kullanıcı videoyu izleyip geri bildirim verecek (çekim/altyazı/müzik değişikliği) → sonra listeden sıradaki fikir

## Açık sorular (kullanıcıya)
0. 2026-11-24 (ilk bulut oturumu): Kullanıcı ücretsiz Türkçe ses seçeneklerini sordu → edge-tts (Emel/Ahmet), Piper, Coqui XTTS-v2, Chatterbox Multilingual, MMS-TTS, gTTS anlatıldı. **Bulut ortamında edge-tts sunucusu (speech.platform.bing.com) ağ politikası nedeniyle engelli (403)** → bulutta seslendirme için ortam ağ izni gerekli. Kullanıcı hangi sesle örnek istediğini söyleyecek. 2026-11-24 (yerel): bulut dalı main'e alındı; kullanıcıya ortam ağını Full yapıp yeni oturum açması söylendi; CLAUDE.md'ye indirme linki + 403 notu eklendi.
1. (yok — ses seçildi)
2. 2026-11-24: Kullanıcı "yayına alıp her yerden sadece senaryo girerek video üretme" sordu. Seçenekler sunuldu: (A) claude.ai/code + GitHub repo, (B) Claude API'li otomatik web servisi, (C) PC'ye uzaktan erişim. **A seçildi.** 2026-11-24: yerel git reposu kuruldu (main, ilk commit 49a9d74, ~27 MB; frames/.remotion/mp4/ses-deneme .gitignore'da). 2026-11-24: GitHub'a gönderildi → https://github.com/ahmetr46/cizgi-shorts (commit yazarı ahmetr46 <kingby30@gmail.com>). `bulut-kurulum.sh` + SessionStart hook + `teslim/` klasörü eklendi. 2026-11-24: kullanıcı Claude'u GitHub'a bağladı. 2026-11-24: ilk bulut oturumu açıldı, test başarılı (yukarı bak). Yeni oturumlarda **`cizgi-shorts`** ortamını seç.

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
