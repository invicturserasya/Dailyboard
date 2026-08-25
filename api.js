// api.js
export async function ambilKutipan() {
  const res = await fetch("https://api.quotable.io/random");
  const data = await res.json();

  document.getElementById("kutipan-harian").textContent =
    data.content;

  return data;
}

export async function ambilCuaca(kota) {
  // Isi API key sesuai kode API cuaca yang sudah digunakan pada Fase 4.
  const apiKey = "API KEY ANDA";
  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${kota}&appid=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Kota tidak ditemukan");

  const data = await res.json();

  const infoCuaca = document.getElementById("info-cuaca");
  if (infoCuaca) {
    infoCuaca.innerHTML = `
      <p>${data.name}: ${data.main.temp}°C</p>
      <p>${data.weather[0].description}</p>
    `;
  }

  return data;
}
