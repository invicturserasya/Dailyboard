// LocalStorage
const tugasAwal = [
  { id: 1, nama: "Belajar JavaScript", selesai: false },
  { id: 2, nama: "Mengerjakan tugas", selesai: false }
];

export function simpanKeStorage(daftarTugas) {
  localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

export function muatDariStorage() {
  const data = localStorage.getItem("daftarTugas");
  return data ? JSON.parse(data) : tugasAwal;
}

export function simpanCatatanStorage(catatan) {
  localStorage.setItem("catatan", JSON.stringify(catatan));
}

export function muatCatatanStorage() {
  return JSON.parse(localStorage.getItem("catatan")) || [];
}