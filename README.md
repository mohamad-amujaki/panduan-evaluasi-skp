# Panduan Evaluasi Kinerja Pegawai ASN — Triwulan II 2026

Website panduan internal berbasis HTML/CSS/JS, diisi dengan materi dari Surat Sekretaris
Jenderal Kemenkes Nomor KP.02.04/A/14795/2026 tanggal 2 Juli 2026 perihal Evaluasi Kinerja
Pegawai ASN Kemenkes Periode Triwulan II Tahun 2026 beserta lampirannya.

## Isi Folder

- `index.html` — shell DOM website
- `css/style.css` — design system & styling
- `js/app.js` — navigasi & fitur UX
- `js/data.js` — konten sections (auto-generated, jangan edit manual)
- `content/*.md` — sumber konten dalam Markdown
- `scripts/build.js` — build script markdown → data.js
- `assets/` — logo & gambar
- `biome.json` — konfigurasi linting

## Cara Pakai

### Development

```bash
npm install
npm run build    # convert markdown → data.js
npm run dev      # build + buka di browser
```

### Update Konten

1. Edit file markdown di folder `content/`
2. Jalankan `npm run build`
3. Refresh browser

### Linting

```bash
npm run lint       # cek error
npm run lint:fix   # auto-fix
npm run format     # format semua file JS
```

### Deploy ke Netlify/Vercel

1. Push folder ini ke repo GitHub
2. Import repo di Netlify/Vercel
3. Build command: `npm run build`
4. Output directory: `.` (root)

## Struktur Bab

1. **Ringkasan** — ikhtisar surat & angka-angka kunci
2. **Ketentuan Kinerja** — 5 predikat, anomali TW1, komposisi distribusi
3. **Proses Evaluasi** — tahapan evaluasi, konfirmasi & keberatan, dialog kinerja & tunjangan
4. **Panel Kalibrasi** — ketentuan umum, peserta & tahapan, fokus pembahasan, tabel korelasi K1/K2/K3
5. **Monitoring E-Kinerja** — panduan dashboard untuk pimpinan Eselon I & pimpinan unit kerja/pejabat penilai
6. **Referensi** — contoh surat keterangan, garis waktu

## Fitur UX

- Hash routing (shareable links)
- Search konten
- Keyboard navigation (←/→, `/`, Home/End)
- Back to top button
- Copy button on code blocks
- WhatsApp helpdesk floating button
- Responsive (mobile + tablet + desktop)
- Print-friendly

## Tech Stack

- Vanilla HTML/CSS/JS (zero framework)
- Node.js build script (marked.js)
- Biome.js linting
- Google Fonts (Inter)

## Sumber

Surat Sekretaris Jenderal Kemenkes Nomor KP.02.04/A/14795/2026, 2 Juli 2026, ditandatangani
Kunta Wibawa Dasa Nugraha. Untuk keabsahan hukum, selalu rujuk dokumen surat asli.

---
Versi 1.1 — 3 Juli 2026
