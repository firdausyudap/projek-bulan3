/**
 * NEXORA - script.js
 * Vanilla JS, tanpa framework, tanpa backend.
 * Data cuaca diambil langsung dari Open-Meteo (API publik, gratis, tanpa API key).
 */

// ==============================================
// 1. CEK CUACA
// ==============================================

// Kode cuaca WMO -> teks kondisi berbahasa Indonesia
function kodeCuacaKeTeks(kode) {
  const peta = {
    0: 'Cerah',
    1: 'Cerah Berawan',
    2: 'Berawan Sebagian',
    3: 'Mendung',
    45: 'Berkabut',
    48: 'Kabut Beku',
    51: 'Gerimis Ringan',
    53: 'Gerimis Sedang',
    55: 'Gerimis Lebat',
    61: 'Hujan Ringan',
    63: 'Hujan Sedang',
    65: 'Hujan Lebat',
    71: 'Salju Ringan',
    73: 'Salju Sedang',
    75: 'Salju Lebat',
    80: 'Hujan Lokal Ringan',
    81: 'Hujan Lokal Sedang',
    82: 'Hujan Lokal Lebat',
    95: 'Badai Petir',
    96: 'Badai Petir + Hujan Es',
    99: 'Badai Petir Hebat'
  };
  return peta[kode] || 'Tidak diketahui';
}

// Cari koordinat kota lewat API geocoding Open-Meteo
async function cariKoordinatKota(namaKota) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(namaKota)}&count=1&language=id`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal menghubungi layanan pencarian kota');

  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('Kota tidak ditemukan');
  }

  const hasil = data.results[0];
  return {
    lat: hasil.latitude,
    lon: hasil.longitude,
    label: [hasil.name, hasil.admin1, hasil.country].filter(Boolean).join(', ')
  };
}

// Ambil data cuaca terkini untuk sebuah koordinat
async function ambilCuaca(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    timezone: 'auto'
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error('Gagal mengambil data cuaca');
  const data = await res.json();
  return data.current;
}

function tampilkanHasilCuaca({ label, suhu, kondisi, kelembapan, angin }) {
  document.getElementById('lokasi').innerText = `Lokasi: ${label}`;
  document.getElementById('suhu').innerText = `Suhu: ${suhu} °C`;
  document.getElementById('kondisi').innerText = `Kondisi Cuaca: ${kondisi}`;
  document.getElementById('kelembapan').innerText = `Kelembapan Udara: ${kelembapan} %`;
  document.getElementById('angin').innerText = `Kecepatan Angin: ${angin} km/jam`;
}

function tampilkanStatusCuaca(pesan) {
  document.getElementById('lokasi').innerText = `Lokasi: ${pesan}`;
  document.getElementById('suhu').innerText = 'Suhu: - °C';
  document.getElementById('kondisi').innerText = 'Kondisi Cuaca: -';
  document.getElementById('kelembapan').innerText = 'Kelembapan Udara: - %';
  document.getElementById('angin').innerText = 'Kecepatan Angin: - km/jam';
}

async function cekCuaca() {
  const input = document.getElementById('kota');
  const namaKota = input.value.trim();
  const tombol = document.getElementById('tombolCek');

  if (!namaKota) {
    tampilkanStatusCuaca('Masukkan nama kota terlebih dahulu');
    input.focus();
    return;
  }

  tombol.disabled = true;
  tombol.innerText = 'Mencari...';
  tampilkanStatusCuaca('Mencari...');

  try {
    const kota = await cariKoordinatKota(namaKota);
    const cuaca = await ambilCuaca(kota.lat, kota.lon);

    tampilkanHasilCuaca({
      label: kota.label,
      suhu: cuaca.temperature_2m,
      kondisi: kodeCuacaKeTeks(cuaca.weather_code),
      kelembapan: cuaca.relative_humidity_2m,
      angin: cuaca.wind_speed_10m
    });
  } catch (err) {
    tampilkanStatusCuaca(err.message || 'Terjadi kesalahan, coba lagi');
  } finally {
    tombol.disabled = false;
    tombol.innerText = 'Cek Cuaca';
  }
}

// ==============================================
// 2. ANIMASI JANTUNG (murni JS, tanpa CSS animation)
// ==============================================
function jalankanAnimasiJantung() {
  const heart = document.querySelector('.heart');
  if (!heart) return;

  let membesar = true;
  let skala = 1;

  setInterval(() => {
    skala += membesar ? 0.015 : -0.015;
    if (skala >= 1.12) membesar = false;
    if (skala <= 1) membesar = true;

    heart.style.transform = `scale(${skala.toFixed(3)})`;
    heart.style.transition = 'transform 0.05s linear';
  }, 50);
}

// ==============================================
// 3. TOMBOL "HUBUNGI SAYA" (biodata)
// ==============================================
function pasangTombolHubungi() {
  const tombol = document.querySelector('.bio-card .btn');
  if (!tombol) return;

  tombol.addEventListener('click', () => {
    const emailEl = document.querySelector('.info-bio p:nth-child(2)');
    const email = emailEl ? emailEl.innerText.replace('Email:', '').trim() : '';
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  });
}

// ==============================================
// 4. SOROTAN LINK DAFTAR ISI SAAT SCROLL
// ==============================================
function pasangSorotanDaftarIsi() {
  const tautan = document.querySelectorAll('main > section a[href^="#"]');
  const target = Array.from(tautan)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (target.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector(`main > section a[href="#${entry.target.id}"]`);
        if (!link) return;
        link.style.color = entry.isIntersecting ? '#8C3B2E' : '';
        link.style.fontWeight = entry.isIntersecting ? '700' : '';
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  target.forEach((el) => observer.observe(el));
}

// ==============================================
// 5. INISIALISASI
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tombolCek')?.addEventListener('click', cekCuaca);
  document.getElementById('kota')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') cekCuaca();
  });

  jalankanAnimasiJantung();
  pasangTombolHubungi();
  pasangSorotanDaftarIsi();
});