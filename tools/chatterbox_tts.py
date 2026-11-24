"""Chatterbox TTS ile seslendirme üretir (isteğe bağlı zero-shot ses klonlama).

Kullanım:
  ~/.chatterbox/Scripts/python.exe tools/chatterbox_tts.py --text "..." --out ses.wav [--ref referans.wav]
  ~/.chatterbox/Scripts/python.exe tools/chatterbox_tts.py --text-file script.txt --out work/voice.wav --ref benim_sesim.wav

--ref verilmezse modelin varsayılan sesi kullanılır.
--exaggeration: duygu yoğunluğu (0.25-2.0, varsayılan 0.5). --cfg: tempo/sadakat (0.0-1.0, varsayılan 0.5).
"""
import argparse, re, time
import torch, torchaudio
from chatterbox.tts import ChatterboxTTS

ap = argparse.ArgumentParser()
g = ap.add_mutually_exclusive_group(required=True)
g.add_argument("--text"); g.add_argument("--text-file")
ap.add_argument("--out", required=True)
ap.add_argument("--ref", help="klonlanacak ses (5-10 sn, temiz kayıt)")
ap.add_argument("--exaggeration", type=float, default=0.5)
ap.add_argument("--cfg", type=float, default=0.5)
a = ap.parse_args()

text = a.text if a.text else open(a.text_file, encoding="utf-8").read()
text = " ".join(text.split())
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"cihaz: {device}", flush=True)
t0 = time.time()
model = ChatterboxTTS.from_pretrained(device=device)
print(f"model yüklendi: {time.time()-t0:.0f} sn", flush=True)

# Uzun metinleri cümle gruplarına böl (model ~300 karakterden uzun parçalarda bozulabilir)
sents = re.split(r"(?<=[.!?])\s+", text)
chunks, cur = [], ""
for s in sents:
    if cur and len(cur) + len(s) > 250:
        chunks.append(cur); cur = s
    else:
        cur = (cur + " " + s).strip()
if cur: chunks.append(cur)

parts = []
for i, c in enumerate(chunks, 1):
    t1 = time.time()
    wav = model.generate(c, audio_prompt_path=a.ref, exaggeration=a.exaggeration, cfg_weight=a.cfg)
    parts.append(wav)
    parts.append(torch.zeros(1, int(model.sr * 0.25)))  # parçalar arası kısa durak
    print(f"parça {i}/{len(chunks)}: {time.time()-t1:.0f} sn", flush=True)

out = torch.cat(parts[:-1], dim=1)
torchaudio.save(a.out, out, model.sr)
print(f"tamam -> {a.out} ({out.shape[1]/model.sr:.1f} sn ses, toplam {time.time()-t0:.0f} sn)")
