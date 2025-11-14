# DEVELOPMENT (starter)
# 🏦 DEVELOPMENT DOCUMENTATION
## Project: BPR Digital Signage Web Application (Enterprise Edition)
**Version:** 2.5  
**Last Updated:** 2025-11-08  
**Maintained by:** Web Development Team, BPR Technology Division

---

## 🧭 Overview

Aplikasi **Digital Signage Web App** ini dikembangkan untuk **Bank Perkreditan Rakyat (BPR)** sebagai sistem tampilan informasi digital yang modern, terpusat, dan aman.

Tujuan utama:
- Menampilkan **promo produk**, **suku bunga tabungan/deposito**, dan **informasi ekonomi terkini** secara real-time 
- Memberikan **transparansi data finansial** kepada nasabah melalui kurs resmi, harga emas, IHSG, dan berita ekonomi.

---

## ✨ Core Features

| Fitur | Deskripsi |
|-------|------------|
| 🎥 **Promo Produk & Video** | Tampilkan media promosi dan branding bank |
| 💰 **Info Suku Bunga (Rate)** | Data tabungan & deposito, terhubung ke CMS |
| 💱 **Kurs Resmi  BCA** | Data kurs valas dari Bank Indonesia (SOAP) dan BCA Exchange Rates |
| 🪙 **Harga Emas** | Harga emas per gram & ounce, update otomatis |
| 📈 **IHSG (Yahoo Finance)** | Indeks saham gabungan terkini |
| 📰 **Berita Ekonomi (RSS)** | Feed berita ekonomi nasional dari CNBC, Kontan, Antara |
| 🛰️ **Remote Management** | Update konten dari kantor pusat |
| 💾 **Offline Mode (PWA)** | Data tersimpan lokal untuk TV di cabang |
| 🔒 **Keamanan Tinggi (JWT, TLS)** | Akses terproteksi dan terenkripsi |
| 🧠 **Scheduler & Monitoring** | Jadwal tayang otomatis dan pelacakan status perangkat |

---

## 🏗️ System Architecture

+-----------------------------+
| CMS (Strapi) |
| - Promo & Rate Management |
+-------------+---------------+
|
v
+-----------------------------+
| Backend API (Node.js) |
| - /api/devices/:id/playlist|
| - /api/rates/active |
| - /api/economic |
| |
| Integrasi Eksternal: |
| ├──  |
| ├── BCA Exchange Rates |
| ├──  |
| ├── Yahoo Finance (^JKSE) |
| └── RSS News Feeds |
+-------------+---------------+
|
v
+-----------------------------+
| Frontend (React PWA) |
| - Player Mode Fullscreen |
| - Economic Info Carousel |
| - Offline Caching |
+-------------+---------------+
|
v
+-----------------------------+
| Smart TV / Mini PC Client |
+-----------------------------+


---

## ⚙️ Tech Stack

| Layer | Teknologi | Deskripsi |
|-------|------------|-----------|
| Frontend | React (Vite) + Tailwind | Tampilan signage PWA fullscreen |
| Backend | Node.js + Express | API utama dan penghubung eksternal |
| Database (Opsional) | PostgreSQL | Untuk log dan konten dinamis |
| External API | BI SOAP / BCA / GoldAPI / Yahoo / RSS | Sumber data ekonomi |
| Auth | JWT + API Key | Keamanan perangkat |
| Deployment | Docker / Nginx / Vercel | Multi-environment ready |
| Monitoring | Sentry + UptimeRobot | Error tracking & uptime |
| Scheduler | Node-Cron + Cache TTL | Auto-refresh data ekonomi |

---

## 🧩 Data Flow Summary

| Endpoint | Deskripsi | Sumber Data | Refresh |
|-----------|------------|--------------|----------|
| `/api/rates/active` | Suku bunga tabungan & deposito | CMS | Manual |
| `/api/economic` | Kurs, emas, IHSG, berita | BI / BCA / GoldAPI / Yahoo / RSS | Otomatis |
| `/api/devices/:id/playlist` | Playlist konten TV | CMS / JSON | Manual |
| `/api/health` | Status server | Internal | Real-time |

---

## 💱 Economic Data Integrations

2️⃣ BCA Exchange Rates API

Repo Asli: https://github.com/amirhsn/bca-exchange-rates

Default Deployment: https://bca-exchange-rates.vercel.app

Data: E-Rate, TT Counter, dan Bank Notes (Buy/Sell)

.env Konfigurasi:

BCA_RATES_URL=
BCA_RATE_SOURCE=


Mapping Otomatis:

Key	Deskripsi
E_RATE_BUY / SELL	Kurs e-Rate online
TT_COUNTER_BUY / SELL	Kurs transfer counter
BANK_NOTES_BUY / SELL	Kurs uang kertas fisik

Fallback otomatis: Jika API BCA tidak merespons → exchangerate.host.

3️⃣ GoldAPI (Harga Emas)

Endpoint: https://www.goldapi.io/api/XAU/IDR

Auth Header: x-access-token: ${GOLD_API_KEY}

Hasil JSON:

{
  "price": 37200000,
  "metal": "XAU",
  "currency": "IDR",
  "timestamp": 1730990000
}



4️⃣ Yahoo Finance (IHSG / IDX Composite)

Endpoint:

https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5EJKSE


Data: Harga & persentase perubahan IHSG (live delayed)

Keuntungan: Tidak memerlukan API key

Catatan:
Untuk produksi, sebaiknya gunakan data vendor resmi IDX atau licensed provider.

5️⃣ Berita Ekonomi (RSS Feeds)

Default Sources:

https://www.cnbcindonesia.com/market/rss/
https://www.kontan.co.id/rss
https://www.antaranews.com/rss/ekonomi.xml


Parser: rss-parser

Auto refresh: setiap 15 menit

Output: Judul, link, sumber, dan waktu publikasi

🔐 Security & Compliance
Aspek	Implementasi
Transport Layer	HTTPS (TLS 1.3) wajib
Auth Device	JWT / API Key per device
Rate Limit	100 req/min per device
Audit Log	Setiap update suku bunga & kurs disimpan
Data Privacy	Tidak menyimpan data nasabah
Backup	Harian (PostgreSQL & cache dump)
Error Monitoring	Sentry
Offline Handling	IndexedDB + Service Worker
📦 Environment Variables

Contoh .env:

PORT=4000
API_KEY=secret_dev_key



# BCA Exchange Rates
BCA_RATES_URL=https://bca-exchange-rates.vercel.app
BCA_RATE_SOURCE=E_RATE_SELL



# News feeds
NEWS_FEEDS=https://www.cnbcindonesia.com/market/rss/,https://www.kontan.co.id/rss

# Refresh intervals
REFRESH_CURRENCY_SECONDS=3600
REFRESH_GOLD_SECONDS=1800
REFRESH_STOCK_SECONDS=1800
REFRESH_NEWS_SECONDS=900

🧠 Developer Guidelines
Area	Standard
Code Style	ESLint + Prettier
Version Control	GitFlow (main, develop, feature/*)
Commits	Conventional Commits
Testing	Jest (unit), Cypress (UI)
Data Validation	Joi / Zod
API Docs	Swagger / Postman
CI/CD	GitHub Actions + Docker
Monitoring	Grafana + Prometheus
Backup	Daily (pg_dump + S3)
🚀 Deployment (Production)
Option 1 — Docker Compose
docker-compose up -d

Option 2 — Manual (Node)
cd backend
npm install
npm run start

Option 3 — Vercel (Frontend)
cd frontend
npm run build
vercel deploy

📊 Monitoring Schedule
Task	Tool	Interval
Uptime check	UptimeRobot	5 menit
Error logging	Sentry	Real-time
Data refresh	Node-Cron	Sesuai .env
Backup	pg_dump	24 jam
Cache purge	node-cache flush	1 minggu
🧾 Changelog
Versi	Tanggal	Perubahan Utama
v1.0.0	2025-11-01	MVP: Display promo, rate tabungan
v1.1.0	2025-11-07	Integrasi Info Bunga & offline mode
v2.0.0	2025-11-08	Tambah kurs BI SOAP + GoldAPI + Yahoo Finance
v2.2.0	2025-11-08	Integrasi BCA Exchange Rates (repo amirhsn)
v2.5.0	2025-11-08	Final Production Documentation & Security Update
🪪 License & Ownership

© 2025 PT BPR BAPERA BATANG
Internal Use Only – Not for Public Distribution
Development licensed under MIT for partner customization.
Third-party APIs (BI, BCA, GoldAPI, Yahoo) are subject to their respective terms of use.

📬 Contact

Development Team:

🧑‍💻 Lead Engineer: devteam@bprbaperabatang.com

🧑‍💼 Product Manager: digital@bprbaperabatang.com

🌐 Website: https://bprbaperabatang.com

“Informasi Real-Time untuk Nasabah, Transparansi untuk Kepercayaan.”
BPR Digital Signage — Banking Visual Intelligence Platform