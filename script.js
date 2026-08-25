// Script Utama Aplikasi
import { ambilKutipan, ambilCuaca } from "./api.js";
import { simpanKeStorage, muatDariStorage, muatCatatanStorage, simpanCatatanStorage } from "./storage.js";
import { tambahTugas } from "./tugas.js";
import { tambahCatatan, hapusCatatan } from "./catatan.js";

console.log("DailyBoard siap dijalankan!");

const app = document.getElementById("app");

// Header & Status Loading
const headerBanner = document.createElement("div");
headerBanner.style.textAlign = "center";
headerBanner.style.padding = "20px";

const judulSelamatDatang = document.createElement("h1");
judulSelamatDatang.textContent = "Selamat Datang di DailyBoard!";
judulSelamatDatang.style.color = "#2563eb";

const statusLoading = document.createElement("p");
statusLoading.id = "status-loading";
statusLoading.textContent = "Memuat data...";
statusLoading.style.fontWeight = "bold";

headerBanner.append(judulSelamatDatang, statusLoading);
app.appendChild(headerBanner);

// Kutipan Hari Ini
const kutipanSection = document.createElement("section");
const kutipanHeader = document.createElement("div");
const judulKutipan = document.createElement("h2");
const kutipanHarian = document.createElement("p");
const btnGantiKutipan = document.createElement("button");

judulKutipan.textContent = "Kata-kata Hari Ini";
kutipanHarian.id = "kutipan-harian";
kutipanHarian.textContent = "Memuat kutipan...";
btnGantiKutipan.textContent = "Ganti Kutipan";
btnGantiKutipan.type = "button";

kutipanHeader.className = "kutipan-header";
kutipanHeader.append(judulKutipan, btnGantiKutipan);
kutipanSection.append(kutipanHeader, kutipanHarian);
app.appendChild(kutipanSection);

btnGantiKutipan.onclick = () => ambilKutipan();

const tugasSection = document.createElement("section");
const catatanSection = document.createElement("section");
const cuacaSection = document.createElement("section");

tugasSection.innerHTML = "<h2> Daftar Tugas</h2>";
catatanSection.innerHTML = "<h2> Catatan</h2>";
cuacaSection.innerHTML = "<h2> Cuaca</h2>";

app.append(tugasSection, catatanSection, cuacaSection);

// Input & Filter Tugas
const inputTugas = document.createElement("input");
const btnTambah = document.createElement("button");

inputTugas.placeholder = "Masukkan tugas...";
btnTambah.textContent = "Tambah";

const filterBox = document.createElement("div");
const btnSemua = document.createElement("button");
const btnSelesai = document.createElement("button");
const btnBelum = document.createElement("button");

btnSemua.textContent = "Semua";
btnSelesai.textContent = "Selesai";
btnBelum.textContent = "Belum Selesai";

filterBox.append(btnSemua, btnSelesai, btnBelum);
tugasSection.append(inputTugas, btnTambah, filterBox);

let daftarTugas = muatDariStorage();
let nextId = Math.max(...daftarTugas.map((t) => t.id), 0) + 1;
let filterAktif = "semua";

const listTugas = document.createElement("ul");
tugasSection.appendChild(listTugas);

function simpanTugas() {
  simpanKeStorage(daftarTugas);
}

function renderTugas() {
  listTugas.innerHTML = "";
  let data = daftarTugas;

  if (filterAktif === "selesai") data = daftarTugas.filter((tugas) => tugas.selesai);
  if (filterAktif === "belum") data = daftarTugas.filter((tugas) => !tugas.selesai);

  data.forEach((tugas) => {
    const li = document.createElement("li");
    li.dataset.id = tugas.id;
    li.draggable = true;
    li.className = "tugas-item";

    const nama = document.createElement("span");
    nama.textContent = tugas.nama;
    nama.title = "Double klik untuk merubah";

    if (tugas.selesai) nama.classList.add("selesai");

    nama.ondblclick = (e) => {
      e.stopPropagation();
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = tugas.nama;
      inputEdit.style.fontSize = "inherit";

      const simpanPerubahan = () => {
        const namaBaru = inputEdit.value.trim();
        if (namaBaru) {
          tugas.nama = namaBaru;
          simpanTugas();
        }
        renderTugas();
      };

      inputEdit.onblur = simpanPerubahan;
      inputEdit.onkeydown = (ev) => {
        if (ev.key === "Enter") simpanPerubahan();
        if (ev.key === "Escape") renderTugas();
      };

      li.replaceChild(inputEdit, nama);
      inputEdit.focus();
    };

    const btnUbah = document.createElement("button");
    btnUbah.textContent = "Ubah";
    btnUbah.onclick = () => nama.dispatchEvent(new Event("dblclick"));

    const btnHapus = document.createElement("button");
    btnHapus.textContent = "Hapus";
    btnHapus.onclick = () => {
      if (!confirm("Yakin ingin menghapus tugas ini?")) return;
      daftarTugas = daftarTugas.filter((item) => item.id !== tugas.id);
      simpanTugas();
      renderTugas();
    };

    li.append(nama, btnUbah, btnHapus);
    listTugas.appendChild(li);
  });
}

renderTugas();

btnTambah.onclick = () => {
  const nama = inputTugas.value.trim();
  if (!nama) return alert("Tugas tidak boleh kosong!");

  daftarTugas = tambahTugas(daftarTugas, nama, nextId++);
  inputTugas.value = "";
  renderTugas();
};

listTugas.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;
  const li = e.target.closest("li");
  if (!li) return;

  const tugas = daftarTugas.find((t) => t.id === Number(li.dataset.id));
  if (tugas) {
    tugas.selesai = !tugas.selesai;
    simpanTugas();
    renderTugas();
  }
});

btnSemua.onclick = () => { filterAktif = "semua"; renderTugas(); };
btnSelesai.onclick = () => { filterAktif = "selesai"; renderTugas(); };
btnBelum.onclick = () => { filterAktif = "belum"; renderTugas(); };

// Drag & Drop
let tugasDipindah = null;
listTugas.addEventListener("dragstart", (e) => {
  if (e.target.tagName === "LI") tugasDipindah = e.target;
});
listTugas.addEventListener("dragover", (e) => e.preventDefault());
listTugas.addEventListener("drop", (e) => {
  e.preventDefault();
  const target = e.target.closest("li");
  if (!target || target === tugasDipindah) return;

  listTugas.insertBefore(tugasDipindah, target);
  const urutan = [...listTugas.children].map((li) => Number(li.dataset.id));
  daftarTugas.sort((a, b) => urutan.indexOf(a.id) - urutan.indexOf(b.id));
  simpanTugas();
});

// Catatan Section
const inputCatatan = document.createElement("textarea");
const btnCatatan = document.createElement("button");
const daftarCatatan = document.createElement("div");

inputCatatan.placeholder = "Tulis catatan...";
btnCatatan.textContent = "Tambah Catatan";
catatanSection.append(inputCatatan, btnCatatan, daftarCatatan);

let catatan = muatCatatanStorage();

function renderCatatan() {
  daftarCatatan.innerHTML = "";
  catatan.forEach((item, index) => {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "6px";

    const teks = document.createElement("span");
    teks.textContent = "📌 " + item + " ";
    teks.style.cursor = "pointer";
    teks.title = "Double klik untuk merubah";

    teks.ondblclick = () => {
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = item;

      const simpanPerubahan = () => {
        const catatanBaru = inputEdit.value.trim();
        if (catatanBaru) {
          catatan[index] = catatanBaru;
          simpanCatatanStorage(catatan);
        }
        renderCatatan();
      };

      inputEdit.onblur = simpanPerubahan;
      inputEdit.onkeydown = (ev) => {
        if (ev.key === "Enter") simpanPerubahan();
        if (ev.key === "Escape") renderCatatan();
      };

      wrapper.replaceChild(inputEdit, teks);
      inputEdit.focus();
    };

    const btnUbah = document.createElement("button");
    btnUbah.textContent = "Ubah";
    btnUbah.onclick = () => teks.dispatchEvent(new Event("dblclick"));

    const hapus = document.createElement("button");
    hapus.textContent = "Hapus";
    hapus.onclick = () => {
      catatan = hapusCatatan(catatan, index);
      renderCatatan();
    };

    wrapper.append(teks, btnUbah, hapus);
    daftarCatatan.appendChild(wrapper);
  });
}

btnCatatan.onclick = () => {
  const isi = inputCatatan.value.trim();
  if (!isi) return;
  catatan = tambahCatatan(catatan, isi);
  inputCatatan.value = "";
  renderCatatan();
};

renderCatatan();

// Cuaca Section
const inputKota = document.createElement("input");
const btnCuaca = document.createElement("button");
const meWraperCuaca = document.createElement("div");
meWraperCuaca.id = "info-cuaca";

inputKota.placeholder = "Masukkan kota...";
btnCuaca.textContent = "Cek Cuaca";
cuacaSection.append(inputKota, btnCuaca, meWraperCuaca);

async function tampilkanCuaca(kota) {
  inputKota.value = kota;
  if (!kota) {
    meWraperCuaca.textContent = "Masukkan nama kota!";
    return;
  }
  meWraperCuaca.textContent = "Loading...";

  try {
    await ambilCuaca(kota);
    localStorage.setItem("kotaCuacaTerakhir", kota);
  } catch (error) {
    meWraperCuaca.textContent = error.message;
  }
}

btnCuaca.onclick = () => tampilkanCuaca(inputKota.value.trim());

// Pencarian (Search)
const search = document.createElement("input");
search.placeholder = "🔍 Cari tugas...";
tugasSection.insertBefore(search, listTugas);

search.oninput = () => {
  const keyword = search.value.toLowerCase();
  const hasil = daftarTugas.filter((tugas) =>
    tugas.nama.toLowerCase().includes(keyword)
  );

  listTugas.innerHTML = "";
  hasil.forEach((tugas) => {
    const li = document.createElement("li");
    li.textContent = tugas.nama;
    li.dataset.id = tugas.id;
    li.draggable = true;
    li.className = "tugas-item";
    if (tugas.selesai) li.classList.add("selesai");
    listTugas.appendChild(li);
  });
};

// Dark Mode Toggle
const btnDark = document.createElement("button");
function perbaruiTeksTema() {
  const gelap = document.body.classList.contains("dark-mode");
  btnDark.textContent = gelap ? "☀️ Mode Terang" : "🌙 Mode Gelap";
}

app.prepend(btnDark);

btnDark.onclick = () => {
  document.body.classList.toggle("dark-mode");
  const gelap = document.body.classList.contains("dark-mode");
  localStorage.setItem("tema", gelap ? "gelap" : "terang");
  perbaruiTeksTema();
};

if (localStorage.getItem("tema") === "gelap") {
  document.body.classList.add("dark-mode");
}
perbaruiTeksTema();

// Inisialisasi Data
async function muatSemuaData() {
  try {
    const kotaCuacaTerakhir = localStorage.getItem("kotaCuacaTerakhir");
    const janjiData = [ambilKutipan()];
    if (kotaCuacaTerakhir) janjiData.push(tampilkanCuaca(kotaCuacaTerakhir));

    await Promise.all(janjiData);
    statusLoading.textContent = "Data berhasil dimuat!";
  } catch (error) {
    statusLoading.textContent = "Gagal memuat sebagian data.";
  }
}

muatSemuaData();

// Debounce Optimasi
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const cariTugasDebounced = debounce((kataKunci) => {
  const hasil = daftarTugas.filter((t) =>
    t.nama.toLowerCase().includes(kataKunci.toLowerCase())
  );
  listTugas.innerHTML = "";
  hasil.forEach((tugas) => {
    const li = document.createElement("li");
    li.textContent = tugas.nama;
    li.dataset.id = tugas.id;
    li.className = "tugas-item";
    if (tugas.selesai) li.classList.add("selesai");
    listTugas.appendChild(li);
  });
}, 300);

const inputCari = document.getElementById("cari-tugas");
if (inputCari) {
  inputCari.addEventListener("input", (e) => {
    cariTugasDebounced(e.target.value);
  });
}