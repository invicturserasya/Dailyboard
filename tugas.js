// tugas.js
export function tambahTugas(daftar, nama) {
  return [...daftar, { id: Date.now(), nama, selesai: false }];
}
