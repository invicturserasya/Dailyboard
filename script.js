// ==================================================
// DAILYBOARD
// ==================================================

console.log("DailyBoard siap dijalankan!");

// ==================================================
// DOM
// Fase 2 — Fitur To-Do List: Membuat elemen antarmuka.
// ==================================================

const app = document.getElementById("app");

// ==================================================
// HEADER & STATUS LOADING
// ==================================================

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

// ==================================================
// KUTIPAN HARI INI
// Fase 4 — Integrasi API: Mengambil kutipan acak.
// ==================================================

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

async function ambilKutipan() {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    const data = await res.json();

    document.getElementById("kutipan-harian").textContent = data.quote;
  } catch (error) {
    console.error("Gagal mengambil kutipan:", error);
    document.getElementById("kutipan-harian").textContent =
      "Kutipan hari ini belum dapat dimuat.";
  }
}

btnGantiKutipan.onclick = ambilKutipan;

const tugasSection = document.createElement("section");
const catatanSection = document.createElement("section");
const cuacaSection = document.createElement("section");

tugasSection.innerHTML = "<h2> Daftar Tugas</h2>";
catatanSection.innerHTML = "<h2> Catatan</h2>";
cuacaSection.innerHTML = "<h2> Cuaca</h2>";

app.append(tugasSection, catatanSection, cuacaSection);

// ==================================================
// TUGAS
// Fase 2 — Fitur To-Do List: Membuat daftar tugas.
// ==================================================

const inputTugas = document.createElement("input");
const btnTambah = document.createElement("button");

inputTugas.placeholder = "Masukkan tugas...";
btnTambah.textContent = "Tambah";

// Pilihan filter
const filterBox = document.createElement("div");

const btnSemua = document.createElement("button");
const btnSelesai = document.createElement("button");
const btnBelum = document.createElement("button");

btnSemua.textContent = "Semua";
btnSelesai.textContent = "Selesai";
btnBelum.textContent = "Belum Selesai";

filterBox.append(btnSemua, btnSelesai, btnBelum);

tugasSection.append(inputTugas, btnTambah, filterBox);

// Data tugas
const tugasAwal = [
  {
    id: 1,
    nama: "Belajar JavaScript",
    selesai: false,
  },
  {
    id: 2,
    nama: "Mengerjakan tugas",
    selesai: false,
  },
];

let daftarTugas = [];

function simpanKeStorage() {
  localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

function muatDariStorage() {
  const data = localStorage.getItem("daftarTugas");

  return data ? JSON.parse(data) : tugasAwal;
}

daftarTugas = muatDariStorage();

let nextId = Math.max(...daftarTugas.map((t) => t.id), 0) + 1;

let filterAktif = "semua";

const listTugas = document.createElement("ul");

tugasSection.appendChild(listTugas);

// ==================================================
// SIMPAN TUGAS
// Fase 3 — LocalStorage dan Catatan: Menyimpan data tugas.
// ==================================================

function simpanTugas() {
  simpanKeStorage();
}

// ==================================================
// TAMPILKAN TUGAS
// Fase 2 — Fitur To-Do List: Menampilkan data tugas.
// ==================================================

function renderTugas() {
  listTugas.innerHTML = "";

  let data = daftarTugas;

  if (filterAktif === "selesai") {
    data = daftarTugas.filter((tugas) => tugas.selesai);
  }

  if (filterAktif === "belum") {
    data = daftarTugas.filter((tugas) => !tugas.selesai);
  }

  data.forEach((tugas) => {
    const li = document.createElement("li");

    li.dataset.id = tugas.id;
    li.draggable = true;
    li.className = "tugas-item";

    // Nama tugas
    const nama = document.createElement("span");
    nama.textContent = tugas.nama;
    nama.title = "Double klik untuk merubah";

    if (tugas.selesai) {
      nama.classList.add("selesai");
    }

    // Edit langsung via Double Klik
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

    // Tombol Ubah
    const btnUbah = document.createElement("button");
    btnUbah.textContent = "Ubah";

    btnUbah.onclick = () => {
      nama.dispatchEvent(new Event("dblclick"));
    };

    // Tombol Hapus
    const btnHapus = document.createElement("button");
    btnHapus.textContent = "Hapus";

    btnHapus.onclick = () => {
      const yakin = confirm("Yakin ingin menghapus tugas ini?");
      if (!yakin) return;

      daftarTugas = daftarTugas.filter((item) => item.id !== tugas.id);
      simpanTugas();
      renderTugas();
    };

    li.append(nama, btnUbah, btnHapus);
    listTugas.appendChild(li);
  });
}

renderTugas();

// ==================================================
// TAMBAH TUGAS
// Fase 2 — Fitur To-Do List: Menambah tugas baru.
// ==================================================

btnTambah.onclick = () => {
  const nama = inputTugas.value.trim();

  if (!nama) {
    alert("Tugas tidak boleh kosong!");
    return;
  }

  daftarTugas.push({
    id: nextId++,
    nama: nama,
    selesai: false,
  });

  inputTugas.value = "";

  simpanTugas();
  renderTugas();
};

// ==================================================
// SELESAI / BELUM SELESAI
// Fase 2 — Fitur To-Do List: Mengubah status tugas.
// ==================================================

listTugas.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") {
    return;
  }

  const li = e.target.closest("li");

  if (!li) return;

  const tugas = daftarTugas.find((t) => t.id === Number(li.dataset.id));

  if (tugas) {
    tugas.selesai = !tugas.selesai;
    simpanTugas();
    renderTugas();
  }
});

// ==================================================
// FILTER
// Fase 2 — Fitur To-Do List: Memfilter status tugas.
// ==================================================

btnSemua.onclick = () => {
  filterAktif = "semua";
  renderTugas();
};

btnSelesai.onclick = () => {
  filterAktif = "selesai";
  renderTugas();
};

btnBelum.onclick = () => {
  filterAktif = "belum";
  renderTugas();
};

// ==================================================
// DRAG & DROP
// Fase 5 — Pencarian, Dark Mode, dan Drag & Drop: Mengatur urutan tugas.
// ==================================================

let tugasDipindah = null;

listTugas.addEventListener("dragstart", (e) => {
  if (e.target.tagName === "LI") {
    tugasDipindah = e.target;
  }
});

listTugas.addEventListener("dragover", (e) => {
  e.preventDefault();
});

listTugas.addEventListener("drop", (e) => {
  e.preventDefault();

  const target = e.target.closest("li");

  if (!target || target === tugasDipindah) {
    return;
  }

  listTugas.insertBefore(tugasDipindah, target);

  const urutan = [...listTugas.children].map((li) => Number(li.dataset.id));

  daftarTugas.sort((a, b) => urutan.indexOf(a.id) - urutan.indexOf(b.id));

  simpanTugas();
});

// ==================================================
// CATATAN
// Fase 3 — LocalStorage dan Catatan: Menambah dan Mengubah catatan.
// ==================================================

const inputCatatan = document.createElement("textarea");

const btnCatatan = document.createElement("button");

const daftarCatatan = document.createElement("div");

inputCatatan.placeholder = "Tulis catatan...";

btnCatatan.textContent = "Tambah Catatan";

catatanSection.append(inputCatatan, btnCatatan, daftarCatatan);

let catatan = JSON.parse(localStorage.getItem("catatan")) || [];

function renderCatatan() {
  daftarCatatan.innerHTML = "";

  catatan.forEach((item, index) => {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "6px";

    const teks = document.createElement("span");
    teks.textContent = "📌 " + item + " ";
    teks.style.cursor = "pointer";
    teks.title = "Double klik untuk merubah";

    // Edit langsung via Double Klik
    teks.ondblclick = () => {
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = item;

      const simpanPerubahan = () => {
        const catatanBaru = inputEdit.value.trim();
        if (catatanBaru) {
          catatan[index] = catatanBaru;
          localStorage.setItem("catatan", JSON.stringify(catatan));
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

    // Tombol Ubah
    const btnUbah = document.createElement("button");
    btnUbah.textContent = "Ubah";

    btnUbah.onclick = () => {
      teks.dispatchEvent(new Event("dblclick"));
    };

    // Tombol Hapus
    const hapus = document.createElement("button");
    hapus.textContent = "Hapus";

    hapus.onclick = () => {
      catatan.splice(index, 1);
      localStorage.setItem("catatan", JSON.stringify(catatan));
      renderCatatan();
    };

    wrapper.append(teks, btnUbah, hapus);
    daftarCatatan.appendChild(wrapper);
  });
}

btnCatatan.onclick = () => {
  const isi = inputCatatan.value.trim();

  if (!isi) return;

  catatan.push(isi);

  localStorage.setItem("catatan", JSON.stringify(catatan));

  inputCatatan.value = "";

  renderCatatan();
};

renderCatatan();

// ==================================================
// CUACA
// Fase 4 — Integrasi API: Mengambil data cuaca.
// ==================================================

const API_KEY_CUACA = "fe7136123fe81409b9a62205bda71661";

async function ambilCuaca(kota) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(kota)}&appid=${API_KEY_CUACA}&units=metric&lang=id`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Kota tidak ditemukan!");
  }

  return response.json();
}

const inputKota = document.createElement("input");

const btnCuaca = document.createElement("button");

const hasilCuaca = document.createElement("p");

inputKota.placeholder = "Masukkan kota...";

btnCuaca.textContent = "Cek Cuaca";

cuacaSection.append(inputKota, btnCuaca, hasilCuaca);

async function tampilkanCuaca(kota) {
  inputKota.value = kota;

  if (!kota) {
    hasilCuaca.textContent = "Masukkan nama kota!";
    return;
  }

  hasilCuaca.textContent = "Loading...";

  try {
    const data = await ambilCuaca(kota);

    hasilCuaca.textContent = `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;

    localStorage.setItem("kotaCuacaTerakhir", kota);
  } catch (error) {
    hasilCuaca.textContent = error.message;
  }
}

btnCuaca.onclick = () => {
  const kota = inputKota.value.trim();

  tampilkanCuaca(kota);
};

const kotaCuacaTerakhir = localStorage.getItem("kotaCuacaTerakhir");

// ==================================================
// INISIALISASI DATA & STATUS LOADING
// ==================================================

async function muatSemuaData() {
  try {
    const janjiData = [ambilKutipan()];

    if (kotaCuacaTerakhir) {
      janjiData.push(tampilkanCuaca(kotaCuacaTerakhir));
    }

    await Promise.all(janjiData);

    statusLoading.textContent = "Data berhasil dimuat!";
  } catch (error) {
    statusLoading.textContent = "Gagal memuat sebagian data.";
  }
}

muatSemuaData();

// ==================================================
// SEARCH
// Fase 5 — Pencarian, Dark Mode, dan Drag & Drop: Mencari tugas.
// ==================================================

const search = document.createElement("input");

search.placeholder = "🔍 Cari tugas...";

tugasSection.insertBefore(search, listTugas);

search.oninput = () => {
  const keyword = search.value.toLowerCase();

  const hasil = daftarTugas.filter((tugas) =>
    tugas.nama.toLowerCase().includes(keyword),
  );

  listTugas.innerHTML = "";

  hasil.forEach((tugas) => {
    const li = document.createElement("li");

    li.textContent = tugas.nama;

    li.dataset.id = tugas.id;

    li.draggable = true;

    li.className = "tugas-item";

    if (tugas.selesai) {
      li.classList.add("selesai");
    }

    listTugas.appendChild(li);
  });
};

// ==================================================
// DARK MODE
// Fase 5 — Pencarian, Dark Mode, dan Drag & Drop: Mengatur tema.
// ==================================================

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

// ==================================================
// FASE 6 — Optimasi Performa & Deployment
// ==================================================

function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const cariTugasDebounced = debounce((kataKunci) => {
  if (typeof renderTugasKustom === "function") {
    const hasil = daftarTugas.filter((t) =>
      t.nama.toLowerCase().includes(kataKunci.toLowerCase())
    );
    renderTugasKustom(hasil);
  }
}, 300);

const inputCari = document.getElementById("cari-tugas");
if (inputCari) {
  inputCari.addEventListener("input", (e) => {
    cariTugasDebounced(e.target.value);
  });
}
