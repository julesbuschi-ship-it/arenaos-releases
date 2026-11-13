// Hôtel Arena Le Refuge — disponibilités et prix des 60 prochains jours (Beds24 API v2, lecture seule)
// Exécuté par GitHub Actions (.github/workflows/availability.yml) toutes les 30 min.
// Sortie : web/data/availability.json, lu par la page /reservation/ (ARENA AVAIL v1) via raw.githubusercontent.com.
// Secret : BEDS24_TOKEN (jeton longue durée Beds24, droits lecture inventaire).

import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const TOKEN = process.env.BEDS24_TOKEN;
if (!TOKEN) { console.error('BEDS24_TOKEN manquant'); process.exit(1); }

const PROP = 353488;
const ROOMS = { 729093: 'double', 729374: 'twin', 729272: 'triple', 729275: 'quadruple' };
const DAYS = 60;
const OUT = new URL('./availability.json', import.meta.url);

const iso = (d) => d.toISOString().slice(0, 10);
const now = new Date(); now.setUTCHours(0, 0, 0, 0);
// Saison : 1er mai → 15 octobre. Hors saison, on expose les 60 premiers jours de la saison suivante.
let today = now;
const y = now.getUTCFullYear();
const open = new Date(Date.UTC(y, 4, 1)), close = new Date(Date.UTC(y, 9, 15));
if (now < open) today = open; else if (now > close) today = new Date(Date.UTC(y + 1, 4, 1));
const start = iso(today);
const end = iso(new Date(today.getTime() + (DAYS - 1) * 864e5));

const qs = new URLSearchParams({ propertyId: PROP, startDate: start, endDate: end, includeNumAvail: 'true', includePrices: 'true', includeMinStay: 'true', includeOverrides: 'true' });
const res = await fetch('https://api.beds24.com/v2/inventory/rooms/calendar?' + qs, { headers: { token: TOKEN, accept: 'application/json' } });
if (!res.ok) { console.error('Beds24 HTTP', res.status, await res.text()); process.exit(1); }
const body = await res.json();
if (!body.success) { console.error('Beds24:', JSON.stringify(body).slice(0, 500)); process.exit(1); }

// Expansion des plages {from,to} en jours
const days = {};
for (let i = 0; i < DAYS; i++) days[iso(new Date(today.getTime() + i * 864e5))] = { avail: 0, from: null, rooms: {} };
for (const room of body.data || []) {
  const key = ROOMS[room.roomId]; if (!key) continue;
  for (const seg of room.calendar || []) {
    const a = new Date(seg.from + 'T00:00:00Z'), b = new Date((seg.to || seg.from) + 'T00:00:00Z');
    for (let t = a.getTime(); t <= b.getTime(); t += 864e5) {
      const d = days[iso(new Date(t))]; if (!d) continue;
      const closed = seg.override && seg.override !== 'none';
      const n = closed ? 0 : (seg.numAvail ?? 0);
      const p = seg.price1 != null ? Math.round(seg.price1) : null;
      d.rooms[key] = { n, p, min: seg.minStay ?? 1 };
      d.avail += n;
      if (n > 0 && p != null && (d.from == null || p < d.from)) d.from = p;
    }
  }
}

const out = { updated: new Date().toISOString(), start, end, rooms: ROOMS, days };
const prev = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
const next = JSON.stringify(out);
// Ne réécrit (et ne commit) que si les données changent (hors horodatage)
if (prev && prev.replace(/"updated":"[^"]+"/, '') === next.replace(/"updated":"[^"]+"/, '')) { console.log('inchangé'); process.exit(0); }
writeFileSync(OUT, next);
console.log('écrit', Object.keys(days).length, 'jours');
