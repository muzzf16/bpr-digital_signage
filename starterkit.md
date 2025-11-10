# BPR Digital Signage — Starter Kit

This starter kit contains a runnable minimal MVP for the BPR Digital Signage Web App: backend (Node/Express), frontend (React + Vite), Docker files, CI workflows, and docs. Copy the files into a git repo with the structure below and follow the Quick Start.

---

## Project structure

```
bpr-digital-signage-starter/
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── Dockerfile
│   └── src/
│       ├── index.js
│       ├── data/mock.js
│       ├── routes/playlist.js
│       ├── routes/rates.js
│       ├── routes/economic.js
│       └── services/external.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles.css
│       └── components/
│           ├── Player.jsx
│           ├── ImageSlide.jsx
│           ├── RateSlide.jsx
│           ├── EconomicInfoSlide.jsx
│           └── NewsTicker.jsx
├── 
├── 
├── DEVELOPMENT.md
└── README.md
```

---

> NOTE: The canvas shows all file contents. Use this as a copy/paste starter. After creating files, run `npm install` in both `backend` and `frontend`, fill `.env` from `.env.example`, then `npm run dev` for both.

---

## Files (copy each file into your repo)

---

### backend/package.json

```json
{
  "name": "bpr-signage-backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "node-fetch": "^3.4.0",
    "node-cache": "^5.1.2",
    "xml2js": "^0.4.23",
    "rss-parser": "^3.12.0",
    "cron": "^2.3.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

---

### backend/.env.example

```
PORT=4000
API_KEY=secret_dev_key

# BI SOAP (optional)
BI_WS_URL=
BI_SOAP_ACTION=
BI_SOAP_BODY_TEMPLATE=

# BCA exchange rates (optional)
BCA_RATES_URL=https://bca-exchange-rates.vercel.app
BCA_RATE_SOURCE=E_RATE_SELL

# GoldAPI
GOLD_API_KEY=

# News feeds
NEWS_FEEDS=https://www.cnbcindonesia.com/market/rss/,https://www.kontan.co.id/rss

# refresh intervals (seconds)
REFRESH_CURRENCY_SECONDS=3600
REFRESH_GOLD_SECONDS=1800
REFRESH_STOCK_SECONDS=1800
REFRESH_NEWS_SECONDS=900
```

---

### backend/Dockerfile

```
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 4000
CMD ["node", "src/index.js"]
```

---

### backend/src/data/mock.js

```js
const now = new Date().toISOString();
module.exports = {
  playlist: {
    id: "default-playlist",
    items: [
      { type: "image", url: "/assets/demo.jpg", duration: 12, title: "Promo Tabungan" },
      { type: "rate", productId: "tabungan-simapanas", duration: 10 },
      { type: "economic", duration: 15 },
      { type: "news", duration: 12 }
    ]
  },
  rates: [
    {
      id: "tabungan-simapanas",
      productName: "Tabungan Simapanas",
      interestRate: 4.25,
      currency: "IDR",
      effectiveDate: now,
      displayUntil: "2025-12-31T23:59:59Z",
      terms: "Bunga dihitung saldo rata-rata harian"
    }
  ],
  economic: {
    currencyRates: { USD: 15600, SGD: 11600, JPY: 105.3 },
    goldPrice: { gram: 1200000, ounce: 2300 },
    stockIndex: { IHSG: 7115.23, Change: "+0.34%" },
    updatedAt: now
  },
  news: [
    { title: "BI pertahankan suku bunga acuan", source: "CNBC Indonesia", link: "#" },
    { title: "IHSG menguat di akhir sesi", source: "Kontan", link: "#" }
  ]
};
```

---

### backend/src/routes/playlist.js

```js
const express = require("express");
const router = express.Router();
const mock = require("../data/mock");

router.get("/:deviceId/playlist", (req, res) => {
  res.json({ success: true, playlist: mock.playlist });
});

module.exports = router;
```

---

### backend/src/routes/rates.js

```js
const express = require("express");
const router = express.Router();
const mock = require("../data/mock");

router.get("/active", (req, res) => {
  res.json({ success: true, rates: mock.rates });
});

router.get("/:productId", (req, res) => {
  const p = mock.rates.find(r => r.id === req.params.productId);
  if (!p) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, rate: p });
});

module.exports = router;
```

---

### backend/src/routes/economic.js

```js
const express = require("express");
const router = express.Router();
const ext = require("../services/external");

router.get("/", async (req, res) => {
  try {
    const [currencyRates, goldPrice, stockIndex, news] = await Promise.all([
      ext.getCurrencyRates(),
      ext.getGoldPrice(),
      ext.getStockIndex(),
      ext.getNews()
    ]);

    res.json({
      success: true,
      data: { currencyRates, goldPrice, stockIndex, updatedAt: new Date().toISOString() },
      news
    });
  } catch (err) {
    console.error("economic route error", err);
    res.status(500).json({ success: false, message: "Failed to fetch economic data" });
  }
});

module.exports = router;
```

---

### backend/src/services/external.js

```js
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
const NodeCache = require('node-cache');
const RSSParser = require('rss-parser');
const parser = new RSSParser();
const xml2js = require('xml2js');

const cache = new NodeCache();

async function cached(key, ttlSeconds, fn) {
  const v = cache.get(key);
  if (v) return v;
  const out = await fn();
  cache.set(key, out, ttlSeconds);
  return out;
}

async function callBiSoap(dateStr) {
  if (!process.env.BI_WS_URL || !process.env.BI_SOAP_ACTION || !process.env.BI_SOAP_BODY_TEMPLATE) {
    throw new Error('BI SOAP config not provided');
  }
  const soapBody = process.env.BI_SOAP_BODY_TEMPLATE.replace(/\{DATE\}/g, dateStr);
  const headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    'SOAPAction': process.env.BI_SOAP_ACTION
  };
  const res = await fetch(process.env.BI_WS_URL, { method: 'POST', body: soapBody, headers });
  if (!res.ok) throw new Error(`BI SOAP returned ${res.status}`);
  const text = await res.text();
  const parsed = await xml2js.parseStringPromise(text, { explicitArray: false, ignoreAttrs: true });
  return parsed;
}

async function getCurrencyRates() {
  return cached('currencyRates', Number(process.env.REFRESH_CURRENCY_SECONDS || 3600), async () => {
    // BI SOAP
    if (process.env.BI_WS_URL && process.env.BI_SOAP_ACTION && process.env.BI_SOAP_BODY_TEMPLATE) {
      try {
        const date = new Date().toISOString().slice(0, 10);
        await callBiSoap(date);
        throw new Error('BI SOAP parsing not auto-configured; configure parser as needed');
      } catch (err) {
        console.warn('BI SOAP failed, fallback', err.message);
      }
    }

    // BCA (optional)
    if (process.env.BCA_RATES_URL) {
      try {
        const r = await fetch(process.env.BCA_RATES_URL);
        if (r.ok) {
          const j = await r.json();
          // normalize heuristics
          const rows = Array.isArray(j.data) ? j.data : (Array.isArray(j) ? j : []);
          const out = {};
          for (const row of rows) {
            const code = (row.currency || row.code || '').toUpperCase();
            if (!code) continue;
            const val = (row.eRate && row.eRate.sell) || (row.eRate && row.eRate.buy) || null;
            if (val) out[code] = Number(String(val).replace(/[, ]/g, ''));
          }
          if (out.USD) return { USD: out.USD, SGD: out.SGD || null, JPY: out.JPY || null, source: 'BCA', fetchedAt: new Date().toISOString() };
        }
      } catch (e) {
        console.warn('BCA fetch failed', e.message);
      }
    }

    // custom exchange API
    if (process.env.EXCHANGE_API_URL) {
      try {
        const r = await fetch(process.env.EXCHANGE_API_URL);
        if (r.ok) return { ...(await r.json()), source: 'custom-exchange', fetchedAt: new Date().toISOString() };
      } catch (e) { console.warn('custom exchange failed', e.message); }
    }

    // fallback exchangerate.host
    try {
      const r = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=IDR,SGD,JPY,EUR');
      const j = await r.json();
      return {
        USD: j.rates?.IDR ? Math.round(j.rates.IDR) : null,
        SGD: j.rates?.SGD ? Math.round(1 / j.rates.SGD * j.rates.IDR) : null,
        JPY: j.rates?.JPY ? Number((1 / j.rates.JPY * j.rates.IDR).toFixed(4)) : null,
        EUR: j.rates?.EUR ? Math.round(1 / j.rates.EUR * j.rates.IDR) : null,
        source: 'exchangerate.host', fetchedAt: new Date().toISOString()
      };
    } catch (e) {
      console.warn('exchangerate.host failed', e.message);
      return { USD: 15600, SGD: 11600, JPY: 105.3, EUR: 17000, source: 'mock', fetchedAt: new Date().toISOString() };
    }
  });
}

async function getGoldPrice() {
  return cached('goldPrice', Number(process.env.REFRESH_GOLD_SECONDS || 1800), async () => {
    if (process.env.GOLD_API_KEY) {
      try {
        const res = await fetch('https://www.goldapi.io/api/XAU/IDR', { headers: { 'x-access-token': process.env.GOLD_API_KEY } });
        if (res.ok) {
          const j = await res.json();
          const ouncePrice = Number(j.price || j.value || 0);
          const gram = ouncePrice ? Math.round(ouncePrice / 31.1034768) : null;
          return { gram, ounce: ouncePrice, fetchedAt: new Date().toISOString(), source: 'goldapi.io' };
        }
      } catch (e) { console.warn('GoldAPI error', e.message); }
    }
    return { gram: 1200000, ounce: 37200000, source: 'mock', fetchedAt: new Date().toISOString() };
  });
}

async function getStockIndex() {
  return cached('stockIndex', Number(process.env.REFRESH_STOCK_SECONDS || 1800), async () => {
    try {
      const url = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5EJKSE';
      const r = await fetch(url);
      if (!r.ok) throw new Error('Yahoo failed');
      const j = await r.json();
      const q = j.quoteResponse && j.quoteResponse.result && j.quoteResponse.result[0];
      if (!q) throw new Error('No result');
      return { symbol: q.symbol, name: q.shortName || 'IHSG', price: q.regularMarketPrice, change: q.regularMarketChangePercent ? `${q.regularMarketChangePercent.toFixed(2)}%` : null, fetchedAt: new Date().toISOString(), source: 'yahoo' };
    } catch (e) {
      console.warn('Yahoo fetch failed', e.message);
      return { symbol: '^JKSE', name: 'IHSG', price: 7115.23, change: '+0.34%', fetchedAt: new Date().toISOString(), source: 'mock' };
    }
  });
}

async function getNews() {
  return cached('newsFeed', Number(process.env.REFRESH_NEWS_SECONDS || 900), async () => {
    const feeds = (process.env.NEWS_FEEDS || 'https://www.cnbcindonesia.com/market/rss/').split(',');
    const items = [];
    for (const f of feeds.map(s => s.trim()).filter(Boolean)) {
      try {
        const feed = await parser.parseURL(f);
        const feedTitle = feed.title || f;
        feed.items.slice(0, 8).forEach(i => items.push({ title: i.title, link: i.link, source: feedTitle, pubDate: i.pubDate }));
      } catch (e) { console.warn('RSS fetch failed', f, e.message); }
    }
    items.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
    return items.slice(0, 12);
  });
}

module.exports = { getCurrencyRates, getGoldPrice, getStockIndex, getNews, _cache: cache };
```

---

### backend/src/index.js

```js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const playlistRouter = require('./routes/playlist');
const ratesRouter = require('./routes/rates');
const economicRouter = require('./routes/economic');

const app = express();
app.use(cors());
app.use(express.json());

// simple API key middleware
app.use((req, res, next) => {
  const key = req.headers['x-api-key'] || req.query.api_key;
  if (!key || key !== process.env.API_KEY) {
    if (req.path === '/' || req.path.startsWith('/assets')) return next();
    return res.status(401).json({ success: false, message: 'Unauthorized: missing or invalid API key' });
  }
  next();
});

// static assets
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

app.use('/api/devices', playlistRouter);
app.use('/api/rates', ratesRouter);
app.use('/api/economic', economicRouter);

app.get('/', (req, res) => res.json({ success: true, message: 'BPR Signage Backend' }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
```

---

### frontend/package.json

```json
{
  "name": "bpr-signage-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  }
}
```

---

### frontend/vite.config.js

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { '/api': 'http://localhost:4000' } }
});
```

---

### frontend/index.html

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>BPR Signage Player</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### frontend/src/main.jsx

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')).render(<App />);
```

---

### frontend/src/App.jsx

```jsx
import React from 'react';
import Player from './components/Player';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const deviceId = params.get('device') || 'demo-tv-01';
  return <Player deviceId={deviceId} />;
}
```

---

### frontend/src/styles.css

```css
html,body,#root { height: 100%; margin: 0; background: #000; font-family: Inter, Arial, sans-serif; }
```

---

### frontend/src/components/Player.jsx

```jsx
import React, { useEffect, useState, useRef } from "react";
import ImageSlide from "./ImageSlide";
import RateSlide from "./RateSlide";
import EconomicInfoSlide from "./EconomicInfoSlide";
import NewsTicker from "./NewsTicker";

export default function Player({ deviceId }) {
  const [playlist, setPlaylist] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  async function fetchPlaylist() {
    try {
      const res = await fetch(`/api/devices/${deviceId}/playlist?api_key=secret_dev_key`);
      const j = await res.json();
      if (j.playlist) setPlaylist(j.playlist.items);
    } catch (e) { console.error('Fetch playlist failed', e); }
  }

  useEffect(() => {
    fetchPlaylist();
    const interval = setInterval(fetchPlaylist, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [deviceId]);

  useEffect(() => {
    if (!playlist.length) return;
    const cur = playlist[index];
    const dur = (cur.duration || 12) * 1000;
    timerRef.current = setTimeout(() => setIndex(i => (i + 1) % playlist.length), dur);
    return () => clearTimeout(timerRef.current);
  }, [playlist, index]);

  if (!playlist.length) return <div style={{color:'#fff',background:'#000',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading...</div>;

  const item = playlist[index];
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {item.type === 'image' && <ImageSlide url={item.url} title={item.title} />}
      {item.type === 'rate' && <RateSlide productId={item.productId} />}
      {item.type === 'economic' && <EconomicInfoSlide />}
      {item.type === 'news' && <NewsTicker />}
    </div>
  );
}
```

---

### frontend/src/components/ImageSlide.jsx

```jsx
import React from 'react';
export default function ImageSlide({ url, title }) { const src = url.startsWith('/') ? url : url; return (<div style={{ width:'100%',height:'100%',background:'#000',display:'flex',alignItems:'center',justifyContent:'center' }}><img src={src} alt={title||''} style={{ width:'100%',height:'100%',objectFit:'cover' }} />{title && <div style={{ position:'absolute', left:'3vw', bottom:'5vh', color:'#fff', fontSize:'4vw', textShadow:'0 2px 6px rgba(0,0,0,.6)' }}>{title}</div>}</div>); }
```

---

### frontend/src/components/RateSlide.jsx

```jsx
import React, { useEffect, useState } from 'react';
export default function RateSlide({ productId }) {
  const [rate, setRate] = useState(null);
  useEffect(() => { async function load() { try { const res = await fetch(`/api/rates/${productId}?api_key=secret_dev_key`); const j = await res.json(); if (j.rate) setRate(j.rate); } catch (e) { console.error(e); } } load(); }, [productId]);
  if (!rate) return <div style={{background:'#0b3b5c',height:'100vh',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading rate...</div>;
  return (
    <div style={{ width:'100%', height:'100%', background:'linear-gradient(to bottom,#0b3b5c,#086788)', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      <h1 style={{ fontSize:'5vw', margin:0 }}>{rate.productName}</h1>
      <div style={{ fontSize:'6vw', fontWeight:'800', marginTop:'1vh', color:'#ffd166' }}>{rate.interestRate}% p.a.</div>
      <div style={{ fontSize:'2vw', marginTop:'2vh' }}>Berlaku hingga: {new Date(rate.displayUntil).toLocaleDateString()}</div>
    </div>
  );
}
```

---

### frontend/src/components/EconomicInfoSlide.jsx

```jsx
import React, { useEffect, useState } from 'react';
export default function EconomicInfoSlide(){
  const [data,setData] = useState(null);
  useEffect(()=>{ async function f(){ try{ const res = await fetch('/api/economic?api_key=secret_dev_key'); const j = await res.json(); if(j.data) setData(j.data); }catch(e){console.error(e);} } f(); },[]);
  if(!data) return <div style={{background:'#111',height:'100vh',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading ekonomi...</div>;
  return (
    <div style={{ padding:'4vh', color:'#fff', width:'100%', height:'100%', background:'linear-gradient(180deg,#062a4f,#013a63)' }}>
      <h2 style={{ fontSize:'3.2vw', marginBottom:'2vh' }}>Info Ekonomi Terkini</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2vw', fontSize:'2.2vw' }}>
        <div>💱 <b>Kurs USD</b>: Rp {data.currencyRates.USD?.toLocaleString?.()}</div>
        <div>🪙 <b>Emas</b>: Rp {data.goldPrice.gram?.toLocaleString?.()} / gram</div>
        <div>📈 <b>IHSG</b>: {data.stockIndex.price} ({data.stockIndex.change})</div>
        <div><i>Terakhir: {new Date(data.updatedAt).toLocaleString()}</i></div>
      </div>
    </div>
  );
}
```

---

### frontend/src/components/NewsTicker.jsx

```jsx
import React, { useEffect, useState } from 'react';
export default function NewsTicker(){
  const [news,setNews] = useState([]);
  useEffect(()=>{ async function load(){ try{ const res = await fetch('/api/economic?api_key=secret_dev_key'); const j = await res.json(); if(j.news) setNews(j.news); }catch(e){console.error(e);} } load(); },[]);
  if(!news.length) return null;
  const tickerText = news.map(n=>`${n.title} — ${n.source}`).join('   •   ');
  return (
    <div style={{ position:'absolute', bottom:0, left:0, width:'100%', background:'#000', color:'#fff', padding:'1vh 2vw', fontSize:'2vw' }}>
      <div style={{ whiteSpace:'nowrap', overflow:'hidden' }}>
        <div style={{ display:'inline-block', transform:'translateX(0)', animation:'ticker 20s linear infinite' }}>{tickerText}</div>
      </div>
      <style>{`@keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
    </div>
  );
}
```

---

### .github/workflows/ci.yml

```yaml
name: CI
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install frontend deps
        working-directory: frontend
        run: npm ci
      - name: Build frontend
        working-directory: frontend
        run: npm run build
  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install backend deps
        working-directory: backend
        run: npm ci
```

---

### .github/workflows/pages-deploy.yml

```yaml
name: Deploy Frontend to GitHub Pages
on:
  push:
    branches: [ main ]
permissions:
  contents: read
  pages: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install frontend deps
        working-directory: frontend
        run: npm ci
      - name: Build frontend
        working-directory: frontend
        run: npm run build
      - name: Deploy to Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

---

### DEVELOPMENT.md

> (This file mirrors the final production documentation. For brevity this starter contains a compact form — copy the longer `DEVELOPMENT.md` you approved earlier into this file in your repo.)

```markdown
# DEVELOPMENT (starter)

This repository contains an MVP starter. For full enterprise documentation, copy the full `docs/DEVELOPMENT.md` (provided earlier in the conversation) into this path.
```

---

### README.md

```markdown
# BPR Digital Signage — Starter Kit

This is a starter repo for the BPR Digital Signage Web App (MVP). See `docs/DEVELOPMENT.md` for full documentation.

Quick start:
1. cd backend && npm install && cp .env.example .env && npm run dev
2. cd frontend && npm install && npm run dev
3. open http://localhost:5173/?device=demo-tv-01
```

```

---

## Quick Start (local)

1. Create a new git repo and paste the files above into the structure.
2. `cd backend` → `npm install` → copy `.env.example` to `.env` and set `API_KEY`.
3. `npm run dev` (backend runs at `http://localhost:4000`).
4. `cd frontend` → `npm install` → `npm run dev` (frontend at `http://localhost:5173`).
5. Open `http://localhost:5173/?device=demo-tv-01`.

---

 