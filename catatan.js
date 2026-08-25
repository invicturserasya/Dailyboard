
// Manajemen Catatanimport { simpanCatatanStorage } from "./storage.js";

export function tambahCatatan(catatanList, teks) {
  catatanList.push(teks);
  simpanCatatanStorage(catatanList);
  return catatanList;
}

export function hapusCatatan(catatanList, index) {
  catatanList.splice(index, 1);
  simpanCatatanStorage(catatanList);
  return catatanList;
}