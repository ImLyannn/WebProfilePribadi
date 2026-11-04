# Panduan mengisi portfolio

## 1. Ganti teks placeholder (VS Code: Ctrl+H, "Replace All" di semua file)
| Cari | Ganti dengan |
|---|---|
| `[NAMA]` | nama Anda |
| `emailanda@gmail.com` | email asli (ada di `index.html`, bagian Contact: di `href` dan teks) |
| `usernameanda` | username GitHub (sama, di `href` dan teks) |
| `[Judul portfolio]` | judul di samping logo |

Teks lain yang masih berbentuk `[seperti ini]` diisi satu per satu.

## 2. Gambar
Lihat `assets/images/README.txt` untuk daftar nama file dan ukuran. Cukup taruh file dengan nama yang sama.
Tidak perlu mengubah kode.

## 3. Link project
Di `project.html`, ganti `href="#"` pada tombol **Lihat demo** dan **Source code** dengan link asli.
Setelah semua terisi, hapus "Bagian 4" di `js/script.js`.

## 4. Menu dan footer
Header dan footer ada di setiap file HTML. Kalau mengubah menu, ubah di `index.html`, `about.html`, `skill.html`, dan `project.html`.

## 5. Warna
Semua warna ada di bagian `:root` pada `css/base.css`.

## 6. Menjalankan
Buka `index.html` di browser (atau pakai ekstensi Live Server di VS Code).
