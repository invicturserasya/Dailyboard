export async function ambilKutipan() {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    const data = await res.json();
    const elKutipan = document.getElementById("kutipan-harian");
    if (elKutipan) {
      elKutipan.textContent = data.quote;
    }
    return data;
  } catch (error) {
    console.error("Gagal mengambil kutipan:", error);
    const elKutipan = document.getElementById("kutipan-harian");
    if (elKutipan) {
      elKutipan.textContent = "Kutipan hari ini belum dapat dimuat.";
    }
  }
}

export async function ambilCuaca(kota) {
  const API_KEY_CUACA = "fe7136123fe81409b9a62205bda71661";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(kota)}&appid=${API_KEY_CUACA}&units=metric&lang=id`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Kota tidak ditemukan!");
  }
  return response.json();
}