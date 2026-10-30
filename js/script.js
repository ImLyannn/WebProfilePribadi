// script.js
// Bagian 1: menampilkan satu panel pada satu waktu (halaman About, Skill, Project).
// Panel dipilih lewat alamat (#project-4). Sidebar, indikator, dan tombol Back browser ikut berubah.

const panels = document.querySelectorAll(".panel");
const sideLinks = document.querySelectorAll(".side-item");
const dots = document.querySelectorAll(".page-indicator .dot");
const count = document.querySelector(".page-indicator .count");
const indicator = document.querySelector(".page-indicator");

function showPanel(id) {
  // cari nomor panel yang cocok; kalau tidak ada, pakai panel pertama
  let index = 0;
  panels.forEach(function (panel, i) {
    if (panel.id === id) index = i;
  });

  panels.forEach(function (panel, i) {
    panel.hidden = i !== index;
  });

  sideLinks.forEach(function (link, i) {
    link.classList.toggle("is-active", i === index);
    if (i === index) {
      link.setAttribute("aria-current", "page");
      // di layar kecil sidebar berupa tab: geser agar tab aktif terlihat
      link.scrollIntoView({ block: "nearest", inline: "center" });
    } else {
      link.removeAttribute("aria-current");
    }
  });

  dots.forEach(function (dot, i) {
    dot.classList.toggle("is-active", i === index);
  });

  const nomor = String(index + 1).padStart(2, "0");
  const total = String(panels.length).padStart(2, "0");
  count.textContent = nomor + " / " + total;
  indicator.setAttribute("aria-label", "Halaman " + (index + 1) + " dari " + panels.length);
}

function showFromHash() {
  showPanel(location.hash.slice(1));
}

if (panels.length > 0) {
  window.addEventListener("hashchange", showFromHash);
  showFromHash();
}

// Bagian 2: tombol Menu untuk layar kecil (membuka dan menutup navbar).
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

function aturMenu(buka) {
  mainNav.classList.toggle("is-open", buka);
  menuToggle.setAttribute("aria-expanded", buka);
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", function () {
    aturMenu(!mainNav.classList.contains("is-open"));
  });

  // tombol Esc menutup menu dan mengembalikan fokus ke tombol Menu
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
      aturMenu(false);
      menuToggle.focus();
    }
  });
}

// Bagian 3: link placeholder (href="#") tidak boleh mengubah alamat,
// kalau tidak panel akan kembali ke panel pertama. Hapus bagian ini
// kalau semua link placeholder sudah Anda ganti dengan link asli.
document.querySelectorAll('a[href="#"]').forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
  });
});
