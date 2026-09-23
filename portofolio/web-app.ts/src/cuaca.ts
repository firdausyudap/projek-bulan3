const OPENWEATHER_GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const OPENWEATHER_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const OPENMETEO_GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const OPENMETEO_WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

interface OpenWeatherGeoResult {
    lat: number;
    lon: number;
    name: string;
    country: string;
}

type OpenWeatherGeoResponse = OpenWeatherGeoResult[];

interface OpenMeteoGeoResult {
    latitude: number;
    longitude: number;
    name: string;
    country: string;
}

interface OpenMeteoGeoResponse {
    results: OpenMeteoGeoResult[];
}

interface WeatherCondition {
    id: number;
    main: string;
    description?: string;
    icon?: string;
}

interface CurrentWeather {
    temp: number;
    feels_like: number;
    humidity: number;
    visibility: number;
    wind: {
        speed: number;
    };
    weather: WeatherCondition[];
}

interface OpenWeatherResponse extends CurrentWeather {
    name: string;
    sys: {
        country: string;
    };
}

interface OpenMeteoWeatherResponse {
    current: {
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        weather_code: number;
        wind_speed_10m: number;
        visibility: number;
    };
}

interface WeatherData {
    name: string;
    country: string;
    current: CurrentWeather;
}

interface WeatherInfo {
    deskripsi: string;
    kondisi: string;
    iconKode: string;
    iconUrl: string;
}

const cityInput = document.getElementById("cityInput") as HTMLInputElement | null;
const apiKeyInput = document.getElementById("apiKeyInput") as HTMLInputElement | null;
const searchBtn = document.getElementById("searchBtn") as HTMLElement | null;
const loadingEl = document.getElementById("loading")!;
const errorEl = document.getElementById("error")!;
const weatherEl = document.getElementById("weather")!;
const API_KEY_STORAGE = "weatherApiKey";

function init(): void {
    if (!cityInput || !apiKeyInput || !searchBtn || !loadingEl || !errorEl || !weatherEl) {
        throw new Error("Beberapa elemen halaman tidak ditemukan.");
    }

    loadApiKey();

    apiKeyInput.addEventListener("change", saveApiKey);

    searchBtn.addEventListener("click", () => {
        const kota = cityInput.value.trim();
        if (kota) {
            ambilDataCuaca(kota);
        }
    });

    cityInput.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            const kota = cityInput.value.trim();
            if (kota) {
                ambilDataCuaca(kota);
            }
        }
    });

    ambilDataCuaca("Jakarta");
}

async function ambilDataCuaca(kota: string): Promise<void> {
    tampilkanStatus("loading");

    try {
        const apiKey = getApiKey();

        if (apiKey) {
            const dataLokasi = await fetchOpenWeatherLocation(kota, apiKey);
            const lokasi = dataLokasi[0]!;
            const weatherData = await fetchOpenWeatherWeather(lokasi, apiKey);
            tampilkanDataCuaca(weatherData);
            return;
        }

        const dataLokasi = await fetchOpenMeteoLocation(kota);
        const lokasi = dataLokasi.results[0]!;
        const weatherData = await fetchOpenMeteoWeather(lokasi);
        tampilkanDataCuaca(weatherData);
    } catch (kesalahan) {
        tampilkanStatus("error", (kesalahan as Error).message);
    }
}

async function fetchOpenWeatherLocation(kota: string, apiKey: string): Promise<OpenWeatherGeoResponse> {
    const responLokasi = await fetch(
        `${OPENWEATHER_GEO_URL}?q=${encodeURIComponent(kota)}&limit=1&appid=${encodeURIComponent(apiKey)}&lang=id`
    );

    if (!responLokasi.ok) {
        throw new Error("Gagal mengambil data lokasi");
    }

    const dataLokasi: OpenWeatherGeoResponse = await responLokasi.json();
    if (!dataLokasi || dataLokasi.length === 0) {
        throw new Error("Kota tidak ditemukan");
    }

    return dataLokasi;
}

async function fetchOpenWeatherWeather(lokasi: OpenWeatherGeoResult, apiKey: string): Promise<WeatherData> {
    const responCuaca = await fetch(
        `${OPENWEATHER_WEATHER_URL}?lat=${lokasi.lat}&lon=${lokasi.lon}&appid=${encodeURIComponent(apiKey)}&units=metric&lang=id`
    );

    if (!responCuaca.ok) {
        throw new Error("Gagal mengambil data cuaca");
    }

    const dataCuaca: OpenWeatherResponse = await responCuaca.json();
    return {
        name: dataCuaca.name,
        country: dataCuaca.sys.country,
        current: dataCuaca,
    };
}

async function fetchOpenMeteoLocation(kota: string): Promise<OpenMeteoGeoResponse> {
    const responLokasi = await fetch(
        `${OPENMETEO_GEO_URL}?name=${encodeURIComponent(kota)}&count=1&language=id&format=json`
    );

    if (!responLokasi.ok) {
        throw new Error("Gagal mengambil data lokasi");
    }

    const dataLokasi: OpenMeteoGeoResponse = await responLokasi.json();
    if (!dataLokasi.results || dataLokasi.results.length === 0) {
        throw new Error("Kota tidak ditemukan");
    }

    return dataLokasi;
}

async function fetchOpenMeteoWeather(lokasi: OpenMeteoGeoResult): Promise<WeatherData> {
    const responCuaca = await fetch(
        `${OPENMETEO_WEATHER_URL}?latitude=${lokasi.latitude}&longitude=${lokasi.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility&wind_speed_unit=kmh&timezone=auto`
    );

    if (!responCuaca.ok) {
        throw new Error("Gagal mengambil data cuaca");
    }

    const dataCuaca: OpenMeteoWeatherResponse = await responCuaca.json();
    const current = dataCuaca.current;

    return {
        name: lokasi.name,
        country: lokasi.country,
        current: {
            temp: current.temperature_2m,
            feels_like: current.apparent_temperature,
            humidity: current.relative_humidity_2m,
            visibility: current.visibility,
            wind: {
                speed: current.wind_speed_10m,
            },
            weather: [{
                id: current.weather_code,
                main: "",
            }],
        },
    };
}

function tampilkanDataCuaca(data: WeatherData): void {
    tampilkanStatus("weather");

    const cuacaSekarang = data.current;
    const kondisiCuaca = cuacaSekarang.weather[0] || { id: 800, main: "Clear", description: "Cerah", icon: "01d" };
    const infoCuaca = tentukanInfoCuaca(kondisiCuaca);

    document.getElementById("city")!.textContent = `${data.name}, ${data.country}`;
    document.getElementById("date")!.textContent = formatTanggal(new Date());
    document.getElementById("temp")!.textContent = `${Math.round(cuacaSekarang.temp)}°C`;
    document.getElementById("desc")!.textContent = infoCuaca.deskripsi;
    (document.getElementById("icon") as HTMLImageElement).src = infoCuaca.iconUrl;
    document.getElementById("humidity")!.textContent = `${cuacaSekarang.humidity ?? "-"}%`;
    document.getElementById("wind")!.textContent = `${((cuacaSekarang.wind?.speed ?? 0) * 3.6).toFixed(1)} km/jam`;
    document.getElementById("feels")!.textContent = `${Math.round(cuacaSekarang.feels_like ?? 0)}°C`;
    document.getElementById("visibility")!.textContent = `${((cuacaSekarang.visibility ?? 0) / 1000).toFixed(1)} km`;

    ubahLatar(infoCuaca.kondisi, infoCuaca.iconKode);
}

function tentukanInfoCuaca(weather: WeatherCondition | number): WeatherInfo {
    if (typeof weather === "number") {
        const cuaca = getCuacaInfoByCode(weather);
        return cuaca;
    }

    if (weather.icon && weather.description) {
        const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@4x.png`;
        const deskripsi = weather.description.charAt(0).toUpperCase() + weather.description.slice(1);

        return {
            deskripsi,
            kondisi: weather.main || "Clear",
            iconKode: weather.icon,
            iconUrl,
        };
    }

    return getCuacaInfoByCode(weather.id);
}

function getCuacaInfoByCode(kode: number): WeatherInfo {
    const cuaca: Record<number, WeatherInfo> = {
        0: { deskripsi: "Cerah", kondisi: "Clear", iconKode: "01d", iconUrl: "https://openweathermap.org/img/wn/01d@4x.png" },
        1: { deskripsi: "Sebagian cerah", kondisi: "Clear", iconKode: "02d", iconUrl: "https://openweathermap.org/img/wn/02d@4x.png" },
        2: { deskripsi: "Berawan", kondisi: "Clouds", iconKode: "03d", iconUrl: "https://openweathermap.org/img/wn/03d@4x.png" },
        3: { deskripsi: "Berawan tebal", kondisi: "Clouds", iconKode: "04d", iconUrl: "https://openweathermap.org/img/wn/04d@4x.png" },
        45: { deskripsi: "Berkabut", kondisi: "Mist", iconKode: "50d", iconUrl: "https://openweathermap.org/img/wn/50d@4x.png" },
        48: { deskripsi: "Embun beku", kondisi: "Mist", iconKode: "50d", iconUrl: "https://openweathermap.org/img/wn/50d@4x.png" },
        51: { deskripsi: "Gerimis ringan", kondisi: "Drizzle", iconKode: "09d", iconUrl: "https://openweathermap.org/img/wn/09d@4x.png" },
        53: { deskripsi: "Gerimis", kondisi: "Drizzle", iconKode: "09d", iconUrl: "https://openweathermap.org/img/wn/09d@4x.png" },
        55: { deskripsi: "Gerimis lebat", kondisi: "Drizzle", iconKode: "09d", iconUrl: "https://openweathermap.org/img/wn/09d@4x.png" },
        61: { deskripsi: "Hujan ringan", kondisi: "Rain", iconKode: "10d", iconUrl: "https://openweathermap.org/img/wn/10d@4x.png" },
        63: { deskripsi: "Hujan", kondisi: "Rain", iconKode: "10d", iconUrl: "https://openweathermap.org/img/wn/10d@4x.png" },
        65: { deskripsi: "Hujan lebat", kondisi: "Rain", iconKode: "10d", iconUrl: "https://openweathermap.org/img/wn/10d@4x.png" },
        71: { deskripsi: "Salju ringan", kondisi: "Snow", iconKode: "13d", iconUrl: "https://openweathermap.org/img/wn/13d@4x.png" },
        73: { deskripsi: "Salju", kondisi: "Snow", iconKode: "13d", iconUrl: "https://openweathermap.org/img/wn/13d@4x.png" },
        75: { deskripsi: "Salju lebat", kondisi: "Snow", iconKode: "13d", iconUrl: "https://openweathermap.org/img/wn/13d@4x.png" },
        95: { deskripsi: "Badai", kondisi: "Thunderstorm", iconKode: "11d", iconUrl: "https://openweathermap.org/img/wn/11d@4x.png" },
        96: { deskripsi: "Badai hujan es", kondisi: "Thunderstorm", iconKode: "11d", iconUrl: "https://openweathermap.org/img/wn/11d@4x.png" },
        99: { deskripsi: "Badai hujan es berat", kondisi: "Thunderstorm", iconKode: "11d", iconUrl: "https://openweathermap.org/img/wn/11d@4x.png" },
    };

    return cuaca[kode] || cuaca[0]!;
}

function formatTanggal(tanggal: Date): string {
    const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    return `${hari[tanggal.getDay()]}, ${tanggal.getDate()} ${bulan[tanggal.getMonth()]} ${tanggal.getFullYear()}`;
}

function ubahLatar(kondisi: string, kodeIkon: string): void {
    const malam = kodeIkon.includes("n");
    let gradien: string;

    if (malam) {
        gradien = "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)";
    } else {
        switch (kondisi) {
            case "Clear":
                gradien = "linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)";
                break;
            case "Clouds":
                gradien = "linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)";
                break;
            case "Rain":
            case "Drizzle":
                gradien = "linear-gradient(135deg, #4B79A1 0%, #283E51 100%)";
                break;
            case "Thunderstorm":
                gradien = "linear-gradient(135deg, #232526 0%, #414345 100%)";
                break;
            case "Snow":
                gradien = "linear-gradient(135deg, #E6DADA 0%, #274046 100%)";
                break;
            default:
                gradien = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
        }
    }

    document.body.style.background = gradien;
}

function loadApiKey(): void {
    const savedKey = localStorage.getItem(API_KEY_STORAGE);
    if (savedKey && apiKeyInput) {
        apiKeyInput.value = savedKey;
    }
}

function saveApiKey(): void {
    if (!apiKeyInput) {
        return;
    }
    localStorage.setItem(API_KEY_STORAGE, apiKeyInput.value.trim());
}

function getApiKey(): string {
    return apiKeyInput?.value.trim() ?? "";
}

function tampilkanStatus(
    jenis: "loading" | "error" | "weather",
    pesan: string = ""
): void {
    loadingEl.classList.remove("is-active");
    errorEl.classList.remove("is-active");
    weatherEl.classList.remove("is-active");

    switch (jenis) {
        case "loading":
            loadingEl.classList.add("is-active");
            break;
        case "error": {
            errorEl.classList.add("is-active");
            const pesanErrorEl = document.getElementById("pesanError");
            if (pesanErrorEl) {
                pesanErrorEl.textContent = pesan;
            }
            break;
        }
        case "weather":
            weatherEl.classList.add("is-active");
            break;
    }
}

document.addEventListener("DOMContentLoaded", init);
