// script.js - dibagi per bagian bernomor; tiap bagian berdiri sendiri.

// Bagian 1: foto dan logo.
// Kalau file gambar ada, gambar menutupi kotak placeholder.
// Kalau file belum ada, gambar dibuang dan placeholder tetap terlihat.
document.querySelectorAll(".photo-slot img, .brand-logo img").forEach(function (img) {
  const wadah = img.parentElement;
  function berhasil() { wadah.classList.add("has-image"); }
  function gagal() { img.remove(); }
  if (img.complete) {
    if (img.naturalWidth > 0) berhasil(); else gagal();
  } else {
    img.addEventListener("load", berhasil);
    img.addEventListener("error", gagal);
  }
});

// Bagian 2: menampilkan satu panel pada satu waktu (halaman About, Skill, Project).
// Panel dipilih lewat alamat (#project-4). Sidebar, indikator, dan tombol Back browser ikut berubah.
const panels = document.querySelectorAll(".panel");
const sideLinks = document.querySelectorAll(".side-item");
const dots = document.querySelectorAll(".page-indicator .dot");
const count = document.querySelector(".page-indicator .count");
const indicator = document.querySelector(".page-indicator");

function showPanel(id, pindah) {
  let index = 0;
  panels.forEach(function (panel, i) {
    if (panel.id === id) index = i;
  });

  panels.forEach(function (panel, i) {
    panel.hidden = i !== index;
  });

  sideLinks.forEach(function (link, i) {
    link.classList.toggle("is-active", i === index);
    if (i === index) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  // di layar kecil sidebar berupa tab yang bisa digeser: tampilkan tab aktif di tengah
  const daftar = sideLinks[index] && sideLinks[index].closest(".side-list");
  if (daftar && daftar.scrollWidth > daftar.clientWidth) {
    const tab = sideLinks[index];
    daftar.scrollTo({ left: tab.offsetLeft - (daftar.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }

  dots.forEach(function (dot, i) {
    dot.classList.toggle("is-active", i === index);
  });
  if (count) count.textContent = String(index + 1).padStart(2, "0") + " / " + String(panels.length).padStart(2, "0");
  if (indicator) indicator.setAttribute("aria-label", "Halaman " + (index + 1) + " dari " + panels.length);

  // hanya saat pengunjung berpindah panel (bukan saat halaman pertama dibuka):
  // kembali ke atas, lalu arahkan fokus ke judul agar pembaca layar tahu isinya berganti
  if (pindah) {
    window.scrollTo(0, 0);
    const judul = panels[index].querySelector("h1");
    if (judul) {
      judul.setAttribute("tabindex", "-1");
      judul.focus({ preventScroll: true });
    }
  }
}

if (panels.length > 0) {
  window.addEventListener("hashchange", function () { showPanel(location.hash.slice(1), true); });
  showPanel(location.hash.slice(1), false);
}

// Bagian 3: tombol Menu untuk layar kecil.
// Menu menutup saat: link diklik, area luar diklik, atau tombol Esc ditekan.
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
  mainNav.addEventListener("click", function (event) {
    if (event.target.closest("a")) aturMenu(false);
  });
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".header-right")) aturMenu(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
      aturMenu(false);
      menuToggle.focus();
    }
  });
}

// Bagian 4: link placeholder (href="#") tidak boleh melompat ke atas halaman.
// Hapus bagian ini kalau semua link placeholder sudah diganti link asli.
document.querySelectorAll('a[href="#"]').forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
  });
});

// Bagian 5: di index.html, tandai menu navbar sesuai bagian yang sedang terlihat.
const sections = document.querySelectorAll(".section");
if (sections.length > 0 && "IntersectionObserver" in window) {
  const navLinks = document.querySelectorAll(".main-nav a");
  const pengamat = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute("href") === "index.html#" + entry.target.id) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach(function (section) { pengamat.observe(section); });
}

// Bagian 6: tahun otomatis di footer.
document.querySelectorAll("[data-year]").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});
