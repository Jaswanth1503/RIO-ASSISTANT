# RIO Voice Model Training Pipeline (F5-TTS)

This directory contains the audio training pipeline, dataset specification, and inference code to train **RIO's custom voice model** using Annu Jaswanth's voice characteristics.

---

## 1. Audio Recording Requirements

To achieve natural, professional, and expressive voice synthesis with F5-TTS:

### A. Dataset Specifications
- **English Dataset**: 10 minutes of clean, conversational, expressive speech (`voice/dataset/english/`).
- **Telugu Dataset**: 10 minutes of clean, natural Telugu conversational speech (`voice/dataset/telugu/`).
- **Sample Rate**: 24,000 Hz or 44,100 Hz, 16-bit Mono PCM `.wav`.
- **Environment**: Quiet studio or room with minimal reverberation, zero background hum/fan noise, and pop filter.

### B. Suggested Script Prompts
1. **Consultative Introduction**:
   *"Hello, I'm RIO, Annu Jaswanth's personal AI representative. I can assist you with system architecture, full stack web apps, and custom autonomous agents."*
2. **Project Experience**:
   *"For Veera RMC, Annu engineered a real-time fleet telemetry and automated concrete dispatch platform that reduced idle wait times by 28 percent."*
3. **Technical Explanation**:
   *"Next.js 15 with React 19 server components enables sub-second initial page rendering and seamless edge API integration."*
4. **Telugu Script Prompts**:
   *"నమస్కారం! నేను రియో, అన్నూ జస్వంత్ యొక్క ఏఐ రిప్రజెంటేటివ్‌ని. మీ ప్రాజెక్ట్ డెవలప్‌మెంట్ అవసరాలను బట్టి సరైన టెక్ సొల్యూషన్ మరియు బడ్జెట్ అంచనాను అందించడంలో నేను మీకు సహాయపడగలను."*

---

## 2. Audio Preprocessing Pipeline

Run audio cleaning with `ffmpeg` or `demucs`:
```bash
# Normalize and convert to 24kHz mono wav
ffmpeg -i raw_sample.wav -ar 24000 -ac 1 -c:a pcm_s16le cleaned_sample.wav
```

---

## 3. Fine-Tuning & Running F5-TTS

Install prerequisites:
```bash
pip install torch torchaudio f5-tts gradio
```

Run the pipeline:
```bash
python voice/f5_tts_pipeline.py --mode train --config voice/config.json
```

Run the inference microservice:
```bash
python voice/f5_tts_pipeline.py --mode serve --port 8000
```
