# Case Study: PestRisk (AI-Powered Crop Disease & Pest Risk Intelligence)

## Project Overview
**PestRisk** is an intelligent agricultural technology solution engineered by Annu Jaswanth to empower farmers and agricultural agronomists with real-time pest detection, disease classification, and predictive risk modeling.

## The Challenge
Crop diseases and insect pest infestations cause significant yield losses annually across the globe. Smallholder farmers often misdiagnose fungal, bacterial, or insect damage, leading to:
- Inappropriate or excessive pesticide application.
- Escalated chemical expenses and soil toxicity.
- Widespread crop destruction when infestations are detected too late.

## Annu's Solution & Architecture
Annu engineered a multi-modal computer vision and predictive risk platform:
1. **Computer Vision Diagnostics**: Farmers capture an image of an affected leaf, stem, or fruit using their smartphone camera.
2. **Deep Learning Inference**: A lightweight deep convolutional neural network / YOLO object detection pipeline classifies the disease or pest with high accuracy (over 94% validation accuracy across common agricultural crops).
3. **Micro-Climate Risk Correlation**: Integrates regional ambient temperature, relative humidity, and rainfall forecasts to predict the probability of fungal spore germination and secondary pest outbreaks.
4. **Targeted Advisory & Treatment Engine**: Provides actionable, non-toxic organic remedies alongside precise chemical treatment dosage guidelines to minimize environmental damage and save input costs.
5. **Multilingual Interface**: Designed for accessible usage across rural communities with voice guidance and regional language support.

## Tech Stack Used
- **AI / Computer Vision**: Python, PyTorch, OpenCV, YOLO, Transfer Learning (EfficientNet/MobileNet for edge deployment).
- **Backend**: FastAPI, Python, Docker, Redis cache.
- **Frontend**: Next.js, React, Tailwind CSS, Progressive Web App (PWA) capabilities for offline field caching.

## Impact & Value
- Sub-second image diagnosis directly from the field.
- Helped farmers detect blights, rusts, and borers up to 7–10 days before visible widespread damage.
- Decreased unnecessary pesticide spraying by approximately 35%.
