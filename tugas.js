// Manajemen Tugas lalu simpan
import { simpanKeStorage } from "./storage.js";

export function tambahTugas(daftar, nama, id) {
  const baru = [...daftar, { id: id, nama: nama, selesai: false }];
  simpanKeStorage(baru);
  return baru;
}